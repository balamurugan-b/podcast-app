import React, { createContext, useContext, useState } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioElement, setAudioElement] = useState(null);

  return (
    <AudioContext.Provider value={{ audioElement, setAudioElement }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => useContext(AudioContext);