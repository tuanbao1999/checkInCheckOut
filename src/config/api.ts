// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://phentermine-meeting-protecting-disposition.trycloudflare.com ',
  
  // API endpoints
  ENDPOINTS: {
    LOGIN: '/api/admin/get-token',
    CHECK_IN_OUT: '/api/admin/MobileAddCheckInOut',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get login URL
export const getLoginUrl = (): string => {
  return getApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
};

// Helper function to get check-in/out URL
export const getCheckInOutUrl = (): string => {
  return getApiUrl(API_CONFIG.ENDPOINTS.CHECK_IN_OUT);
}; 
