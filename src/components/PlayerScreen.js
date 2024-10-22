import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import {
    AppContainer, Card, ErrorMessage, Title, Subtitle, ScrollableContent, ContentContainer,
    BackgroundOverlay, ContentWrapper, MainContent, TopSection, PlaylistInfo, NewsInfo,
    ControlsWrapper, RatingButtons, RatingButton, ProgressBar, Progress, Controls, ControlButton,
    NewsHeadline, SummaryWrapper, SummaryTitle, SummaryText, FullScreenBackground, RatingMessage,
    CategoryButton, CategoryContainer
} from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';
import defaultBg from '../assets/bg1.jpg';
import { rateNews } from '../utils/api';
import BrandHeader from './BrandHeader';
import { trackEvent, trackSessionStart } from '../utils/trackingUtil';

const formatCategory = (category) => {
    return '#' + category.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
};

const PlayerScreen = ({ newsItems, introAudio, setNewsData, currentNewsIndex, setCurrentNewsIndex, shouldPlayIntro, setShouldPlayIntro }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [fallbackImage, setFallbackImage] = useState(false);
    const [ratingMessage, setRatingMessage] = useState('');
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

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

    const updateProgress = useCallback(() => {
        if (audioRef.current) {
            const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(progressPercent);
        }
    }, []);

    useEffect(() => {
        audioRef.current = new Audio();

        // Request permission for background audio (iOS)
        if (typeof navigator.mediaSession !== 'undefined') {
            navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
            navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
        }

        // Handle visibility change
        const handleVisibilityChange = () => {
            if (!document.hidden && audioRef.current && !audioRef.current.paused) {
                audioRef.current.play().catch(error => {
                    console.error("Auto-play failed on visibility change:", error);
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const playNextAudio = useCallback(() => {
        console.log('Playing next audio', {
            currentNewsIndex,
            newsItemsLength: newsItems ? newsItems.length : 0,
            shouldPlayIntro,
            introAudio: introAudio ? 'exists' : 'null',
            calledFrom: new Error().stack
        });

        setIsLoading(true);
        setProgress(0);
        if (!audioRef.current) return;

        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        let audioSrc = '';
        if (shouldPlayIntro && introAudio) {
            audioSrc = introAudio;
        } else if (newsItems && currentNewsIndex < newsItems.length) {
            audioSrc = newsItems[currentNewsIndex].audio_summary;
        } else {
            console.log('No more audio to play', {
                currentNewsIndex,
                newsItemsLength: newsItems ? newsItems.length : 0
            });
            setIsPlaying(false);
            setIsLoading(false);
            return;
        }

        if (audioSrc && typeof audioSrc === 'string' && audioSrc.trim() !== '') {
            console.log('Setting valid audio source:', audioSrc);
            audioRef.current.src = audioSrc;
            audioRef.current.load();
        } else {
            console.error('Invalid audio source:', audioSrc);
            setErrorMessage('Invalid audio source. Please try again.');
            setIsLoading(false);
        }

        const handleCanPlayThrough = () => {
            setIsLoading(false);
            if (hasUserInteracted) {
                audioRef.current.play().catch(error => {
                    console.error("Auto-play failed:", error);
                    trackEvent('error', newsItems[currentNewsIndex]?.id, newsItems[currentNewsIndex]?.title, currentNewsIndex, 0, { errorType: 'autoplay', message: error.message });
                });
                setIsPlaying(true);
            }
        };

        const handleEnded = () => {
            if (shouldPlayIntro) {
                setShouldPlayIntro(false);
                setCurrentNewsIndex(0);
            } else {
                setCurrentNewsIndex(updateCurrentNewsIndex);
            }
        };

        const handleError = (e) => {
            console.error('Audio error:', e);
            trackEvent('error', newsItems[currentNewsIndex]?.id, newsItems[currentNewsIndex]?.title, currentNewsIndex, 0, { errorType: 'loading', message: e.message });
            setIsLoading(false);
            setErrorMessage('Failed to load audio. Please try again.');
        };

        audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
        audioRef.current.addEventListener('ended', handleEnded);
        audioRef.current.addEventListener('error', handleError);
        audioRef.current.addEventListener('timeupdate', updateProgress);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.removeEventListener('error', handleError);
                audioRef.current.removeEventListener('timeupdate', updateProgress);
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

        if (currentNewsIndex >= newsItems.length) {
            console.log('Reached end of news items');
            setErrorMessage('All caught up! Check back later for more news.');
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
    }, [newsItems, navigate, playNextAudio, user, currentNewsIndex]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 10000); // 15000 milliseconds = 15 seconds

        return () => clearTimeout(timer);
    }, []);

    const getCurrentNewsItem = useCallback(() => {
        return newsItems && newsItems.length > 0 && currentNewsIndex >= 0 && currentNewsIndex < newsItems.length
            ? newsItems[currentNewsIndex]
            : null;
    }, [newsItems, currentNewsIndex]);

    const handlePlayPause = useCallback(() => {
        if (!audioRef.current) return;

        const currentItem = getCurrentNewsItem();
        if (isPlaying) {
            audioRef.current.pause();
            if (currentItem) {
                trackEvent('pause', currentItem.id, currentItem.title, currentNewsIndex, audioRef.current.currentTime);
            }
        } else {
            audioRef.current.play().catch(error => {
                console.error("Audio play failed:", error);
                trackEvent('error', currentItem?.id, currentItem?.title, currentNewsIndex, audioRef.current.currentTime, { errorType: 'playback', message: error.message });
            });
            setHasUserInteracted(true);
            if (currentItem) {
                trackEvent('play', currentItem.id, currentItem.title, currentNewsIndex, audioRef.current.currentTime);
            }
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying, getCurrentNewsItem, currentNewsIndex]);

    const handlePrevious = useCallback(() => {
        const currentItem = getCurrentNewsItem();
        if (currentItem && currentNewsIndex > 0) {
            trackEvent('previous', currentItem.id, currentItem.title, currentNewsIndex, audioRef.current?.currentTime);
        }
        setCurrentNewsIndex(prevIndex => {
            const newIndex = Math.max(0, prevIndex - 1);
            localStorage.setItem('currentNewsIndex', newIndex);
            return newIndex;
        });
    }, [setCurrentNewsIndex, getCurrentNewsItem, currentNewsIndex, audioRef]);

    const updateCurrentNewsIndex = useCallback((prevIndex) => {
        const newIndex = Math.min(newsItems.length - 1, prevIndex + 1);
        localStorage.setItem('currentNewsIndex', newIndex);
        return newIndex;
    }, [newsItems]);

    const handleNext = useCallback(() => {
        const currentItem = getCurrentNewsItem();
        if (currentItem && newsItems && currentNewsIndex < newsItems.length - 1) {
            trackEvent('next', currentItem.id, currentItem.title, currentNewsIndex, audioRef.current?.currentTime);
        }
        setCurrentNewsIndex(updateCurrentNewsIndex);
    }, [newsItems, updateCurrentNewsIndex, getCurrentNewsItem, currentNewsIndex, audioRef]);

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
        if (!newsItems || newsItems.length === 0 || currentNewsIndex >= newsItems.length) {
            return (
                <ErrorMessage>All caught up! Check back later for more news</ErrorMessage>
            );
        }

        const article = newsItems[currentNewsIndex];
        return (
            <>
                <NewsHeadline>{article.title}</NewsHeadline>
                <CategoryContainer>
                    {article.categories.map((category, index) => (
                        <CategoryButton key={index}>
                            {formatCategory(category)}
                        </CategoryButton>
                    ))}
                </CategoryContainer>
            </>
        );
    }, [currentNewsIndex, newsItems]);

    const showPlayerControls = useMemo(() => {
        return newsItems && newsItems.length > 0 && currentNewsIndex < newsItems.length;
    }, [newsItems, currentNewsIndex]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', updateProgress);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgress);
            }
        };
    }, [updateProgress, audioRef]);

    const handleRating = useCallback(async (rating) => {
        const currentItem = getCurrentNewsItem();
        if (currentItem) {
            try {
                trackEvent(rating === 'positive' ? 'like' : 'dislike', currentItem.id, currentItem.title, currentNewsIndex, audioRef.current?.currentTime);
                setRatingMessage('Thanks for rating!');
                setTimeout(() => setRatingMessage(''), 3000);
            } catch (error) {
                console.error('Failed to submit rating:', error);
                setRatingMessage('Rating failed. Please try again.');
                setTimeout(() => setRatingMessage(''), 3000);
            }
        }
    }, [getCurrentNewsItem, currentNewsIndex, audioRef]);

    // Track scroll events
    useEffect(() => {
        let lastScrollPosition = window.pageYOffset;
        const handleScroll = () => {
            const currentScrollPosition = window.pageYOffset;
            const currentItem = getCurrentNewsItem();
            if (currentItem) {
                if (currentScrollPosition > lastScrollPosition) {
                    trackEvent('scrollDown', currentItem.id, currentItem.title, currentNewsIndex, null);
                } else if (currentScrollPosition < lastScrollPosition) {
                    trackEvent('scrollUp', currentItem.id, currentItem.title, currentNewsIndex, null);
                }
            }
            lastScrollPosition = currentScrollPosition;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [getCurrentNewsItem, currentNewsIndex]);

    // Track audio completion
    useEffect(() => {
        const handleAudioEnded = () => {
            const currentItem = getCurrentNewsItem();
            if (currentItem) {
                trackEvent('audioCompleted', currentItem.id, currentItem.title, currentNewsIndex);
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('ended', handleAudioEnded);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleAudioEnded);
            }
        };
    }, [audioRef, getCurrentNewsItem, currentNewsIndex]);

    return (
        <>
            <BrandHeader />
            <AppContainer {...swipeHandlers}>
                <FullScreenBackground src={newsItems?.[currentNewsIndex]?.image || defaultBg} />
                <ContentContainer>
                    <Card>
                        <BackgroundOverlay src={newsItems?.[currentNewsIndex]?.image || defaultBg} />
                        <ContentWrapper>
                            <MainContent>
                                <TopSection welcomeShown={showWelcome}>
                                    <PlaylistInfo show={showWelcome}>
                                        <Title>Hello {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()}</Title>
                                        <Subtitle>Your {getTimeOfDay()} newscast</Subtitle>
                                    </PlaylistInfo>
                                    <NewsInfo welcomeShown={showWelcome}>
                                        {renderContent}
                                    </NewsInfo>
                                </TopSection>
                                {showPlayerControls && (
                                    <>
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
                                                <ControlButton onClick={handleNext} disabled={!newsItems || currentNewsIndex >= newsItems.length - 1}>
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                                    </svg>
                                                </ControlButton>
                                            </Controls>
                                        </ControlsWrapper>
                                        <SummaryWrapper>
                                            <SummaryTitle>Summary</SummaryTitle>
                                            <SummaryText>
                                                {newsItems[currentNewsIndex]?.summary_50 || "No summary available."}
                                            </SummaryText>
                                        </SummaryWrapper>
                                    </>
                                )}
                            </MainContent>
                        </ContentWrapper>
                    </Card>
                </ContentContainer>
            </AppContainer>
        </>
    );
};

export default React.memo(PlayerScreen);
