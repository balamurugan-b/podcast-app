import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Verify from './components/Verify';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import { getLocationAsync } from './utils/location';
import { fetchNews } from './utils/api';
import { AuthProvider, useAuth } from './utils/AuthProvider';

const MainApp = () => {
  console.log('MainApp rendered');
  const { user, loading } = useAuth();
  const [userLocation, setUserLocation] = useState(() => localStorage.getItem('userLocation') || '');
  const [newsItems, setNewsItems] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (!userLocation) {
        try {
          const location = await getLocationAsync();
          setUserLocation(location);
          localStorage.setItem('userLocation', location);
        } catch (error) {
          console.error('Failed to get location:', error);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchNewsData = async () => {
      if (user) {
        try {
          console.log('User present :: Fetching news data');
          const news = await fetchNews();
          setNewsItems(news);
        } catch (error) {
          console.error('Failed to fetch news:', error);
        }
      }
    };

    fetchNewsData();
  }, [user]);

  const handleLoginSuccess = useCallback((userEmail, token, isNewUser) => {
    if (!userEmail) {
      console.error('User email is missing');
      return;
    }
    setEmail(userEmail);

    if (isNewUser) {
      console.log('New user :: Showing verification');
      setIsSignup(true);
      setShowVerification(true);
    } else {
      console.log('Existing user :: Navigating to news');
      if (!token) {
        console.error('Token is missing for existing user login');
        return;
      }
      navigate('/news');
    }
  }, [navigate]);

  const handleVerificationSuccess = useCallback(() => {
    console.log('Verification success handler called');
    setShowVerification(false);
    navigate('/news');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userLocation');
    setUserLocation('');
    setNewsItems([]);
    setCurrentNewsIndex(0);
    setShowVerification(false);
    setEmail('');
    setIsSignup(false);
    navigate('/');
  }, [navigate]);

  const memoizedRoutes = useMemo(() => (
    <Routes>
      <Route path="/" element={
        user ? (
          <Navigate to="/news" replace />
        ) : showVerification && isSignup ? (
          <Verify email={email} onVerificationSuccess={handleVerificationSuccess} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
        )
      } />
      <Route path="/logout" element={
        <Login onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
      } />
      <Route path="/news" element={
        user ? (
          <Screen2 newsItems={newsItems} />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/details" element={
        user ? (
          <Screen3 
            newsItems={newsItems} 
            currentIndex={currentNewsIndex}
            setCurrentIndex={setCurrentNewsIndex}
          />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ), [user, showVerification, isSignup, email, newsItems, currentNewsIndex, handleLoginSuccess, handleLogout, handleVerificationSuccess]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return memoizedRoutes;
};

const App = () => (
  <AuthProvider>
    <Router>
      <MainApp />
    </Router>
  </AuthProvider>
);

export default App;
