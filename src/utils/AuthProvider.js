import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { signIn, verifyEmail, verifyToken, refreshToken } from './api';
import { toCamelCase } from '../utils/stringUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // New function to update firstName in localStorage and state
  const updateFirstName = useCallback((newFirstName) => {
    if (newFirstName) {
      localStorage.setItem('firstName', toCamelCase(newFirstName));
      setUser(prevUser => ({
        ...prevUser,
        firstName: toCamelCase(newFirstName)
      }));
    }
  }, []);

  // Modified getLoginStatus method
  const getLoginStatus = useCallback(() => {
    const today = new Date().toDateString();
    const firstName = localStorage.getItem('firstName') || '';
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const isFirstTimeEver = localStorage.getItem('isFirstTimeEver') !== 'false';
    const isFirstTimeToday = lastLoginDate !== today;

    localStorage.setItem('lastLoginDate', today);
    if (isFirstTimeEver) {
      localStorage.setItem('isFirstTimeEver', 'false');
    }

    return { firstName, isFirstTimeEver, isFirstTimeToday };
  }, []);

  // Modified logout method
  const logout = useCallback(() => {
    const firstName = localStorage.getItem('firstName');
    localStorage.clear();
    if (firstName) {
      localStorage.setItem('firstName', firstName);
    }
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
      // If there's no token, just set user to null without attempting verification
      setUser(null);
    }
    setLoading(false);
  }, [getLoginStatus, logout]);

  // Modified login method
  const login = useCallback(async (email, inputFirstName, country, language) => {
    try {
      const result = await signIn(email, inputFirstName, country, language);
      if (result.token) {
        localStorage.setItem('userToken', result.token);
        updateFirstName(inputFirstName);
        
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
  }, [getLoginStatus, updateFirstName]);

  // Modified verify method
  const verify = useCallback(async (email, verificationCode) => {
    try {
      const userData = await verifyEmail(email, verificationCode);
      if (userData.token) {
        localStorage.setItem('userToken', userData.token);
        updateFirstName(userData.firstName);
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
  }, [getLoginStatus, updateFirstName]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      ensureTokenValidity();
    } else {
      setLoading(false);
    }
  }, [ensureTokenValidity]);

  const value = {
    user,
    login,
    verify,
    logout,
    loading,
    ensureTokenValidity,
    updateFirstName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
