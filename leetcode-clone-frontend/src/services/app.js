import axios from 'axios';

// Get the API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: apiUrl, // Use the environment variable here
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

// Interceptor to handle responses and token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized error
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check for the specific error code from Simple JWT
      if (error.response.data.code === 'token_not_valid') {
        console.log('Access token expired. Logging out.');
        
        // Clear tokens from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Redirect to the login page
        window.location.href = '/login';
        
        return Promise.reject(error);
      }
    }
    
    // For any other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default apiClient;