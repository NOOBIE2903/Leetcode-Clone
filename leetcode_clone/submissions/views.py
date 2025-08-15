# submissions/views.py
from rest_framework import generics, permissions
from .models import Submission
from .serializers import SubmissionSerializer
from .judge_service import execute_code
# You would also import your code execution logic here

class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own submissions
        return Submission.objects.filter(user=self.request.user)

class SubmissionCreateView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # First, save the submission with the user and "Pending" status
        submission = serializer.save(user=self.request.user, status='Pending')
        
        # Now, call the judging service
        result = execute_code(
            code=submission.code,
            language=submission.language,
            problem=submission.problem
        )
        
        # Update the submission with the result from the judge
        submission.status = result['status']
        submission.output = result['output']
        submission.save()