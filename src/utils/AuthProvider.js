import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { signIn, verifyEmail, verifyToken, refreshToken } from './api';
import { toCamelCase } from '../utils/stringUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Existing getLoginStatus method
  const getLoginStatus = useCallback(() => {
    const today = new Date().toDateString();
    const firstName = localStorage.getItem('firstName');
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const isFirstTimeEver = localStorage.getItem('isFirstTimeEver') !== 'false';
    const isFirstTimeToday = lastLoginDate !== today;

    localStorage.setItem('lastLoginDate', today);
    if (isFirstTimeEver) {
      localStorage.setItem('isFirstTimeEver', 'false');
    }

    return { firstName, isFirstTimeEver, isFirstTimeToday };
  }, []);

  // Existing logout method
  const logout = useCallback(() => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userLocation');
    localStorage.removeItem('lastLoginDate');
    setUser(null);
  }, []);

  // New method to check token expiration
  const ensureTokenValidity = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        // Check if the token is valid
        await verifyToken(token);
        // Get the user's login status - to update the login time, etc
        const { firstName, isFirstTimeEver, isFirstTimeToday } = getLoginStatus();
        setUser({
          token,
          firstName,
          isFirstTimeEver,
          isFirstTimeToday,
        });
      } catch (error) {
        console.error('Token verification failed:', error);
        // If the token is invalid, try to refresh it
        try {
          const newToken = await refreshToken(token);
          localStorage.setItem('userToken', newToken);
          const { firstName, isFirstTimeEver, isFirstTimeToday } = getLoginStatus();
          setUser({
            token: newToken,
            firstName,
            isFirstTimeEver,
            isFirstTimeToday,
          });
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If the token refresh fails, log the user out
          logout();
        }
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [getLoginStatus, logout]);

  // Existing login method
  const login = useCallback(async (email, inputFirstName, country, language) => {
    try {
      const result = await signIn(email, inputFirstName, country, language);
      if (!result.isNewUser) {
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('firstName', inputFirstName ? toCamelCase(inputFirstName) : '');
        
        const { firstName, isFirstTimeEver, isFirstTimeToday } = getLoginStatus();
        
        setUser({
          token: result.token,
          firstName,
          isFirstTimeEver,
          isFirstTimeToday,
        });
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [getLoginStatus]);

  // Existing verify method
  const verify = useCallback(async (email, verificationCode) => {
    try {
      const userData = await verifyEmail(email, verificationCode);
      if (userData.token) {
        localStorage.setItem('userToken', userData.token);
        localStorage.setItem('firstName', userData.firstName ? toCamelCase(userData.firstName) : '');
        localStorage.setItem('isFirstTimeEver', 'true');
        
        const { firstName, isFirstTimeEver, isFirstTimeToday } = getLoginStatus();
        
        setUser({
          token: userData.token,
          firstName,
          isFirstTimeEver,
          isFirstTimeToday,
        });
      }
      return true;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }, [getLoginStatus]);

  useEffect(() => {
    ensureTokenValidity();
  }, [ensureTokenValidity]);

  const value = {
    user,
    login,
    verify,
    logout,
    loading,
    ensureTokenValidity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};