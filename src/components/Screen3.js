import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';

const Screen3Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-width: 400px; // Add a max-width for mobile
  height: 800px;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 30px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  margin: 20px auto; // Center horizontally and add top/bottom margin
  box-sizing: border-box; // Include padding and border in the element's total width and height
  position: relative; // Add this to allow absolute positioning of pseudo-element
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const Header = styled.div`
  text-align: left;
  margin-bottom: 20px;
`;

const NewsContent = styled.div`
  flex-grow: 1;
`;

const Screen3 = ({ newsItems, currentIndex, setCurrentIndex }) => {
    const navigate = useNavigate();
  
    const swipeHandlers = useSwipeable({
      onSwipedRight: () => navigate('/news'),
      onSwipedUp: () => setCurrentIndex(Math.min(newsItems.length - 1, currentIndex + 1)),
    });
  
  return (
    <Screen3Container {...swipeHandlers}>
      <Header>
        <h2>Hello {localStorage.getItem('userName')}</h2>
        <h3>Your morning essence</h3>
      </Header>
      {/* <h3>{newsItems[currentIndex]?.headline}</h3> */}
      <NewsContent>
        <p>{newsItems[currentIndex]?.shortSummary}</p>
      </NewsContent>
    </Screen3Container>
  );
};

export default Screen3;
