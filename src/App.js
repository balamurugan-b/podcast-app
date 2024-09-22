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
  const [newsItems, setNewsItems] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
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

  // Fetch news data when user is authenticated
  useEffect(() => {
    const fetchNewsData = async () => {
      if (user) {
        try {
          const news = await fetchNews(user);
          setNewsItems(news);
        } catch (error) {
          console.error('Failed to fetch news:', error);
        }
      }
    };

    fetchNewsData();
  }, [user]);

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
    logout();
    navigate('/');
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
