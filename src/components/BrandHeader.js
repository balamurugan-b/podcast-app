import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import { HeaderContainer, Card, ContentContainer } from '../styles/SharedComponents';


const BrandName = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.brand};
  font-size: 28px;
  display: inline;
  text-align: left;
`;

const BrandHeader = () => (
  <ThemeProvider theme={theme}>
    <HeaderContainer>
      <span role="img" aria-label="Brand Icon" style={{color: theme.colors.brand, fontSize: '28px', margin: '10px' }}>☘</span>
      <BrandName>essence</BrandName>
    </HeaderContainer>
  </ThemeProvider>
);

export default BrandHeader;