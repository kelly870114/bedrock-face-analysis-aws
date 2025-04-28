import styled, { keyframes } from 'styled-components';

export const MAIN_COLOR = '#009e93';

const fadeInOut = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

export const Container = styled.div`
  padding: 5%;
  margin: 2% auto;
  width: 90%;
  max-width: 400px;
`;

export const ImageContainer = styled.div`
  width: ${props => props.children?.type === 'img' ? '45%' : '90%'};
  margin: 0 auto 20px;
  border-radius: 8px;
  overflow: hidden;

  .image-wrapper {
    position: relative;
    width: 100%;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }

  .analysis-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    font-weight: 500;
    animation: ${fadeInOut} 2s infinite ease-in-out;
  }
`;

export const ResultContainer = styled.div`
  background-color:rgba(0, 158, 148, 0.3);
  padding: 20px;
  border-radius: 12px;
`;

export const AnalysisBlock = styled.div`
  background: rgba(0, 158, 148, 0.4);
  padding: 2rem 1rem 1rem;
  margin-bottom: 2.5rem;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #009e93;
  border-radius: 12px;
  position: relative;
`;

export const BlockTitle = styled.div`
  position: relative;
  margin: 0 auto 20px;
  background: #fff7e6;
  padding: 5px 20px;
  border: 2px solid ${MAIN_COLOR};
  border-radius: 20px;
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  font-family: "Noto Serif TC", serif;
  width: fit-content;
  min-width: min(200px, 90%);
  max-width: 90%;
  box-sizing: border-box;
  position: relative; // 用於定位裝飾圖示

  // 裝飾圖示使用絕對定位
  .title-icon {
    width: 18px;
    height: 18px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &:first-child {
      left: 12px;
    }

    &:last-child {
      right: 12px;
    }
  }

  .title-text {
    display: block;
    text-align: center;
    padding: 0 30px; // 為兩側的圖示預留空間
    word-wrap: break-word; // 允許長單詞換行
    hyphens: auto; // 允許斷字
  }

  @media (max-width: 350px) {
    padding: 5px 12px;
    font-size: 16px;

    .title-icon {
      width: 16px;
      height: 16px;
    }

    .title-text {
      padding: 0 25px; // 調整間距
    }
  }
`;


export const ContentItem = styled.div`
  margin-bottom: 12px;
  text-align: center;
  width: 100%;  // 新增：確保內容寬度一致
`;

export const ItemTitle = styled.h4`
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  text-align: center;
  font-family: "Noto Serif TC", serif;
`;

export const ItemContent = styled.p`
  color: #9ffcea;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  text-align: center;
  font-family: "Noto Serif TC", serif;
  width: 100%; 
`;

export const IconImage = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  z-index: 3;
`;

export const ButtonContainer = styled.div`
  width: 90vw;
  max-width: min(400px, 90%);
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  box-sizing: border-box;
`;

export const ActionButton = styled.button`
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
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  width: 300px;
  
  &:hover {
    transform: translateY(-2px);
    background-color: #009e93;
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

export const LoadingOverlay = styled.div`
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
  font-family: "Noto Serif TC", serif;
`;

// Modal 相關樣式
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
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 320px;
  position: relative;
`;

export const ModalTitle = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  font-family: "Noto Serif TC", serif;
  font-size: 18px;
  color: ${MAIN_COLOR};
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  
  &:hover {
    color: #000;
  }
`;

export const QRCodeContainer = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ModalText = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 0;
  font-family: "Noto Serif TC", serif;
`;