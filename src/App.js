import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Verify from './components/Verify';
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
import GlobalStyle from './styles/GlobalStyle';

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
  const [lastFetchAttempt, setLastFetchAttempt] = useState(() => {
    return localStorage.getItem('lastFetchAttempt') || null;
  });

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
    console.log('Fetching news for user:', user?.email);
    console.log('News items:', newsData ? newsData.articles ? newsData.articles.length : 0 : 0);
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
    if (loading) return;

    if (user) {
      console.log('News items on app load:', newsData.articles?.length ?? 0);
      console.log('Current news index on app load:', currentNewsIndex);

      const lastLoginDate = localStorage.getItem('lastLoginDate');
      const currentDate = new Date().toISOString().split('T')[0];

      const isNewLogin = isNewDay(lastLoginDate, currentDate);
      if (isNewLogin) {
        console.log('New login detected. Resetting data.');
        // Reset data for a new day
        setNewsData({ articles: [], intro_audio: null });
        setCurrentNewsIndex(0);
        localStorage.setItem('newsData', JSON.stringify({ articles: [], intro_audio: null }));
        localStorage.setItem('currentNewsIndex', '0');
        setShouldPlayIntro(true);
        setLastFetchAttempt(null);
      }

      localStorage.setItem('lastLoginDate', currentDate);

      const noLastFetchAttempt = !lastFetchAttempt;
      const lastFetchMoreThanTwoMinutesAgo = lastFetchAttempt && 
        (Date.now() - new Date(lastFetchAttempt).getTime() > 2 * 60 * 1000);
      const noArticles = !newsData.articles || newsData.articles.length === 0;
      const nearEndOfArticles = newsData.articles && 
        currentNewsIndex >= newsData.articles.length - 2;

      let shouldFetchNews = false;
      let fetchReason = '';

      if (isNewLogin) {
        shouldFetchNews = true;
        fetchReason = 'New login detected';
      } else if (noArticles) {
        shouldFetchNews = true;
        fetchReason = 'No articles available';
      } else if (noLastFetchAttempt) {
        shouldFetchNews = true;
        fetchReason = 'No record of last fetch attempt';
      } else if (nearEndOfArticles && lastFetchMoreThanTwoMinutesAgo) {
        shouldFetchNews = true;
        fetchReason = 'Near end of articles and last fetch was more than 2 minutes ago';
      } else if (lastFetchMoreThanTwoMinutesAgo) {
        shouldFetchNews = true;
        fetchReason = 'Last fetch was more than 2 minutes ago';
      }

      const isInitialFetch = noArticles || isNewLogin;

      if (shouldFetchNews) {
        console.log(`Fetching news. Reason: ${fetchReason}`);
        setLastFetchAttempt(new Date().toISOString());
        localStorage.setItem('lastFetchAttempt', new Date().toISOString());
        fetchAndUpdateNews(isInitialFetch);
      }
    }
  }, [user, loading, fetchAndUpdateNews, currentNewsIndex, newsData, lastFetchAttempt]);

  const handleLoginSuccess = useCallback((userEmail, token, isNewUser, verificationRequired) => {
    setEmail(userEmail);
    setIsSignup(isNewUser);
    
    if (isNewUser || verificationRequired) {
      console.log('Verification required');
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
          <Home />
        )
      } />
      <Route path="/login" element={
        user ? (
          <Navigate to="/news" replace />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
        )
      } />
      <Route path="/verify" element={
        user ? (
          <Navigate to="/news" replace />
        ) : showVerification ? (
          <Verify email={email} onVerificationSuccess={handleVerificationSuccess} />
        ) : (
          <Navigate to="/login" replace />
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
    <GlobalStyle />
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
