import React from 'react';
import styled from 'styled-components';

// 整體容器 - 使用固定比例
const TechFortunePoemContainer = styled.div`
  width: 90%;
  max-width: 250px;
  margin: 0 auto 40px;
  position: relative;
  aspect-ratio: 5 / 16; // 固定長寬比為9:16，類似手機螢幕比例
  background-image: url('/tech-fortune-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

// AWS Logo 部分
const LogoSection = styled.div`
  position: absolute;
  top: 5%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  
  img {
    width: 70px;
    height: auto;
  }
`;

// 雲端開運運勢標題
const TitleSection = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  
  .title-bg {
    background: linear-gradient(90deg, rgba(46, 182, 177, 0.7) 0%, rgba(46, 182, 177, 1) 50%, rgba(46, 182, 177, 0.7) 100%);
    border-radius: 25px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    
    &::before, &::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 100%;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  
  .title-text {
    color: white;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    z-index: 1;
  }
`;

// 主要籤詩內容邊框區域
const PoemContentSection = styled.div`
  position: absolute;
  top: 22%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 40%;
  background-color: rgba(14, 27, 43, 0.9);
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(46, 182, 177, 0.8);
  box-shadow: 0 0 15px rgba(46, 182, 177, 0.4);

`;

// 籤詩文字容器
const PoemTextContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  z-index: 3;
  padding: 5px;
`;

// 垂直籤詩行
const VerticalPoemLine = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 8px; // 增加行間距
`;

// 籤詩字元
const PoemCharacter = styled.span`
  color: white;
  font-family: "Noto Serif TC", serif;
  font-size: 22px;
  line-height: 1.4; // 調整行高
  text-align: center;
  margin: 1px 0; // 減少字元間的垂直間距
  font-weight: 500; // 增加字體粗細
`;

// 底部 Powered By 區域
const FooterSection = styled.div`
  position: absolute;
  bottom: 33%;
  left: 0;
  right: 0;
  text-align: center;
  
  .powered-by {
    font-size: 12px;
    color: white;
    letter-spacing: 1px;
  }
`;

// 底部願望區域
const WishSection = styled.div`
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  
  .wish-container {
    background: linear-gradient(90deg, rgba(46, 182, 177, 0.5) 0%, rgba(81, 162, 230, 0.8) 100%);
    border-radius: 15px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 15px rgba(46, 182, 177, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .wish-title {
    color: white;
    font-size: 16px;
    text-align: center;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  .wish-area {
    height: 150px; // 創建一個空白區域，讓使用者可以寫字
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    border: 1px dashed rgba(255, 255, 255, 0.3);
  }
`;

const TechFortunePoem = ({ userName = "", poemContent = "" }) => {
  // 將詩句分成多行，七言絕句一般是4行7字
  const preparePoem = (content) => {
    if (!content) return [];
    
    // 移除所有空白字符和標點符號（逗號、句號、頓號等）
    const cleanContent = content.replace(/\s+/g, '').replace(/[，。、；：！？,.;:!?]/g, '');
    
    // 確定每行的字數（假設是7個字一行）
    const charsPerLine = 7;
    
    // 將內容分割為數組，每行7個字
    const lines = [];
    for (let i = 0; i < cleanContent.length; i += charsPerLine) {
      const line = cleanContent.substr(i, charsPerLine);
      if (line) {
        lines.push(line.split('')); // 每行再分割為單個字符
      }
    }
    
    return lines;
  };

  const poemLines = preparePoem(poemContent);

  return (
    <TechFortunePoemContainer>
      {/* AWS Logo */}
      <LogoSection>
        <img src="/aws-logo.png" alt="AWS Logo" />
      </LogoSection>
      
      {/* 雲端開運運勢標題 */}
      <TitleSection>
        <div className="title-bg">
          <div className="title-text">雲端開運運勢</div>
        </div>
      </TitleSection>
      
      {/* 籤詩內容區域 */}
      <PoemContentSection>
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-left"></div>
        <div className="corner bottom-right"></div>
        
        <div className="edge-decoration right-edge"></div>
        <div className="edge-decoration bottom-edge"></div>
        
        <PoemTextContainer>
          {poemLines.map((line, lineIndex) => (
            <VerticalPoemLine key={lineIndex}>
              {line.map((char, charIndex) => (
                <PoemCharacter key={charIndex}>{char}</PoemCharacter>
              ))}
            </VerticalPoemLine>
          ))}
        </PoemTextContainer>
      </PoemContentSection>
      
      {/* 底部 Powered By */}
      <FooterSection>
        <div className="powered-by">POWERED BY AMAZON NOVA</div>
      </FooterSection>
      
      {/* 底部願望區域 */}
      <WishSection>
        <div className="wish-container">
          <div className="wish-title">寫下年度願望換取小禮物</div>
          <div className="wish-area"></div>
        </div>
      </WishSection>
    </TechFortunePoemContainer>
  );
};

export default TechFortunePoem;