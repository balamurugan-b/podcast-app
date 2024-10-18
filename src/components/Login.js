import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import GlobalStyle from '../styles/GlobalStyle';
import { AppContainer, MainContent, ContentContainer, Header, Title, Subtitle, Button, Input, ErrorMessage, FormContainer, SubtitleDark } from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';
import BrandHeader from './BrandHeader';

const Login = ({ onLoginSuccess, onLogout }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState('');
    const { login, logout, user, updateFirstName } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Set default country and language based on browser settings
    useEffect(() => {
        const browserLang = navigator.language || navigator.userLanguage;
        const [lang, country] = browserLang.split('-');
        setLanguage(lang.toUpperCase() || 'EN');
        setCountry(country.toUpperCase() || 'UK');
    }, []);

    // Set firstName if available in user object or stored in localStorage
    useEffect(() => {
        const storedFirstName = localStorage.getItem('firstName');
        if (storedFirstName) {
            setFirstName(storedFirstName);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await login(email, firstName, country, language);
            console.log(result);
            onLoginSuccess(email, result.token, result.isNewUser, result.verificationRequired);
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        onLogout();
    };

    if (user) {
        return (
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <BrandHeader />
                <AppContainer>
                    <ContentContainer>
                        <MainContent>
                            <BrandHeader>
                                <Title>Hello {user.firstName}</Title>
                                <Subtitle>You are logged in</Subtitle>
                            </BrandHeader>
                            <Button onClick={handleLogout}>Logout</Button>
                        </MainContent>
                    </ContentContainer>
                </AppContainer>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <BrandHeader />
            <AppContainer>
                <ContentContainer>
                    <MainContent>
                        <Header>
                            <Title>Welcome</Title>
                            <SubtitleDark>Please sign in</SubtitleDark>
                        </Header>
                        <FormContainer>
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {!user?.firstName && (
                                <Input
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            )}
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </FormContainer>
                    </MainContent>
                </ContentContainer>
            </AppContainer>
        </ThemeProvider>
    );
};

export default Login;
