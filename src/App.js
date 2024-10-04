import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Verify from './components/Verify';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import { getLocationAsync } from './utils/location';
import { fetchNews } from './utils/api';
import { AuthProvider, useAuth } from './utils/AuthProvider';
import { isNewDay } from './utils/dateUtils'; // Add this import
import BrandHeader from './components/BrandHeader';
import PlayerScreen from './components/PlayerScreen';
import Home from './components/Home'; // Add this import
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';

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
  const [shouldPlayIntro, setShouldPlayIntro] = useState(false);

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
            setShouldPlayIntro(true);
          } else {
            // Merge new items with existing ones, avoiding duplicates
            const existingIds = new Set(prevData.articles.map(item => item.id));
            const uniqueNewItems = newNewsData.articles.filter(item => !existingIds.has(item.id));
            updatedData = {
              articles: [...prevData.articles, ...uniqueNewItems],
              intro_audio: isInitialFetch ? newNewsData.intro_audio : prevData.intro_audio
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

    if (user) {
      console.log('News items on app load:', newsData.articles.length);
      console.log('Current news index on app load:', currentNewsIndex);

      const lastLoginDate = localStorage.getItem('lastLoginDate');
      const currentDate = new Date().toISOString().split('T')[0];

      const isNewLogin = isNewDay(lastLoginDate, currentDate);
      if (isNewLogin) {
        // Reset data for a new day
        setNewsData({ articles: [], intro_audio: null });
        setCurrentNewsIndex(0);
        localStorage.setItem('newsData', JSON.stringify({ articles: [], intro_audio: null }));
        localStorage.setItem('currentNewsIndex', '0');
        setShouldPlayIntro(true);
      }

      localStorage.setItem('lastLoginDate', currentDate);

      const shouldFetchNews = newsData.articles.length === 0 || currentNewsIndex >= newsData.articles.length - 2 || isNewLogin;
      const isInitialFetch = newsData.articles.length === 0 || isNewLogin;

      if (shouldFetchNews) {
        fetchAndUpdateNews(isInitialFetch); // true indicates it's an initial fetch
      }
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
        ) : (
          <Home /> // Add this line to render the Home component for non-logged-in users
        )
      } />
      <Route path="/login" element={
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
          <PlayerScreen
            newsItems={newsData.articles}
            introAudio={newsData.intro_audio}
            setNewsData={setNewsData}
            currentNewsIndex={currentNewsIndex}
            setCurrentNewsIndex={setCurrentNewsIndex}
            shouldPlayIntro={shouldPlayIntro}
            setShouldPlayIntro={setShouldPlayIntro}
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
  ), [user, showVerification, isSignup, email, newsData, currentNewsIndex, handleLoginSuccess, handleLogout, handleVerificationSuccess, shouldPlayIntro, setShouldPlayIntro]);

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
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
