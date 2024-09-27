import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import theme from '../styles/theme';
import bgVideo from '../assets/bg1.mp4';
import { AppContainer, Header, Title, Button, ErrorMessage, FormContainer } from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const ArticleImage = styled.img`
  width: 90%;
  max-height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
  transition: transform 3s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
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

const Screen2 = ({ newsItems, introAudio, setNewsData, currentNewsIndex, setCurrentNewsIndex, shouldPlayIntro, setShouldPlayIntro }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
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

    const renderContent = useMemo(() => {
        if (currentNewsIndex === -1) {
            return (
                <BackgroundVideo autoPlay loop muted>
                    <source src={bgVideo} type="video/mp4" />
                </BackgroundVideo>
            );
        } else if (currentNewsIndex < newsItems.length) {
            const article = newsItems[currentNewsIndex];
            return (
                <>
                    <NewsHeadline>{article.title}</NewsHeadline>
                    <ArticleImage src={article.image} alt={article.title} />
                </>
            );
        }
        return null;
    }, [currentNewsIndex, newsItems]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <AppContainer {...swipeHandlers} style={{ backgroundColor }}>
                <Header>
                    <Title>Hello {user.firstName}</Title>
                </Header>
                {errorMessage ? (
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                ) : (
                    <>
                        <FormContainer>
                            {renderContent}
                            <Controls>
                                <Button onClick={handlePrevious}>⏮</Button>
                                <Button onClick={handlePlayPause} disabled={isLoading}>
                                    {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
                                </Button>
                                <Button onClick={handleNext}>⏭</Button>
                            </Controls>
                        </FormContainer>
                    </>
                )}
            </AppContainer>
        </ThemeProvider>
    );
};

export default React.memo(Screen2);