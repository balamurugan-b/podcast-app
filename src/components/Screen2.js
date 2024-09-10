import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';
import AudioVisualizer from './AudioVisualizer';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import theme from '../styles/theme';

const Screen2Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  max-width: 400px; // Add a max-width for mobile
  height: 800px;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 30px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  margin: 20px auto; // Center horizontally and add top/bottom margin
  box-sizing: border-box; // Include padding and border in the element's total width and height
  position: relative; // Add this to allow absolute positioning of pseudo-element
`;

const Header = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 5px;
`;

const Subtitle = styled.h3`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 0;
`;

const AudioVisualizerContainer = styled.div`
  width: 90%;
  height: 150px;
  background-color: #f0f0f0;
  margin: 20px 0;
`;

const NewsHeadline = styled.h3`
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-around;
  width: 80%;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: none;
  border: none;
  font-size: 36px;
  cursor: pointer;
  color: #8b0000;
`;

const Screen2 = ({ newsItems, currentIndex, setCurrentIndex }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);
    const navigate = useNavigate();
  
    const swipeHandlers = useSwipeable({
      onSwipedLeft: () => navigate('/details'),
    });
  
    useEffect(() => {
      if (newsItems.length > 0 && newsItems[currentIndex]) {
        setIsLoading(true);
        const newAudio = new Audio(newsItems[currentIndex].preSignedUrl);
        
        const handleCanPlayThrough = () => {
          setAudio(newAudio);
          setIsLoading(false);
          setDuration(newAudio.duration);
          if (isPlaying) {
            newAudio.play().catch(error => console.error("Audio play failed:", error));
          }
        };
  
        const handleTimeUpdate = () => {
          setCurrentTime(newAudio.currentTime);
        };
  
        const handleEnded = () => {
          handleNext();
        };
  
        newAudio.addEventListener('canplaythrough', handleCanPlayThrough);
        newAudio.addEventListener('timeupdate', handleTimeUpdate);
        newAudio.addEventListener('ended', handleEnded);
        audioRef.current = newAudio;
  
        return () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.removeEventListener('ended', handleEnded);
            audioRef.current.src = '';
            audioRef.current.load();
          }
        };
      }
    }, [newsItems, currentIndex, isPlaying]);
  
    const handlePlayPause = () => {
      if (audio) {
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play().catch(error => console.error("Audio play failed:", error));
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    const handlePrevious = () => {
      setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
    };
  
    const handleNext = () => {
      setCurrentIndex(prevIndex => {
        const nextIndex = Math.min(newsItems.length - 1, prevIndex + 1);
        if (nextIndex === prevIndex) {
          setIsPlaying(false);
        }
        return nextIndex;
      });
    };
    
    const trimContent = (content, maxWords) => {
        const words = content.split(' ');
        if (words.length > maxWords) {
          return words.slice(0, maxWords).join(' ') + '...';
        }
        return content;
    };

    return (
        <ThemeProvider theme={theme}>
        <GlobalStyle />
  
      <Screen2Container {...swipeHandlers}>
        <Header>
          <Title>Hello {localStorage.getItem('userName')}</Title>
          <Subtitle>Your morning essence</Subtitle>
        </Header>
        <AudioVisualizerContainer>
          <AudioVisualizer audio={audio} />
        </AudioVisualizerContainer>
        <NewsHeadline>{trimContent(newsItems[currentIndex]?.title || '', 12)}</NewsHeadline>
        <Controls>
          <Button onClick={handlePrevious}>⏮</Button>
          <Button onClick={handlePlayPause} disabled={isLoading}>
            {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
          </Button>
          <Button onClick={handleNext}>⏭</Button>
        </Controls>
      </Screen2Container>
      </ThemeProvider>
    );
  };

export default Screen2;
