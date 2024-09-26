import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Verify from './components/Verify';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import { getLocationAsync } from './utils/location';
import { fetchNews } from './utils/api';
import { AuthProvider, useAuth } from './utils/AuthProvider';

const MainApp = () => {
  const { user, loading, logout } = useAuth();
  const [userLocation, setUserLocation] = useState('');
  const [newsData, setNewsData] = useState(() => {
    try {
      const savedNewsData = localStorage.getItem('newsData');
      return savedNewsData ? JSON.parse(savedNewsData) : { articles: [], intro_audio: null };
    } catch (error) {
      console.error('Error parsing saved news data:', error);
      return { articles: [], intro_audio: null };
    }
  });
  const [currentNewsIndex, setCurrentNewsIndex] = useState(() => {
    const savedIndex = localStorage.getItem('currentNewsIndex');
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  // Fetch user location
  useEffect(() => {
    const fetchLocation = async () => {
      if (!userLocation) {
        try {
          const location = await getLocationAsync();
          setUserLocation(location);
        } catch (error) {
          console.error('Failed to get location:', error);
        }
      }
    };

    fetchLocation();
  }, [userLocation]);

  // Combined function to fetch and update news
  const fetchAndUpdateNews = useCallback(async (isInitialFetch = false) => {
    console.log('Fetching news for user:', user);
    console.log('News items:', newsData.articles.length);
    console.log('Current news index:', currentNewsIndex);
    if (user) {
      console.log('Fetching news for user:', user);
      try {
        const newNewsData = await fetchNews(user);
        setNewsData(prevData => {
          let updatedData;
          if (isInitialFetch) {
            updatedData = newNewsData;
          } else {
            // Merge new items with existing ones, avoiding duplicates
            const existingIds = new Set(prevData.articles.map(item => item.id));
            const uniqueNewItems = newNewsData.articles.filter(item => !existingIds.has(item.id));
            updatedData = {
              articles: [...prevData.articles, ...uniqueNewItems],
              intro_audio: newNewsData.intro_audio || prevData.intro_audio
            };
          }
          localStorage.setItem('newsData', JSON.stringify(updatedData));
          return updatedData;
        });

        if (isInitialFetch) {
          setCurrentNewsIndex(0);
          localStorage.setItem('currentNewsIndex', '0');
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    }
  }, [user]);

  // Effect to handle initial load and subsequent refreshes
  useEffect(() => {
    if (loading) return; // Don't do anything while auth is loading

    console.log('News items on app load:', newsData.articles.length);
    console.log('Current news index on app load:', currentNewsIndex);
    const shouldFetchNews = newsData.articles.length === 0 || currentNewsIndex >= newsData.articles.length - 2;
    
    if (user && shouldFetchNews) {
      fetchAndUpdateNews(newsData.articles.length === 0);
    }
  }, [user, loading, fetchAndUpdateNews, currentNewsIndex, newsData.articles.length]);

  const handleLoginSuccess = useCallback((userEmail, token, isNewUser) => {
    setEmail(userEmail);

    if (isNewUser) {
      setIsSignup(true);
      setShowVerification(true);
      navigate('/verify');
    } else {
      navigate('/news');
    }
  }, [navigate]);

  const handleVerificationSuccess = useCallback(() => {
    setShowVerification(false);
    navigate('/news');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    console.log('Logging out user in MainApp');
    logout();
  }, [logout, navigate]);

  // Memoized routes to prevent unnecessary re-renders
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
        <LogoutHandler onLogout={handleLogout} />
      } />
      <Route path="/news" element={
        user ? (
          <Screen2 
            newsItems={newsData.articles} 
            introAudio={newsData.intro_audio}
            setNewsData={setNewsData}
            currentNewsIndex={currentNewsIndex} 
            setCurrentNewsIndex={setCurrentNewsIndex} 
          />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/details" element={
        user ? (
          <Screen3 
            newsItems={newsData.articles} 
            introAudio={newsData.intro_audio}
            currentIndex={currentNewsIndex}
            setCurrentIndex={setCurrentNewsIndex}
          />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ), [user, showVerification, isSignup, email, newsData, currentNewsIndex, handleLoginSuccess, handleLogout, handleVerificationSuccess]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return memoizedRoutes;
};

// Updated LogoutHandler component
const LogoutHandler = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Logging out user in LogoutHandler');
    onLogout();
    navigate('/');
  }, [onLogout, navigate]);

  return null;
};

const App = () => (
  <AuthProvider>
    <Router>
      <MainApp />
    </Router>
  </AuthProvider>
);

export default App;
