import React, { useState } from 'react';
import { AppContainer, ContentContainer, MainContent, Header, Title, SubtitleDark, Button, Input, ErrorMessage, FormContainer } from '../styles/SharedComponents';
import { useAuth } from '../utils/AuthProvider';
import BrandHeader from './BrandHeader';

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
    <>
      <BrandHeader />
      <AppContainer>
        <ContentContainer>
          <MainContent>
            <Header>
              <Title>Verify Your Account</Title>
            </Header>
            <FormContainer>
              <SubtitleDark>Enter the verification code</SubtitleDark>
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
          </MainContent>
        </ContentContainer>
      </AppContainer>
    </>
  );
};

export default Verify;