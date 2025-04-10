"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { directAuthApi, directUserApi } from './direct-api';

// Define the User type
export interface User {
  id: string;
  name?: string;
  email: string;
  department?: string;
  position?: string;
  points?: number;
  level?: number;
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<{success: boolean; noUserId?: boolean}>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await directUserApi.getProfile(token);
        setUser(userData);
      } catch (err) {
        console.error('Profile fetch error:', err);
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await directAuthApi.login(email, password);
      
      if (!response.success) {
        throw new Error(response.message || '\u767b\u5f55\u5931\u8d25');
      }
      
      // Store user ID as token since backend uses sessions
      if (typeof window !== 'undefined' && response.data && response.data.userId) {
        localStorage.setItem('token', response.data.userId);
        
        try {
          // Fetch user profile with the userId
          const userData = await directUserApi.getProfile(response.data.userId);
          setUser(userData);
        } catch (profileError) {
          console.error('Failed to fetch user profile:', profileError);
          // Create a minimal user object with the userId and basic info
          setUser({ 
            id: response.data.userId, 
            email: response.data.email || email,
            name: response.data.name || email.split('@')[0]
          });
        }
      } else {
        throw new Error('\u767b\u5f55\u6210\u529f\uff0c\u4f46\u672a\u8fd4\u56de\u7528\u6237ID');
      }
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '\u767b\u5f55\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u60a8\u7684\u51ed\u636e');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<{success: boolean; noUserId?: boolean}> => {
    setIsLoading(true);
    setError(null);

    try {

      const response = await directAuthApi.register(email, password, name || email.split('@')[0]);

      
      if (!response.success) {
        throw new Error(response.message || '\u6ce8\u518c\u5931\u8d25');
      }
      
      // Check if data and userId are returned in the new structure
      if (!response.data) {
        console.warn('Registration successful but no data object returned');
        return { success: true, noUserId: true };
      }
      
      // 确保userId存在，即使是0也是有效值
      if (response.data.userId === undefined || response.data.userId === null) {
        console.warn('Registration successful but userId is undefined or null');
        return { success: true, noUserId: true };
      }
      
      const userId = response.data.userId;

      
      // Store user ID as token since backend uses sessions
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', userId.toString());
        
        // Create a minimal user object with the userId and provided info from response
        const userObject = { 
          id: userId.toString(), 
          email: response.data.email || email, 
          name: response.data.name || name || email.split('@')[0] 
        };

        setUser(userObject);
        
        // Only try to fetch profile if we have a valid userId
        try {
          // Fetch user profile with the userId
          const userData = await directUserApi.getProfile(userId.toString());
          if (userData) {

            setUser(userData);
          }
        } catch (profileError) {
          // We already set a minimal user object above, so no need to do it again
        }
      }
      
      return { success: true, noUserId: false };
    } catch (err: any) {
      setError(err.message || '\u6ce8\u518c\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
