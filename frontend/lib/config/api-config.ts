/**
 * API Configuration
 * 
 * This file centralizes all backend API configuration.
 * To switch backends, just modify the values in this file.
 */

// Available backend environments
export enum BackendEnvironment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

// Current active environment
export const ACTIVE_ENVIRONMENT: BackendEnvironment = BackendEnvironment.LOCAL;

// Configuration for each environment
interface EnvironmentConfig {
  backendApiUrl: string;
  nextjsApiUrl: string;
  useNextjsApi: boolean; // Whether to use Next.js API routes or direct backend calls
}

const environmentConfigs: Record<BackendEnvironment, EnvironmentConfig> = {
  [BackendEnvironment.LOCAL]: {
    backendApiUrl: 'http://127.0.0.1:5006',
    nextjsApiUrl: '', // Empty string means relative path
    useNextjsApi: true
  },
  [BackendEnvironment.DEVELOPMENT]: {
    backendApiUrl: 'https://dev-api.perfpulseai.com',
    nextjsApiUrl: '',
    useNextjsApi: true
  },
  [BackendEnvironment.STAGING]: {
    backendApiUrl: 'https://staging-api.perfpulseai.com',
    nextjsApiUrl: '',
    useNextjsApi: true
  },
  [BackendEnvironment.PRODUCTION]: {
    backendApiUrl: 'https://api.perfpulseai.com',
    nextjsApiUrl: '',
    useNextjsApi: true
  }
};

// Export the active configuration
export const apiConfig = environmentConfigs[ACTIVE_ENVIRONMENT];

// Helper function to get the appropriate URL for an endpoint
export function getApiUrl(endpoint: string, useDirectBackend = false): string {
  // If forced to use direct backend or the config specifies direct backend
  if (useDirectBackend || !apiConfig.useNextjsApi) {
    return `${apiConfig.backendApiUrl}${endpoint}`;
  }
  
  // Otherwise use Next.js API routes
  return `${apiConfig.nextjsApiUrl}${endpoint}`;
}
