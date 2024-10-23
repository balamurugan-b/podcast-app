import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import { HeaderContainer } from '../styles/SharedComponents';
import logoSvg from '../assets/logo64.svg'; 

const BrandName = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.brand};
  font-size: 28px;
  display: inline;
  text-align: left;
`;

const Logo = styled.img`
  height: 24px;
  margin-right: 20px;
`;

const BrandHeader = () => (
  <ThemeProvider theme={theme}>
    <HeaderContainer>
      <Logo src={logoSvg} alt="Brand Logo" />
      <BrandName>essence</BrandName>
    </HeaderContainer>
  </ThemeProvider>
);

export default BrandHeader;
