import styled from 'styled-components';

export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #FFF;
  margin: 0 auto;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start; // Change this line
  align-items: center; // Add this line
  width: 100vw;
  max-width: 100%;
  box-sizing: border-box;
  position: absolute;
  overflow: hidden;
  z-index: 10;
  
  background-color: rgba(0, 0, 0, 0.5);
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 400px) {
    width: 100%;
    border-radius: 0;
    border: none;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.darkOverlay};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
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

export const SubtitleDark = styled.h3`
  font-size: 20px;
  margin-top: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.primary};
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
  font-size: 1em;
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

export const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

export const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${props => props.src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  padding-top: 100px;
`;

export const TopSection = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const PlaylistInfo = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

export const NewsInfo = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin: 80px 20px;
`;

export const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  `;

export const RatingButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 20px;
`;

export const RatingButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 40px;
  padding: 0;
  transition: opacity 0.3s ease;
  &:disabled {
    opacity: 0.5;
  }
  svg {
    width: 24px;
    height: 24px;
    fill: ${({ theme }) => theme.colors.text};
    transition: fill 0.3s ease;
  }
  &:hover:not(:disabled) svg {
    fill: ${({ theme }) => theme.colors.accent};
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 20px;
`;

export const Progress = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.accent};
`;

export const Controls = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

export const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.3s ease;
  &:disabled {
    opacity: 0.5;
  }
  svg {
    width: 30px;
    height: 30px;
    fill: ${({ theme }) => theme.colors.text};
    transition: fill 0.3s ease;
  }
  &:hover:not(:disabled) svg {
    fill: ${({ theme }) => theme.colors.accent};
  }
`;

export const NewsHeadline = styled.h4`
  font-size: 24px;
  text-align: left;
  padding: 10px;
  color: #FFF;
  background-color: rgba(0, 0, 0, 0.25);
  margin: auto;
`;

export const SummaryWrapper = styled.div`
  width: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  margin-bottom: 20px; // Add this line
`;

export const SummaryTitle = styled.h4`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 10px 0;
`;

export const SummaryText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.5;
`;

export const FullScreenBackground = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(5px) brightness(1.3) opacity(0.5);
  z-index: -1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
  }

  @media (min-width: 768px) {
    display: block;
  }
`;

export const RatingMessage = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
  margin-left: 10px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;