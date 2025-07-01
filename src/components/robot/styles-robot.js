import styled, { keyframes } from 'styled-components';

export const MAIN_COLOR = '#009e93';

// ============ 動畫定義 ============

// 漸層流動動畫
const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 心臟跳動動畫
const heartbeat = keyframes`
  0% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 158, 147, 0.7);
  }
  25% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 5px rgba(0, 158, 147, 0.5);
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(0, 158, 147, 0.3);
  }
  75% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 5px rgba(0, 158, 147, 0.1);
  }
  100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 158, 147, 0);
  }
`;

// 邊框光效動畫
const borderGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 158, 147, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 158, 147, 0.6); }
  100% { box-shadow: 0 0 5px rgba(0, 158, 147, 0.3); }
`;

// ============ 主要容器 ============

export const RobotContainer = styled.div`
  width: 1280px;
  height: 800px;
  position: relative;
  background-image: url('/bg-fortune.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
  
  /* 在背景圖上方添加動畫漸層遮罩 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(26, 77, 71, 0.4) 0%, 
      rgba(45, 107, 90, 0.3) 25%, 
      rgba(0, 158, 147, 0.5) 50%, 
      rgba(45, 107, 90, 0.3) 75%, 
      rgba(26, 77, 71, 0.4) 100%
    );
    background-size: 400% 400%;
    animation: ${gradientFlow} 8s ease infinite;
    pointer-events: none;
    z-index: 1;
  }
  
  /* 科技感邊框 */
  border: 2px solid ${MAIN_COLOR};
  box-shadow: 
    0 0 20px rgba(0, 158, 147, 0.3),
    inset 0 0 20px rgba(0, 158, 147, 0.1);
`;

export const RobotContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
`;

// ============ 首頁視圖 ============

export const HomeView = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px;
  box-sizing: border-box;
`;

export const TitleContainer = styled.div`
  width: 400px;
  margin-bottom: 40px;
  text-align: center;
  
  img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 0 10px rgba(0, 158, 147, 0.3));
  }
`;

export const LogoContainer = styled.div`
  width: 300px;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 0 15px rgba(0, 158, 147, 0.4));
  }
`;

export const StartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 40px;
  border-radius: 25px;
  border: 2px solid ${MAIN_COLOR};
  background: linear-gradient(135deg, ${MAIN_COLOR} 0%, #00b8a9 50%, ${MAIN_COLOR} 100%);
  background-size: 200% 200%;
  color: white;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${gradientFlow} 4s ease infinite;
  
  &:hover {
    transform: translateY(-3px);
    animation: ${gradientFlow} 2s ease infinite, ${borderGlow} 2s ease infinite;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    transition: color 0.3s ease;
  }
`;

// ============ 分析頁面佈局 ============

export const AnalysisContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px;
  gap: 20px;
  box-sizing: border-box;
`;

export const LeftPanel = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RightPanel = styled.div`
  width: 60%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid ${MAIN_COLOR};
  border-radius: 15px;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

// ============ 照片顯示區 ============

export const ImageContainer = styled.div`
  width: 100%;
  height: 60%;
  border: 2px solid ${MAIN_COLOR};
  border-radius: 15px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// ============ 按鈕區域 ============

export const ButtonsContainer = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0;
`;

// ============ 分析按鈕樣式 ============

export const AnalysisButton = styled.button`
  width: 100%;
  padding: 15px 20px;
  border-radius: 15px;
  border: 2px solid;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  /* 根據狀態設置樣式 */
  ${props => {
    switch (props.status) {
      case 'pending':
        return `
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          border-color: #9ca3af;
          color: #d1d5db;
          cursor: not-allowed;
          opacity: 0.7;
        `;
      case 'processing':
        return `
          background: linear-gradient(135deg, #6b7280, #9ca3af, #6b7280);
          background-size: 200% 200%;
          border-color: ${MAIN_COLOR};
          color: white;
          animation: ${heartbeat} 1.2s ease-in-out infinite;
          cursor: not-allowed;
        `;
      case 'completed':
        return `
          background: linear-gradient(135deg, ${MAIN_COLOR} 0%, #00b8a9 50%, ${MAIN_COLOR} 100%);
          background-size: 200% 200%;
          border-color: ${MAIN_COLOR};
          color: white;
          animation: ${gradientFlow} 4s ease infinite;
          
          &:hover {
            animation: ${gradientFlow} 2s ease infinite, ${borderGlow} 2s ease infinite;
            transform: translateY(-2px);
          }
        `;
      case 'selected':
        return `
          background: linear-gradient(135deg, #00d4aa 0%, ${MAIN_COLOR} 50%, #00d4aa 100%);
          background-size: 200% 200%;
          border-color: #00d4aa;
          color: white;
          animation: ${gradientFlow} 3s ease infinite, ${borderGlow} 3s ease infinite;
          transform: scale(1.02);
        `;
      default:
        return `
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          border-color: #9ca3af;
          color: #d1d5db;
        `;
    }
  }}
  
  /* 完成標示 */
  ${props => props.status === 'completed' && `
    &::after {
      content: '✓';
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      font-weight: bold;
    }
  `}
`;

// ============ 功能按鈕 ============

export const ActionButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  border-radius: 12px;
  border: 2px solid #666;
  background: linear-gradient(135deg, #374151, #4b5563);
  color: #d1d5db;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${MAIN_COLOR};
    background: linear-gradient(135deg, #4b5563, #6b7280);
    color: white;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// ============ 結果顯示區 ============

export const ResultDisplayArea = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  /* 自定義捲軸 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${MAIN_COLOR};
    border-radius: 4px;
    
    &:hover {
      background: #00b8a9;
    }
  }
`;

export const ResultCard = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 158, 147, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(5px);
  
  h3 {
    color: ${MAIN_COLOR};
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
    font-family: 'Noto Serif TC', serif;
  }
  
  .content-item {
    margin-bottom: 12px;
    
    .item-title {
      color: #e5e7eb;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    
    .item-content {
      color: #9ffcea;
      font-size: 14px;
      line-height: 1.6;
    }
  }
`;

export const PlaceholderText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 16px;
  font-family: 'Noto Serif TC', serif;
  text-align: center;
`;

// ============ 通用元素 ============

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  font-size: 24px;
  font-weight: 600;
  font-family: "Noto Serif TC", serif;
  backdrop-filter: blur(5px);
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: white;
  padding: 40px;
  
  h2 {
    color: ${MAIN_COLOR};
    font-size: 28px;
    margin-bottom: 20px;
    font-family: 'Noto Serif TC', serif;
  }
  
  p {
    font-size: 18px;
    line-height: 1.6;
    font-family: 'Noto Serif TC', serif;
  }
`;