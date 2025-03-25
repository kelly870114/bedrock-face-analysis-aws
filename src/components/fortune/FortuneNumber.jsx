import React, { useState } from 'react';
import styled from 'styled-components';
import { config } from '../../config';
import FortuneInterpret from './FortuneInterpret';

const MAIN_COLOR = '#C84B31';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const FortuneImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 90vw;
  max-width: min(400px, 90%);
`;

const FortuneImage = styled.div`
  width: 50%;
  margin: auto;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const ButtonContainer = styled.div`
  width: 90vw;
  max-width: min(400px, 90%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  box-sizing: border-box;
`;

const InterpretButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 32px;
  border-radius: 16px;
  border: none;
  background-color: ${MAIN_COLOR};
  color: white;
  font-size: 18px;
  font-weight: 800;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(184, 92, 56, 0.3);
  width: 200px;
  
  &:hover {
    transform: translateY(-2px);
    background-color: #B85C38;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  font-size: 20px;
  font-family: 'Noto Serif TC', serif;
`;

const FortuneNumber = ({ 
  user_name,  
  category,
  existingNumber = null
}) => {
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [localFortuneNumber] = useState(() => {
    // 如果有existingNumber就使用它，否則隨機生成
    if (existingNumber && existingNumber >= 1 && existingNumber <= 24) {
      return existingNumber;
    }
    return Math.floor(Math.random() * 24) + 1;
  });

  const handleInterpret = async () => {
    try {
      setIsInterpreting(true);

      if (!category || !localFortuneNumber) {
        throw new Error('缺少必要參數');
      }

      const response = await fetch(`${config.apiEndpoint}/interpretFortune`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: user_name,
          fortune_category: category,
          fortune_number: localFortuneNumber
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '解籤失敗');
      }

      const result = await response.json();
      setInterpretation(result);
      
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || '解籤失敗，請稍後再試');
    } finally {
      setIsInterpreting(false);
    }
  };

  if (interpretation) {
    return (
      <FortuneInterpret 
        name={user_name}
        category={category}
        fortuneNumber={localFortuneNumber}
        interpretation={interpretation}
      />
    );
  }

  // 確保籤號是兩位數的字串格式
  const formattedNumber = String(localFortuneNumber).padStart(2, '0');
  
  return (
    <Container>
      <FortuneImageContainer>
        <FortuneImage>
          <img 
            src={`/jenn-ai/${formattedNumber}.png`} 
            alt={`第${localFortuneNumber}籤`}
          />
        </FortuneImage>
      </FortuneImageContainer>
      
      <ButtonContainer>
        <InterpretButton 
          onClick={handleInterpret}
          disabled={isInterpreting}
        >
          {isInterpreting ? '解籤中...' : '開始解籤'}
        </InterpretButton>
        <InterpretButton 
          onClick={() => window.location.reload()}
          disabled={isInterpreting}
          style={{ 
            backgroundColor: 'transparent', 
            color: MAIN_COLOR, 
            border: `2px solid ${MAIN_COLOR}` 
          }}
        >
          重新抽籤
        </InterpretButton>
      </ButtonContainer>

      {isInterpreting && (
        <LoadingOverlay>
          解籤中...
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default FortuneNumber;