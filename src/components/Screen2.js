import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import theme from '../styles/theme';
import { AppContainer, Card, ErrorMessage, FormContainer } from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';
import defaultBg from '../assets/bg.jpg'; // Add this import at the top of the file

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.7;
  filter: brightness(0.7);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: transparent; // Remove opaque background
`;

export const NewsHeadline = styled.h4`
  font-size: 24px;
  text-align: left;
  padding: 10px;
  color: #FFF; // ${({ theme }) => theme.colors.text}
  background-color: rgba(0, 0, 0, 0.25); // Lighter background
  margin: auto; // Center vertically
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 20px 0;
  margin-top: auto;
  background-color: rgba(0, 0, 0, 0.1); // Lighter background

`;

const ControlButton = styled.button`
  background: none;
  border: none;
  font-size: 36px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.accent};
  padding: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const Screen2 = ({ newsItems, introAudio, setNewsData, currentNewsIndex, setCurrentNewsIndex, shouldPlayIntro, setShouldPlayIntro }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const [fallbackImage, setFallbackImage] = useState(false);
    const audioRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            handleNext();
        },
        onSwipedRight: () => {
            handlePrevious();
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const generatePastelColor = useCallback(() => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 100%, 98%)`;
    }, []);

    const playNextAudio = useCallback(() => {
        setIsLoading(true);
        const newAudio = new Audio();
        newAudio.crossOrigin = "anonymous";

        let audioSrc = '';
        if (shouldPlayIntro && introAudio) {
            audioSrc = introAudio;
        } else if (currentNewsIndex < newsItems.length) {
            audioSrc = newsItems[currentNewsIndex].audio_summary;
        } else {
            setIsPlaying(false);
            setIsLoading(false);
            return;
        }

        newAudio.src = audioSrc;

        const handleCanPlayThrough = () => {
            setAudio(newAudio);
            setIsLoading(false);
            newAudio.play().catch(error => console.error("Audio play failed:", error));
            setIsPlaying(true);
        };

        const handleEnded = () => {
            if (shouldPlayIntro) {
                setShouldPlayIntro(false);
                setCurrentNewsIndex(0);
            } else {
                setCurrentNewsIndex(prevIndex => {
                    const newIndex = prevIndex + 1;
                    localStorage.setItem('currentNewsIndex', newIndex);
                    return newIndex;
                });
            }
        };

        newAudio.addEventListener('canplaythrough', handleCanPlayThrough);
        newAudio.addEventListener('ended', handleEnded);
        audioRef.current = newAudio;

        setBackgroundColor(generatePastelColor());

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.src = '';
                audioRef.current.load();
            }
        };
    }, [currentNewsIndex, newsItems, introAudio, generatePastelColor, setCurrentNewsIndex, shouldPlayIntro, setShouldPlayIntro]);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        if (!newsItems || newsItems.length === 0) {
            console.log('No news items available. Please try again later.');
            setErrorMessage('No news items available. Please try again later.');
            return;
        }

        setErrorMessage('');
        console.log('Playing next audio');
        playNextAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current.load();
            }
        };
    }, [newsItems, navigate, playNextAudio, user, introAudio]);

    const handlePlayPause = useCallback(() => {
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(error => console.error("Audio play failed:", error));
            }
            setIsPlaying(!isPlaying);
        }
    }, [audio, isPlaying]);

    const handlePrevious = useCallback(() => {
        setCurrentNewsIndex(prevIndex => {
            const newIndex = Math.max(-1, prevIndex - 1);
            localStorage.setItem('currentNewsIndex', newIndex);
            return newIndex;
        });
    }, [setCurrentNewsIndex]);

    const handleNext = useCallback(() => {
        setCurrentNewsIndex(prevIndex => {
            const newIndex = Math.min(newsItems.length - 1, prevIndex + 1);
            localStorage.setItem('currentNewsIndex', newIndex);
            return newIndex;
        });
    }, [newsItems, setCurrentNewsIndex]);

    const handleImageError = () => {
        setFallbackImage(true);
    };

    const renderContent = useMemo(() => {
        if (currentNewsIndex >= 0 && currentNewsIndex < newsItems.length) {
            const article = newsItems[currentNewsIndex];
            return (
                <NewsHeadline>{article.title}</NewsHeadline>
            );
        }
        return null;
    }, [currentNewsIndex, newsItems]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <AppContainer {...swipeHandlers}>
                <Card>
                {errorMessage ? (
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                ) : (
                    <>
                        {(currentNewsIndex >= 0 && currentNewsIndex < newsItems.length) ? (
                            <BackgroundImage 
                                src={fallbackImage ? defaultBg : newsItems[currentNewsIndex].image || defaultBg} 
                                onError={handleImageError}
                                as="img"
                            />
                        ) : (
                            <BackgroundImage src={defaultBg} />
                        )}
                        <ContentWrapper>
                            {renderContent}
                            <Controls>
                                <ControlButton onClick={handlePrevious} disabled={currentNewsIndex <= 0}>⏮</ControlButton>
                                <ControlButton onClick={handlePlayPause} disabled={isLoading}>
                                    {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
                                </ControlButton>
                                <ControlButton onClick={handleNext} disabled={currentNewsIndex >= newsItems.length - 1}>⏭</ControlButton>
                            </Controls>
                        </ContentWrapper>
                    </>
                )}
                </Card>
            </AppContainer>
        </ThemeProvider>
    );
};

export default React.memo(Screen2);