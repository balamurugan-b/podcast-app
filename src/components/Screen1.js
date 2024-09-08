import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import theme from '../styles/theme';
import logoIcon from '../assets/icon_big.png';

const Screen1Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  max-width: 400px; // Add a max-width for mobile
  max-height: 800px;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 30px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  margin: 20px auto; // Center horizontally and add top/bottom margin
  box-sizing: border-box; // Include padding and border in the element's total width and height
  position: relative; // Add this to allow absolute positioning of pseudo-element
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;


const Logo = styled.div`
  padding-top: 40px;
  font-size: 34px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background-image: url(${logoIcon});
  background-size: contain;
  background-repeat: no-repeat;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Screen1 = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(name);
      navigate('/news');
    };
  
  return (
    <ThemeProvider theme={theme}>
    <GlobalStyle />

    <Screen1Container>
      <Logo>        
        <LogoIcon />
        essence
      </Logo>
      <ContentWrapper>

      <Title>Hi. We like to know you better</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter your name to get started..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form>
      </ContentWrapper>
    </Screen1Container>
    </ThemeProvider>
  );
};

export default Screen1;
