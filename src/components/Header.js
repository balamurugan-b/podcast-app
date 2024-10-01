import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import { HeaderContainer, Card } from '../styles/SharedComponents';


const BrandName = styled.h1`
  margin: 0;
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.brand};
  font-size: 28px;
  display: inline;
  text-align: left;
`;

const Header = () => (
  <ThemeProvider theme={theme}>
    <HeaderContainer>
      <span role="img" aria-label="Brand Icon" style={{color: theme.colors.brand, fontSize: '28px' }}>☘</span>
      <BrandName>essence</BrandName>
    </HeaderContainer>
  </ThemeProvider>
);

export default Header;