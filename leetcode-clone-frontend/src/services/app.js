import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Assuming no /api/ prefix as you mentioned
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response, // Simply return the response if it's successful
  (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized and it's not a retry request
    if (error.response.status === 401 && !originalRequest._retry) {
      // The "token_not_valid" code is sent by DRF Simple JWT on token expiration
      if (error.response.data.code === 'token_not_valid') {
        console.log('Access token expired. Logging out.');
        
        // Clear tokens from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Redirect to the login page
        // We use window.location instead of useNavigate because this is outside a React component
        window.location.href = '/login';
        
        return Promise.reject(error);
      }
    }
    
    // For any other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default apiClient;