import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  max-width: ${({ theme }) => theme.sizes.maxWidth};
  max-height: ${({ theme }) => theme.sizes.maxHeight};
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 1s ease-in-out; /* Add transition for background color change */

  padding: ${({ theme }) => theme.padding};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  @media (max-width: 400px) {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    border: none;
  }
`;

export const Card = styled.div`
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  margin: 10px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 6px rgba(60, 60, 60, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // Add this line
  margin: auto; // Center vertically within the parent
  background-color: ${({ theme }) => theme.formBackground};
  width: 90%;
  flex: 1;
  height: 100%;
  position: relative;
`;

export const Header = styled.div`
  text-align: center;
  margin-top: 40px;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.brand};
  font-family: ${({ theme }) => theme.fonts.heading};
`;

export const Subtitle = styled.h3`
  font-size: 20px;
  margin-top: 0;
  font-family: ${({ theme }) => theme.fonts.body};
`;

export const Button = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #FFF;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => `color-mix(in srgb, ${theme.colors.accent} 85%, black)`};
  }
`;

export const Input = styled.input`
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 0 10px;
  font-family: ${({ theme }) => theme.fonts.body};
  width: 100%;
`;

// Add this near the top of the file with other styled components
export const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 20px;
  font-size: 1rem;
  padding: 10px;
`;

