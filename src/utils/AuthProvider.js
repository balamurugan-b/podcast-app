import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { signIn, verifyEmail } from './api';
import { toCamelCase } from '../utils/stringUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // New method to handle isFirstTimeEver and isFirstTimeToday logic
  const getLoginStatus = useCallback(() => {
    const today = new Date().toDateString();
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const isFirstTimeEver = localStorage.getItem('isFirstTimeEver') !== 'false';
    const isFirstTimeToday = lastLoginDate !== today;

    localStorage.setItem('lastLoginDate', today);
    if (isFirstTimeEver) {
      localStorage.setItem('isFirstTimeEver', 'false');
    }

    return { isFirstTimeEver, isFirstTimeToday };
  }, []);

  // Check for existing token and user data on mount
  const checkToken = useCallback(() => {
    const token = localStorage.getItem('userToken');
    
    if (token) {
      const { isFirstTimeEver, isFirstTimeToday } = getLoginStatus();
      
      setUser({
        token,
        isFirstTimeEver,
        isFirstTimeToday,
      });
    }
    setLoading(false);
  }, [getLoginStatus]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  // Handle user login
  const login = useCallback(async (email, firstName, country, language) => {
    try {
      const result = await signIn(email, firstName, country, language);
      if (!result.isNewUser) {
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userName', firstName ? toCamelCase(firstName) : '');
        
        const { isFirstTimeEver, isFirstTimeToday } = getLoginStatus();
        
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

  // Handle email verification
  const verify = useCallback(async (email, verificationCode) => {
    try {
      const userData = await verifyEmail(email, verificationCode);
      if (userData.token) {
        localStorage.setItem('userToken', userData.token);
        localStorage.setItem('userName', userData.firstName ? toCamelCase(userData.firstName) : '');
        localStorage.setItem('isFirstTimeEver', 'true');
        
        const { isFirstTimeEver, isFirstTimeToday } = getLoginStatus();
        
        setUser({
          token: userData.token,
          firstName: userData.firstName,
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

  // Handle user logout
  const logout = useCallback(() => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLocation');
    localStorage.removeItem('lastLoginDate');
    setUser(null);
  }, []);

  const value = {
    user,
    login,
    verify,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};