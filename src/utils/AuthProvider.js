import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { signIn, verifyEmail } from './api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  if (user) {
    console.log('User is set. ', user);
  }

  const checkToken = useCallback(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const login = useCallback(async (email, firstName, country, language) => {
    try {
      localStorage.setItem('userName', firstName);
      const result = await signIn(email, firstName, country, language);
      if (result.token) {
        console.log('Login success. Setting user token and name.');
        localStorage.setItem('userToken', result.token);
        setUser({ token: result.token });
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const verify = useCallback(async (email, verificationCode) => {
    try {
      const userData = await verifyEmail(email, verificationCode);
      if (userData.token) {
        console.log('Verification success. Setting user token and name.');
        localStorage.setItem('userToken', userData.token);
        setUser(userData);
      }
      return true;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userToken');
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