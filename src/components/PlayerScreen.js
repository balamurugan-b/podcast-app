import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import theme from '../styles/theme';
import {
    AppContainer, Card, ErrorMessage, Title, Subtitle, ScrollableContent, ContentContainer,
    BackgroundOverlay, ContentWrapper, MainContent, TopSection, PlaylistInfo, NewsInfo,
    ControlsWrapper, RatingButtons, RatingButton, ProgressBar, Progress, Controls, ControlButton,
    NewsHeadline, SummaryWrapper, SummaryTitle, SummaryText, FullScreenBackground, RatingMessage
} from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';
import defaultBg from '../assets/bg1.jpg';
import { rateNews } from '../utils/api';
import BrandHeader from './BrandHeader';

const PlayerScreen = ({ newsItems, introAudio, setNewsData, currentNewsIndex, setCurrentNewsIndex, shouldPlayIntro, setShouldPlayIntro }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [fallbackImage, setFallbackImage] = useState(false);
    const [ratingMessage, setRatingMessage] = useState('');
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

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
        setProgress(0);
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

            if (hasUserInteracted) {
                newAudio.play().catch(error => console.error("Auto-play failed:", error));
                setIsPlaying(true);
            }

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

            newAudio.removeEventListener('timeupdate', updateProgress);
        };

        newAudio.addEventListener('canplaythrough', handleCanPlayThrough);
        newAudio.addEventListener('ended', handleEnded);
        audioRef.current = newAudio;

        newAudio.load();

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
    }, [currentNewsIndex, newsItems, introAudio, setCurrentNewsIndex, shouldPlayIntro, setShouldPlayIntro, updateProgress, hasUserInteracted]);

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
                setHasUserInteracted(true);
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
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
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
                setRatingMessage('Thanks for rating!');
                setTimeout(() => setRatingMessage(''), 3000); // Hide message after 3 seconds
            } catch (error) {
                console.error('Failed to submit rating:', error);
                setRatingMessage('Rating failed. Please try again.');
                setTimeout(() => setRatingMessage(''), 3000);
            }
        }
    }, [currentNewsIndex, newsItems]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <BrandHeader />
            <AppContainer {...swipeHandlers}>
                <FullScreenBackground src={newsItems[currentNewsIndex]?.image || defaultBg} />
                <ContentContainer>
                    <Card>
                        <BackgroundOverlay src={newsItems[currentNewsIndex]?.image || defaultBg} />
                        {errorMessage ? (
                            <ErrorMessage>{errorMessage}</ErrorMessage>
                        ) : (
                            <ContentWrapper>
                                <MainContent>
                                    <TopSection>
                                        <PlaylistInfo>
                                            <Title>Hello {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()}</Title>
                                            <Subtitle>Your {getTimeOfDay()} newscast</Subtitle>
                                        </PlaylistInfo>
                                        <NewsInfo>
                                            <h3>{newsItems[currentNewsIndex]?.title || "News Title"}</h3>
                                        </NewsInfo>
                                    </TopSection>
                                    <ControlsWrapper>
                                        <RatingButtons>
                                            <RatingMessage visible={!!ratingMessage}>{ratingMessage}</RatingMessage>
                                            <RatingButton onClick={() => handleRating('negative')} disabled={isLoading}>
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                                                </svg>
                                            </RatingButton>
                                            <RatingButton onClick={() => handleRating('positive')} disabled={isLoading}>
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                                                </svg>
                                            </RatingButton>
                                        </RatingButtons>
                                        <ProgressBar>
                                            <Progress progress={progress} />
                                        </ProgressBar>
                                        <Controls>
                                            <ControlButton onClick={handlePrevious} disabled={currentNewsIndex <= 0}>
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                                                </svg>
                                            </ControlButton>
                                            <ControlButton onClick={handlePlayPause} disabled={isLoading}>
                                                {isLoading ? (
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z" />
                                                    </svg>
                                                ) : isPlaying ? (
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                                    </svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                )}
                                            </ControlButton>
                                            <ControlButton onClick={handleNext} disabled={currentNewsIndex >= newsItems.length - 1}>
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                                </svg>
                                            </ControlButton>
                                        </Controls>
                                    </ControlsWrapper>
                                </MainContent>
                                <SummaryWrapper>
                                    <SummaryTitle>Summary</SummaryTitle>
                                    <SummaryText>
                                        {newsItems[currentNewsIndex]?.summary_50 || "No summary available."}
                                    </SummaryText>
                                </SummaryWrapper>
                            </ContentWrapper>
                        )}
                    </Card>
                </ContentContainer>
            </AppContainer>
        </ThemeProvider>
    );
};

export default React.memo(PlayerScreen);