import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  z-index: 10;
`;

const BrandName = styled.h1`
  margin: 0;
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.brand};
  font-family: ${({ theme }) => theme.fonts.brand};
  font-size: 28px;
`;

const Header = () => (
  <ThemeProvider theme={theme}>
    <HeaderContainer>
      <span role="img" aria-label="Brand Icon" style={{color: theme.colors.accent, fontSize: '28px' }}>☘</span>
      <BrandName>essence</BrandName>
    </HeaderContainer>
  </ThemeProvider>
);

export default Header;