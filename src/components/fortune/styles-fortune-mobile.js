import styled from 'styled-components';

export const MAIN_COLOR = '#C84B31';

export const PageWrapper = styled.div`
  min-height: 100vh;
  height: 100%;
  background-color: #FDF6E9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ChineseContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
  background-color: #FDF6E9;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 50px;
    right: 50px;
    height: 7px;
    background-color: ${MAIN_COLOR};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 20px;
    left: 50px;
    right: 50px;
    height: 7px;
    background-color: ${MAIN_COLOR};
  }
`;

export const BorderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::before {
    content: '';
    position: absolute;
    top: 50px;
    bottom: 50px;
    left: 20px;
    width: 7px;
    background-color: ${MAIN_COLOR};
  }

  &::after {
    content: '';
    position: absolute;
    top: 50px;
    bottom: 50px;
    right: 20px;
    width: 7px;
    background-color: ${MAIN_COLOR};
  }
`;

export const Corner = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${MAIN_COLOR};
  z-index: 2;

  &.top-left {
    top: 10px;
    left: 10px;
  }

  &.top-right {
    top: 10px;
    right: 10px;
  }

  &.bottom-left {
    bottom: 10px;
    left: 10px;
  }

  &.bottom-right {
    bottom: 10px;
    right: 10px;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  height: 100%;
  padding: 20px;
  -webkit-overflow-scrolling: touch;
`;

export const TitleContainer = styled.div`
  width: 90vw;
  max-width: min(500px, 90%);
  margin: 0 auto;
  text-align: center;
  flex-shrink: 0;
  padding-top: 10px;

  img {
    width: 100%;
    height: auto;
    transform: scale(0.8);
    transform-origin: center center;
  }
`;

export const LogoContainer = styled.div`
  position: relative;
  width: 90vw;
  max-width: min(500px, 90%);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0.8;
  min-height: 200px;
  max-height: 35vh;

  img {
    width: 60%;
    height: auto;
    object-fit: contain;
    transform: scale(1.1);
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-bottom: 10px;
`;

export const InputContainer = styled.div`
  width: 90vw;
  max-width: min(400px, 90%);
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid ${MAIN_COLOR};
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Noto Serif TC', serif;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #b85c38;
  }

  &::placeholder {
    color: #999;
    text-align: center;
  }
`;

export const ButtonGroup = styled.div`
  width: 90vw;
  max-width: min(400px, 90%);
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 0 auto;
`;

export const CategoryButton = styled.button`
  flex: 1;
  min-width: 0;
  padding: 10px 0;
  border-radius: 8px;
  border: 2px solid ${MAIN_COLOR};
  background-color: ${props => props.selected ? MAIN_COLOR : 'transparent'};
  color: ${props => props.selected ? 'white' : MAIN_COLOR};
  font-size: 16px;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.selected ? '#B85C38' : '#fff0e6'};
  }
`;

export const StartButton = styled.button`
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

export const ModalOverlay = styled.div`
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
`;

export const ModalContent = styled.div`
  background: #FDF6E9;
  padding: 36px 24px 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 350px;
  position: relative;
  border: 2px solid ${MAIN_COLOR};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ModalTitle = styled.h3`
  text-align: center;
  margin-bottom: 24px;
  font-family: "Noto Serif TC", serif;
  font-size: 20px;
  color: ${MAIN_COLOR};
  width: 100%;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #000;
  }
`;

export const NumberButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin: 0 0 20px;
  width: 100%;
  max-width: 300px;
`;

export const NumberButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid ${MAIN_COLOR};
  background-color: ${props => props.selected ? MAIN_COLOR : 'transparent'};
  color: ${props => props.selected ? 'white' : MAIN_COLOR};
  font-size: 16px;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? '#B85C38' : '#fff0e6'};
  }
`;

export const NumberInput = styled(Input)`
  margin: 0 0 24px;
  width: 80%;
  font-size: 24px;
  letter-spacing: 2px;
  text-align: center;
  padding: 12px;
  
  &::placeholder {
    color: #999;
  }
`;