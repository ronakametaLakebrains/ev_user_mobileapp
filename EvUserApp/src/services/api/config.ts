// API Configuration
export const API_CONFIG = {
  // Development - HTTP allowed
  development: {
    baseURL: 'http://cms_dev.savekar.com/api',
    timeout: 15000,
  },
  // Production - HTTPS required
  production: {
    baseURL: 'https://cms.savekar.com/api', // Update this to your production HTTPS URL
    timeout: 15000,
  },
};

// Get current environment
export const getCurrentEnvironment = () => {
  // In release builds, __DEV__ is false, but we want to default to development
  // You can override this by setting a build-time environment variable
  if (__DEV__) {
    return 'development';
  }

  // For release builds, check if we have a specific environment set
  // You can set this in your build configuration
  return 'development'; // Default to development for now
};

// Get current API config
export const getCurrentApiConfig = () => {
  const env = getCurrentEnvironment();
  return API_CONFIG[env as keyof typeof API_CONFIG];
};
