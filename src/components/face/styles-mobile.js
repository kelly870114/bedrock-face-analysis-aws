import styled, { createGlobalStyle } from 'styled-components';
import { keyframes } from 'styled-components';


const MAIN_COLOR = '#009e93';

const fadeInOut = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;


export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative; // 添加相對定位
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 24px;
  position: center; // 添加相對定位
  z-index: 1; // 確保內容在背景之上
`;

// Message box
export const MessageBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 320px;
  width: 100%;
  
  h2 {
    color: ${MAIN_COLOR};
    font-size: 24px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    line-height: 1.5;
    font-size: 16px;
  }
`;

// 開始分析按鈕
export const CameraButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 32px;
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
  width: 200px;
  margin: 0 auto 40px;
  
  &:hover {
    transform: translateY(-2px);
    background-color: #ffffff;
    color: ${MAIN_COLOR};
    
    /* 當按鈕懸停時，讓其中的svg圖標也變色 */
    svg {
      color: ${MAIN_COLOR} !important;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ImageContainer = styled.div`
  width: 90vw;
  max-width: min(500px, 90%);
  position: relative;
  margin: auto;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  align-items: center;

  .image-wrapper {
    width: 100%;
    position: relative;
    height: fit-content;
  }
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;


export const ImageOverlay = styled.div`
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
  font-size: 24px;
  font-weight: 500;
  font-family: 'Noto Serif TC', serif;
  animation: ${fadeInOut} 2s infinite ease-in-out;
`;

// 最外層容器
export const PageWrapper = styled.div`
  min-height: 100vh;
  background-image: url('/bg-fortune-aws.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
`;

// 背景和邊框
export const ChineseContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
  background-image: url('/bg-fortune-aws.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  ${props => props.isAnalyzing && `
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
  `}

  /* 上邊框 */
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 50px;
    right: 50px;
    height: 7px;
    background-color: ${MAIN_COLOR};
  }

  /* 下邊框 */
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

// 左右邊框
export const BorderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* 左邊框 */
  &::before {
    content: '';
    position: absolute;
    top: 50px;
    bottom: 50px;
    left: 20px;
    width: 7px;
    background-color: ${MAIN_COLOR};
  }

  /* 右邊框 */
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

// AWS Logo容器
export const AwsLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  margin-bottom: 10px;
  
  img {
    height: 40px;
    width: auto;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
`;

// 圓角
export const Corner = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${MAIN_COLOR};

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

// 標題容器
export const TitleContainer = styled.div`
  width: 90vw;
  max-width: min(500px, 90%);
  margin: 20px auto;
  text-align: center;
  padding: 0 20px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: auto;
    transform: scale(0.8);
    transform-origin: center center;
  }

  @media (min-height: 700px) {
    img {
      transform: scale(0.9);
    }
  }

  @media (min-height: 800px) {
    img {
      transform: scale(1);
    }
  }
`;


// 首頁中間圖片，跟隨標題寬度
export const LogoContainer = styled.div`
  position: relative;
  width: 90vw;
  max-width: min(500px, 90%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 50vh;

  img {
    width: 100%;
    height: auto;
    transform: scale(0.8);
    transform-origin: center center;
    object-fit: contain;
  }

  @media (min-height: 700px) {
    img {
      transform: scale(0.9);
    }
  }

  @media (min-height: 800px) {
    img {
      transform: scale(1);
    }
  }
`;