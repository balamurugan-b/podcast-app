import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import GlobalStyle from '../styles/GlobalStyle';
import { AppContainer, Header, Title, Subtitle, Button, Input, ErrorMessage, FormContainer } from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';

const Verify = ({ email, onVerificationSuccess }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verify } = useAuth();

  const handleVerify = async () => {
    setError('');
    setIsLoading(true);
    try {
      const success = await verify(email, verificationCode);
      if (success) {
        onVerificationSuccess();
      } else {
        throw new Error('Verification failed. Please check your code and try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>Verify Your Account</Title>
        </Header>
        <FormContainer>
          <Subtitle>Enter the verification code</Subtitle>

          <Input
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isLoading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button onClick={handleVerify} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </FormContainer>
      </AppContainer>
    </ThemeProvider>
  );
};

export default Verify;