import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import theme from '../styles/theme';
import { AppContainer, Card, ErrorMessage, Title, Subtitle } from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';
import defaultBg from '../assets/bg1.jpg';
import { rateNews } from '../utils/api';

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${props => props.src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 100px 20px 20px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
`;

const PlaylistInfo = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

const NewsInfo = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const RatingButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 20px;
`;

const RatingButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 20px;
  padding: 0;
  &:disabled {
    opacity: 0.5;
  }
  svg {
    width: 24px;
    height: 24px;
    fill: ${({ theme }) => theme.colors.text};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 20px;
`;

const Progress = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.accent};
`;

const Controls = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
`;

export const NewsHeadline = styled.h4`
  font-size: 24px;
  text-align: left;
  padding: 10px;
  color: #FFF; // ${({ theme }) => theme.colors.text}
  background-color: rgba(0, 0, 0, 0.25); // Lighter background
  margin: auto; // Center vertically
`;

const PlayerScreen = ({ newsItems, introAudio, setNewsData, currentNewsIndex, setCurrentNewsIndex, shouldPlayIntro, setShouldPlayIntro }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [progress, setProgress] = useState(0);
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

    const updateProgress = useCallback(() => {
        if (audioRef.current) {
            const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(progressPercent);
        }
    }, []);

    const playNextAudio = useCallback(() => {
        setIsLoading(true);
        setProgress(0); // Reset progress when starting a new audio
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
            
            // Add event listener for progress update
            newAudio.addEventListener('timeupdate', updateProgress);
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
            
            // Remove event listener when audio ends
            newAudio.removeEventListener('timeupdate', updateProgress);
        };

        newAudio.addEventListener('canplaythrough', handleCanPlayThrough);
        newAudio.addEventListener('ended', handleEnded);
        audioRef.current = newAudio;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.removeEventListener('timeupdate', updateProgress);
                audioRef.current.src = '';
                audioRef.current.load();
            }
        };
    }, [currentNewsIndex, newsItems, introAudio, setCurrentNewsIndex, shouldPlayIntro, setShouldPlayIntro, updateProgress]);

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

    const getTimeOfDay = useCallback(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 18) return 'Afternoon';
        return 'Evening';
    }, []);

    const renderContent = useMemo(() => {
        if (currentNewsIndex >= 0 && currentNewsIndex < newsItems.length) {
            const article = newsItems[currentNewsIndex];
            return (
                <NewsHeadline>{article.title}</NewsHeadline>
            );
        }
        return null;
    }, [currentNewsIndex, newsItems]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', updateProgress);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgress);
            }
        };
    }, [updateProgress, audio]);

    const handleRating = useCallback(async (rating) => {
        if (currentNewsIndex >= 0 && currentNewsIndex < newsItems.length) {
            const newsId = newsItems[currentNewsIndex].id;
            try {
                await rateNews(newsId, rating);
                // You can add some visual feedback here if needed
                console.log(`Rated news item ${newsId} as ${rating}`);
            } catch (error) {
                console.error('Failed to submit rating:', error);
                // You can add some error handling UI here if needed
            }
        }
    }, [currentNewsIndex, newsItems]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <AppContainer>
                <Card>
                    {errorMessage ? (
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    ) : (
                        <>
                            <BackgroundOverlay src={newsItems[currentNewsIndex]?.image || defaultBg} />
                            <ContentWrapper>
                                <PlaylistInfo>
                                    <Title>Hello {user.firstName}</Title>
                                    <Subtitle>Your {getTimeOfDay()} newscast</Subtitle>
                                </PlaylistInfo>
                                <NewsInfo>
                                    <h3>{newsItems[currentNewsIndex]?.title || "News Title"}</h3>
                                    {/* <p>{newsItems[currentNewsIndex]?.source || "News Source"}</p> */}
                                </NewsInfo>
                                <ControlsWrapper>
                                    <RatingButtons>
                                        <RatingButton onClick={() => handleRating('positive')} disabled={isLoading}>
                                            <svg viewBox="0 0 24 24">
                                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                                            </svg>
                                        </RatingButton>
                                        <RatingButton onClick={() => handleRating('negative')} disabled={isLoading}>
                                            <svg viewBox="0 0 24 24">
                                                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                                            </svg>
                                        </RatingButton>
                                    </RatingButtons>
                                    <ProgressBar>
                                        <Progress progress={progress} />
                                    </ProgressBar>
                                    <Controls>
                                        <ControlButton onClick={handlePrevious} disabled={currentNewsIndex <= 0}>⏮</ControlButton>
                                        <ControlButton onClick={handlePlayPause} disabled={isLoading}>
                                            {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
                                        </ControlButton>
                                        <ControlButton onClick={handleNext} disabled={currentNewsIndex >= newsItems.length - 1}>⏭</ControlButton>
                                    </Controls>
                                </ControlsWrapper>
                            </ContentWrapper>
                        </>
                    )}
                </Card>
            </AppContainer>
        </ThemeProvider>
    );
};

export default React.memo(PlayerScreen);