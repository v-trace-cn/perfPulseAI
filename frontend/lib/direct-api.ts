/**
 * Direct API service for communicating with the backend without Next.js API routes
 */

import { apiConfig, getApiUrl } from './config/api-config';

// Generic fetch function with error handling and detailed logging
async function fetchDirectApi<T>(endpoint: string, options: RequestInit = {}, useDirectBackend = false): Promise<T> {
  // Use the centralized configuration to determine the URL
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint, useDirectBackend);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    // Parse the response as JSON
    const data = await response.json();
    
    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }
    
    return data as T;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
}

// Auth API
export const directAuthApi = {
  login: (email: string, password: string) => 
    fetchDirectApi<{ 
      success: boolean; 
      message: string; 
      data?: { 
        userId: string; 
        name: string; 
        email: string; 
      } 
    }>(getApiUrl('/api/auth/login'), {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) => 
    fetchDirectApi<{ 
      success: boolean; 
      message: string; 
      data?: { 
        userId: string; 
        name: string; 
        email: string; 
      } 
    }>(getApiUrl('/api/auth/register'), {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  checkHealth: () => 
    fetchDirectApi<{ status: string; code: number; message: string }>(getApiUrl('/api/health')),
};

// User API
export const directUserApi = {
  getProfile: (userId: string) => 
    fetchDirectApi<any>(getApiUrl(`/api/users/${userId}`), {
      // No authorization header needed as backend uses sessions
    }),

  updateProfile: (userId: string, data: any) => 
    fetchDirectApi<any>(getApiUrl(`/api/users/${userId}`), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  updateUserInfo: (userId: string, data: any) => 
    fetchDirectApi<any>(getApiUrl(`/api/users/${userId}/updateInfo`), {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Activity API
export const directActivityApi = {
  getActivities: (token: string) => 
    fetchDirectApi<any[]>('/activity/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

// Reward API
export const directRewardApi = {
  getRewards: (token: string) => 
    fetchDirectApi<any[]>('/reward/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

// Scoring API
export const directScoringApi = {
  submitScore: (token: string, data: any) => 
    fetchDirectApi<any>('/scoring/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
