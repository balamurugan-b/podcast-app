import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Screen1Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  max-width: 400px; // Add a max-width for mobile
  background-color: #ffffff;
  padding: 20px;
`;

const Logo = styled.div`
  font-size: 24px;
  color: #4a4af4;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background-image: url('path/to/your/logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
`;


const Screen1 = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(name);
      navigate('/news');
    };
  
  return (
    <Screen1Container>
      <Logo>        
        <LogoIcon />
        essence
      </Logo>
      <Title>Hi. We like to know you better</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter your name to get started..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </form>
    </Screen1Container>
  );
};

export default Screen1;
