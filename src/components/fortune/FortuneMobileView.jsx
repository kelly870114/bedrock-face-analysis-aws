import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
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
  NumberInput,
  NumberButtonGrid,
  NumberButton,
  // 姓名學
  ToggleContainer,
  ToggleLabel,
  ToggleSwitch,
  ToggleInput,
  ToggleSlider
} from "./styles-fortune-mobile";
import FortuneResult from "./FortuneNumber";

const FortuneMobileView = () => {
  const [searchParams] = useSearchParams(); 
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [fortuneNumber, setFortuneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingNumber, setExistingNumber] = useState(null);
  const [useNameAnalysis, setUseNameAnalysis] = useState(true); // 默認開啟姓名學分析

  // 新增: 從 URL 參數讀取默認的姓名學分析設置
  useEffect(() => {
    const nameAnalysisParam = searchParams.get("nameAnalysis");
    if (nameAnalysisParam === "false") {
      setUseNameAnalysis(false);
    }
  }, [searchParams]);

  const handleStartFortune = () => {
    // 新增: 如果啟用姓名學分析但沒有填寫姓名，使用預設值
    if (useNameAnalysis && !name.trim()) {
      setName("訪客");
    }
    
    setExistingNumber(null); // 正常抽籤流程，清空既有籤號
    setShowResult(true);
  };

  const handleExistingNumber = () => {
    const number = parseInt(fortuneNumber);
    if (number >= 1 && number <= 24) {
      // 新增: 如果啟用姓名學分析但沒有填寫姓名，使用預設值
      if (useNameAnalysis && !name.trim()) {
        setName("訪客");
      }
      
      setExistingNumber(number); // 設置已有籤號
      setShowNumberModal(false);
      setShowResult(true);
    } else {
      alert("請輸入 1-24 之間的籤號");
    }
  };

  // 姓名學分析切換處理函數
  const handleToggleNameAnalysis = () => {
    setUseNameAnalysis(!useNameAnalysis);
  };

  const handleRetry = () => {
    setName("");
    setSelectedCategory(null);
    setShowResult(false);
    setFortuneNumber("");
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

                {/* 姓名學分析開關 */}
                <ToggleContainer>
                  <ToggleLabel>
                    結合姓名學分析
                    <ToggleSwitch>
                      <ToggleInput
                        type="checkbox"
                        checked={useNameAnalysis}
                        onChange={handleToggleNameAnalysis}
                      />
                      <ToggleSlider />
                    </ToggleSwitch>
                  </ToggleLabel>
                </ToggleContainer>

                {useNameAnalysis && (
                  <InputContainer>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="請輸入姓名"
                      maxLength={20}
                    />
                  </InputContainer>
                )}

                {/* 類別選擇按鈕 */}
                <ButtonGroup>
                  <CategoryButton
                    selected={selectedCategory === "love"}
                    onClick={() => setSelectedCategory("love")}
                  >
                    愛情
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "career"}
                    onClick={() => setSelectedCategory("career")}
                  >
                    事業
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "wealth"}
                    onClick={() => setSelectedCategory("wealth")}
                  >
                    財運
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "family"}
                    onClick={() => setSelectedCategory("family")}
                  >
                    家庭
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "study"}
                    onClick={() => setSelectedCategory("study")}
                  >
                    學業
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "travel"}
                    onClick={() => setSelectedCategory("travel")}
                  >
                    旅遊
                  </CategoryButton>
                </ButtonGroup>
                
                {/* 開始抽籤按鈕 */}
                {/* 活動需要抽籤按鈕才使用 */}
                <StartButton
                  disabled={!selectedCategory}
                  onClick={handleStartFortune}
                >
                  開始抽籤
                </StartButton>

                {/* 已有籤號按鈕 */}
                <StartButton
                  disabled={!selectedCategory}
                  onClick={() => setShowNumberModal(true)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#C84B31",
                    border: "2px solid #C84B31",
                    marginTop: "10px",
                  }}
                >
                  已有籤號
                </StartButton>
              </FormContainer>
            </>
          ) : (
            <FortuneResult
              user_name={useNameAnalysis ? name : ""} // 只在使用姓名學分析時傳遞姓名
              category={selectedCategory}
              existingNumber={existingNumber}
              useNameAnalysis={useNameAnalysis} // 傳遞是否使用姓名學分析
            />
          )}
        </ContentWrapper>
      </ChineseContainer>

      {showNumberModal && (
        <ModalOverlay onClick={() => setShowNumberModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setShowNumberModal(false)}>
              <X size={20} />
            </ModalCloseButton>
            <ModalTitle>選擇籤號</ModalTitle>

            {/* 數字輸入框 */}
            <NumberInput
              type="number"
              min="1"
              max="24"
              value={fortuneNumber}
              onChange={(e) => setFortuneNumber(e.target.value)}
              placeholder="1-24"
            />

            {/* 數字按鈕 */}
            <NumberButtonGrid>
              {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                <NumberButton
                  key={num}
                  selected={parseInt(fortuneNumber) === num}
                  onClick={() => setFortuneNumber(num.toString())}
                >
                  {num}
                </NumberButton>
              ))}
            </NumberButtonGrid>

            <StartButton
              onClick={handleExistingNumber}
              disabled={
                isLoading ||
                !fortuneNumber ||
                parseInt(fortuneNumber) < 1 ||
                parseInt(fortuneNumber) > 24
              }
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
