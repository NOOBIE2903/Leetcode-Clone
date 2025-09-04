import os
import requests
from django.conf import settings

LANGUAGE_ID_MAP = {
    'python': 71,
    'javascript': 63,
    'cpp': 54,  
}

def execute_code(code, language, problem):
    """
    Sends code and test cases to Judge0 for execution and returns the result.
    """
    language_id = LANGUAGE_ID_MAP.get(language.lower())
    if not language_id:
        return {'status': 'Error', 'output': 'Unsupported language'}

    api_key = os.environ.get('JUDGE0_RAPIDAPI_KEY')
    api_url = "https://judge0-ce.p.rapidapi.com/submissions"
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "content-type": "application/json",
    }
    
    for test_case in problem.test_cases.all():
        payload = {
            "language_id": language_id,
            "source_code": code,
            "stdin": test_case.input_data,
            "expected_output": test_case.expected_output
        }
        
        try:
            response = requests.post(api_url, json=payload, headers=headers, params={"base64_encoded": "false", "wait": "true"})
            response.raise_for_status()
            
            result = response.json()
            status_description = result.get('status', {}).get('description')
            
            if status_description == 'Compilation Error':
                return {
                    'status': 'Compilation Error',
                    'output': result.get('compile_output')
                }
            
            if status_description != 'Accepted':
                return {
                    'status': status_description, 
                    'output': result.get('stdout') or result.get('stderr')
                }
        except requests.exceptions.RequestException as e:
            return {'status': 'API Error', 'output': str(e)}

    return {'status': 'Accepted', 'output': 'All test cases passed!'}