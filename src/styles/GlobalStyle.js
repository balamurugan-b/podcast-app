import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-latin-200-normal.woff2') format('woff2'),
         url('/fonts/inter-latin-ext-200-normal.woff2') format('woff2');
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-latin-300-normal.woff2') format('woff2'),
         url('/fonts/inter-latin-ext-300-normal.woff2') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }


  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-latin-400-normal.woff2') format('woff2'),
         url('/fonts/inter-latin-ext-400-normal.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-latin-500-normal.woff2') format('woff2'),
         url('/fonts/inter-latin-ext-500-normal.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-latin-600-normal.woff2') format('woff2'),
         url('/fonts/inter-latin-ext-600-normal.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-latin-700-normal.woff2') format('woff2'),
         url('/fonts/inter-latin-ext-700-normal.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-100-normal.woff2') format('woff2');
    font-weight: 100;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-100-italic.woff2') format('woff2');
    font-weight: 100;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-300-normal.woff2') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-300-italic.woff2') format('woff2');
    font-weight: 300;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-400-normal.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-400-italic.woff2') format('woff2');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-500-normal.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-500-italic.woff2') format('woff2');
    font-weight: 500;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-700-normal.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-700-italic.woff2') format('woff2');
    font-weight: 700;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-900-normal.woff2') format('woff2');
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto-latin-900-italic.woff2') format('woff2');
    font-weight: 900;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Comfortaa';
    src: url('/fonts/comfortaa-latin-300-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-latin-ext-300-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-cyrillic-300-normal.woff2') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Comfortaa';
    src: url('/fonts/comfortaa-latin-400-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-latin-ext-400-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-cyrillic-400-normal.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Comfortaa';
    src: url('/fonts/comfortaa-latin-500-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-latin-ext-500-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-cyrillic-500-normal.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Comfortaa';
    src: url('/fonts/comfortaa-latin-600-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-latin-ext-600-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-cyrillic-600-normal.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Comfortaa';
    src: url('/fonts/comfortaa-latin-700-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-latin-ext-700-normal.woff2') format('woff2'),
         url('/fonts/comfortaa-cyrillic-700-normal.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Nunito';
    src: url('/fonts/nunito-latin-300-normal.woff2') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Nunito';
    src: url('/fonts/nunito-latin-400-normal.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Nunito';
    src: url('/fonts/nunito-latin-500-normal.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Nunito';
    src: url('/fonts/nunito-latin-600-normal.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Nunito';
    src: url('/fonts/nunito-latin-700-normal.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

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
