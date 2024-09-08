import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import { getLocationAsync } from './utils/location';
import { fetchNews } from './utils/api';

const App = () => {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userLocation, setUserLocation] = useState(localStorage.getItem('userLocation') || '');
  const [newsItems, setNewsItems] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    if (!userName || !userLocation) {
      getLocationAsync().then(location => {
        setUserLocation(location);
        localStorage.setItem('userLocation', location);
      });
    } else {
      fetchNews(userName).then(setNewsItems);
    }
  }, [userName, userLocation]);

  const handleNameSubmit = (name) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          userName && userLocation ? <Navigate to="/news" replace /> : <Screen1 onSubmit={handleNameSubmit} />
        } />
        <Route path="/news" element={
          <Screen2 
            newsItems={newsItems} 
            currentIndex={currentNewsIndex}
            setCurrentIndex={setCurrentNewsIndex}
          />
        } />
        <Route path="/details" element={
          <Screen3 
            newsItems={newsItems} 
            currentIndex={currentNewsIndex}
            setCurrentIndex={setCurrentNewsIndex}
          />
        } />
      </Routes>
    </Router>
  );
};

export default App;
