import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import GlobalStyle from '../styles/GlobalStyle';
import { AppContainer, Header, Title, Subtitle, Button, Input, ErrorMessage, FormContainer } from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess, onLogout }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState('');
    const { login, logout, user } = useAuth();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await login(email, firstName, country, language);
            onLoginSuccess(email, result.token, result.isNewUser);
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
                <AppContainer>
                    <Header>
                        <Title>Hello {user.firstName}</Title>
                        <Subtitle>You are logged in</Subtitle>
                    </Header>
                    <Button onClick={handleLogout}>Logout</Button>
                </AppContainer>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <AppContainer>
                <Header>
                    <Title>Welcome</Title>
                    <Subtitle>Please sign in</Subtitle>
                </Header>
                <FormContainer>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </FormContainer>
            </AppContainer>
        </ThemeProvider>
    );
};

export default Login;