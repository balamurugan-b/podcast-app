import { createGlobalStyle } from 'styled-components';
import '@fontsource/inter/200.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';
import '@fontsource/comfortaa/400.css'; // Regular weight
import '@fontsource/comfortaa/700.css'; // Bold weight
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/300.css';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
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