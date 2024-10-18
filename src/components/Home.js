import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import screenshot1 from '../assets/screenshots/1.jpg';
import ecommercePic from '../assets/cliparts/ecommerce.jpg';
import audioPic from '../assets/cliparts/audio.jpg';
import hourglassPic from '../assets/cliparts/hourglass.jpg';
import podcastPic from '../assets/cliparts/podcast.jpg';

import {
  Button
} from '../styles/SharedComponents';

import { useAuth } from '../utils/AuthProvider';

// Keep the existing styled components that are specific to Home
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => `linear-gradient(to top, ${theme.colors.primaryDarker}, ${theme.colors.primaryLight})`};
  color: #fff;
  padding: 2rem;

  @media (min-width: 768px) {
  padding: 4rem;
  }

`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    max-width: 50%;
  }

  @media (max-width: 768px) {
    min-height: 90vh;
  }
`;

const RightSection = styled.div`
  flex: 1;
  border-radius: 10px;
  margin-top: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primaryDark};

  @media (min-width: 768px) {
    max-width: 50%;
    margin-top: 0;
    margin-left: 2rem;
  }
`;

const InsightsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const InsightCard = styled.div`
  background: ${({ theme }) => `linear-gradient(to top, ${theme.colors.primaryDark}, ${theme.colors.primaryLight})`};
  border-radius: 10px;
  padding: 2rem 1rem;
  flex: 1;
  display: flex;
  margin-top: 2rem;
  flex-direction: column;
  align-items: center; // Center the image horizontally

  @media (min-width: 768px) {
    margin-top: 4rem;
    margin-bottom: 0;
    padding: 2rem;
  }
`;


const Brand = styled.h1`
  font-family: ${({ theme }) => theme.fonts.brand};
  font-size: 5rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.brand};
  margin-bottom: 2rem;
  margin-top: 0;
`;

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const Subheadline = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const InsightTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.8rem;
  font-weight: 400;
  margin-top: 0;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const InsightTitleSmall = styled.h4`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.primaryLighter};
`;

const InsightSubtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.background};
  margin-bottom: 2rem;
`;


const AppImage = styled.img`
  width: 100%;
  height: 60vh;
  object-fit: cover;
  border-radius: 8px;

  @media (min-width: 768px) {
    height: 800px;
    max-width: 500px;
  }
`;

const InsightImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
  margin-top: auto;
  filter: brightness(0.7) contrast(0.8);
  transition: filter 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  &:hover {
    filter: brightness(0.9) contrast(1.05);
  }

  @media (min-width: 768px) {
    max-width: 600px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  padding: 2rem;
  color: #fff;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const FooterLink = styled.a`
  color: #888;
  text-decoration: none;
  &:hover {
    color: #fff;
  }
`;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTryItOut = () => {
    if (user) {
      navigate('/news');
    } else {
      navigate('/login');
    }
  };

  return (
    <HomeContainer>
      <MainContent>
        <LeftSection>
          <Brand>essence</Brand>
          <Headline>e-commerce news in 30-second soundbites</Headline>
          <Subheadline>
            Essence delivers curated, personalized audio insights for busy professionals. Get informed on your commute, no reading required.
          </Subheadline>
          <Button onClick={handleTryItOut}>
            {user ? 'Go to News' : 'Try it out'}
          </Button>
        </LeftSection>
        <RightSection>
          <AppImage src={screenshot1} alt="App screenshot" />
        </RightSection>
      </MainContent>
      <InsightsSection>
        <InsightCard>
          <div>
            <InsightTitleSmall>Your Industry. Your News.</InsightTitleSmall>
            <InsightTitle>Tailored for You</InsightTitle>
            <InsightSubtitle>Essence curates content from top sources, tailored to your specific industry and role. Stay relevant without the noise</InsightSubtitle>
          </div>
          <InsightImage src={ecommercePic} alt="App screenshot" />
        </InsightCard>
        <InsightCard>
          <div>
            <InsightTitleSmall>Listen, Don't Read</InsightTitleSmall>
            <InsightTitle>Audio-First Experience</InsightTitle>
            <InsightSubtitle>Transform your daily routine into a learning opportunity. Catch up on industry trends while you commute, exercise, or prep for your day.</InsightSubtitle>
          </div>
          <InsightImage src={audioPic} alt="App screenshot" />
        </InsightCard>
      </InsightsSection>
      <InsightsSection>
        <InsightCard>
          <div>
            <InsightTitleSmall>News in byte size</InsightTitleSmall>
            <InsightTitle>30 Seconds to Savvy</InsightTitle>
            <InsightSubtitle>Each news item is distilled into a 30-second audio clip. Get the essentials quickly, without sacrificing depth.</InsightSubtitle>
          </div>
          <InsightImage src={hourglassPic} alt="App screenshot" />
        </InsightCard>
        <InsightCard>
          <div>
            <InsightTitleSmall>Engaging dialogue</InsightTitleSmall>
            <InsightTitle>News That Feels Like Conversation</InsightTitle>
            <InsightSubtitle>Our hosts present insights in a lively, podcast-style format. It's not just information—it's infotainment.</InsightSubtitle>
          </div>
          <InsightImage src={podcastPic} alt="App screenshot" />
        </InsightCard>
      </InsightsSection>
      <Footer>
        <Brand>essence</Brand>
        <Button onClick={handleTryItOut}>
          {user ? 'Go to News' : 'Try now'}
        </Button>
        <FooterLinks>
          <FooterLink href="/terms">Terms</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterLinks>
      </Footer>
    </HomeContainer>
  );
};

export default Home;
