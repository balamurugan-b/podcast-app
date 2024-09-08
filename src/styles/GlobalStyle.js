import { createGlobalStyle } from 'styled-components';
import '@fontsource/comfortaa/400.css'; // Regular weight
import '@fontsource/comfortaa/700.css'; // Bold weight
import '@fontsource/inter/200.css'; // Regular weight
import '@fontsource/inter/400.css'; // Regular weight
import '@fontsource/inter/700.css'; // Bold weight

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  h1, h2 {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
  }

  h3, h4, h5, h6 {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }

  * {
    box-sizing: inherit;
  }
`;

export default GlobalStyle;