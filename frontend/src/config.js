// API Configuration
// In production (Railway), frontend and backend are served from the same domain
// So we use an empty string to make API calls relative to the current domain
// In development, we use localhost:8000

const getApiBaseUrl = () => {
  // If REACT_APP_API_URL is explicitly set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In production (when running on Railway), use empty string for relative URLs
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // In development, use localhost
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
