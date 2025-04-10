/**
 * Direct API service for communicating with the backend without Next.js API routes
 */

// Base URL for the backend API
const BACKEND_API_URL = 'http://localhost:5000';
// Base URL for our Next.js API routes
const NEXTJS_API_URL = '';  // 空字符串表示相对路径

// Generic fetch function with error handling and detailed logging
async function fetchDirectApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${NEXTJS_API_URL}${endpoint}`;
  console.log(`Making direct API request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    console.log(`Response status from ${endpoint}:`, response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API error from ${endpoint}:`, errorData);
      const errorMessage = errorData.message || errorData.error || `u670du52a1u5668u9519u8bef: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`Successful response from ${endpoint}:`, data);
    return data;
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
    }>(`${NEXTJS_API_URL}/api/auth/login`, {
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
    }>(`${NEXTJS_API_URL}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  checkHealth: () => 
    fetchDirectApi<{ status: string; code: number; message: string }>(`${NEXTJS_API_URL}/api/health`),
};

// User API
export const directUserApi = {
  getProfile: (token: string) => 
    fetchDirectApi<any>(`${NEXTJS_API_URL}/api/users/${token}`, {
      // No authorization header needed as backend uses sessions
    }),

  updateProfile: (token: string, data: any) => 
    fetchDirectApi<any>(`${NEXTJS_API_URL}/api/users/${token}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  updateUserInfo: (userId: string, data: any) => 
    fetchDirectApi<any>(`${BACKEND_API_URL}/api/users/${userId}/updateInfo`, {
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
