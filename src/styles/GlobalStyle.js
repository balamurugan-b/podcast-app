import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #root {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  h1, h2 {
    font-family: 'Nunito', sans-serif;
  }

  h3, h4, h5, h6 {
    font-family: 'Nunito', sans-serif;
    font-weight: 400;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
