import { createGlobalStyle } from 'styled-components';
import '@fontsource/inter/200.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';
import '@fontsource/comfortaa/400.css'; // Regular weight
import '@fontsource/comfortaa/700.css'; // Bold weight

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #FFF;
  }

  h1, h2 {
    font-family: 'Roboto', sans-serif;
  }

  h3, h4, h5, h6 {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
  }

  * {
    box-sizing: inherit;
  }
`;

export default GlobalStyle;