import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  PageWrapper,
  ChineseContainer,
  BorderContainer,
  Corner,
  ContentWrapper,
  TitleContainer,
  LogoContainer,
  FormContainer,
  InputContainer,
  Input,
  ButtonGroup,
  CategoryButton,
  StartButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalCloseButton,
  NumberInput
} from './styles-fortune-mobile';
import FortuneResult from './FortuneNumber';

const FortuneMobileView = () => {
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [fortuneNumber, setFortuneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingNumber, setExistingNumber] = useState(null);

  const handleStartFortune = () => {
    setExistingNumber(null);  // 正常抽籤流程，清空既有籤號
    setShowResult(true);
  };

  const handleExistingNumber = () => {
    const number = parseInt(fortuneNumber);
    if (number >= 1 && number <= 24) {
      setExistingNumber(number);  // 設置已有籤號
      setShowNumberModal(false);
      setShowResult(true);
    } else {
      alert('請輸入 1-24 之間的籤號');
    }
  };

  const handleRetry = () => {
    setName('');
    setSelectedCategory(null);
    setShowResult(false);
    setFortuneNumber('');
    setExistingNumber(null);
  };

  return (
    <PageWrapper>
      <ChineseContainer>
        <BorderContainer />
        <Corner className="top-left" />
        <Corner className="top-right" />
        <Corner className="bottom-left" />
        <Corner className="bottom-right" />

        <ContentWrapper>
          {!showResult ? (
            <>
              <TitleContainer>
                <img src="/app_title_fortune.png" alt="解籤大師" />
              </TitleContainer>

              <LogoContainer>
                <img src="/mobile_logo_fortune.png" alt="解籤大師圖示" />
              </LogoContainer>

              <FormContainer>
                <InputContainer>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="請輸入姓名"
                    maxLength={20}
                  />
                </InputContainer>

                <ButtonGroup>
                  <CategoryButton
                    selected={selectedCategory === 'love'}
                    onClick={() => setSelectedCategory('love')}
                  >
                    愛情
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === 'career'}
                    onClick={() => setSelectedCategory('career')}
                  >
                    事業
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === 'wealth'}
                    onClick={() => setSelectedCategory('wealth')}
                  >
                    財運
                  </CategoryButton>
                </ButtonGroup>

                <StartButton
                  disabled={!selectedCategory}
                  onClick={handleStartFortune}
                >
                  開始抽籤
                </StartButton>

                <StartButton
                  disabled={!selectedCategory}
                  onClick={() => setShowNumberModal(true)}
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#C84B31', 
                    border: '2px solid #C84B31',
                    marginTop: '10px'
                  }}
                >
                  已有籤號
                </StartButton>
              </FormContainer>
            </>
          ) : (
            <FortuneResult
              user_name={name}
              category={selectedCategory}
              existingNumber={existingNumber}  // 傳遞已有籤號
            />
          )}
        </ContentWrapper>
      </ChineseContainer>

      {showNumberModal && (
        <ModalOverlay onClick={() => setShowNumberModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setShowNumberModal(false)}>
              <X size={20} />
            </ModalCloseButton>
            <ModalTitle>請輸入籤號</ModalTitle>
            <NumberInput
              type="number"
              min="1"
              max="24"
              value={fortuneNumber}
              onChange={(e) => setFortuneNumber(e.target.value)}
              placeholder="1-24"
            />
            <StartButton
              onClick={handleExistingNumber}
              disabled={isLoading || !fortuneNumber || parseInt(fortuneNumber) < 1 || parseInt(fortuneNumber) > 24}
            >
              確定
            </StartButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default FortuneMobileView;