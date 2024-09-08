import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';

const Screen3Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  padding: 20px;
  overflow-y: auto;
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
