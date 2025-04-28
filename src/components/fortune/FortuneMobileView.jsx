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
  AwsLogoContainer,
  LogoContainer,
  FormContainer,
  InputContainer,
  Input,
  ButtonGroup,
  CategoryButton,
  StartButton,
  TransparentStartButton,
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
  const [instanceKey, setInstanceKey] = useState(Date.now()); // 用於強制重新渲染FortuneResult

  // 從 URL 參數讀取默認的姓名學分析設置和重置信息
  useEffect(() => {
    const nameAnalysisParam = searchParams.get("nameAnalysis");
    if (nameAnalysisParam === "false") {
      setUseNameAnalysis(false);
    }
    
    // 檢查是否是重置操作
    const resetParam = searchParams.get("reset");
    if (resetParam) {
      // 重置所有狀態
      setName("");
      setSelectedCategory(null);
      setShowResult(false);
      setExistingNumber(null);
      setFortuneNumber("");
      
      // 更新URL，移除reset參數
      const url = new URL(window.location.href);
      url.searchParams.delete("reset");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const handleStartFortune = () => {
    // 檢查是否選擇了類別
    if (!selectedCategory) {
      alert("請選擇一個籤詩類別");
      return;
    }
    
    setIsLoading(true);
    
    // 如果啟用姓名學分析但沒有填寫姓名，使用預設值
    if (useNameAnalysis && !name.trim()) {
      setName("訪客");
    }
    
    // 清空既有籤號
    setExistingNumber(null);
    
    // 生成新的instanceKey，確保FortuneResult組件完全重新渲染
    setInstanceKey(Date.now());
    
    // 使用延時確保狀態更新完成後再顯示結果
    setTimeout(() => {
      setShowResult(true);
      setIsLoading(false);
    }, 50);
  };

  const handleExistingNumber = () => {
    const number = parseInt(fortuneNumber);
    if (number >= 1 && number <= 24) {
      setIsLoading(true);
      
      // 如果啟用姓名學分析但沒有填寫姓名，使用預設值
      if (useNameAnalysis && !name.trim()) {
        setName("訪客");
      }
      
      // 設置已有籤號
      setExistingNumber(number);
      
      // 關閉模態框
      setShowNumberModal(false);
      
      // 生成新的instanceKey
      setInstanceKey(Date.now());
      
      // 延時顯示結果
      setTimeout(() => {
        setShowResult(true);
        setIsLoading(false);
      }, 50);
    } else {
      alert("請輸入 1-24 之間的籤號");
    }
  };

  // 姓名學分析切換處理函數
  const handleToggleNameAnalysis = () => {
    setUseNameAnalysis(!useNameAnalysis);
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
              <AwsLogoContainer>
                <img src="/aws-logo.png" alt="AWS" />
              </AwsLogoContainer>
            
              <TitleContainer>
                <img src="/app_title_fortune_aws.png" alt="解籤大師" />
              </TitleContainer>

              <LogoContainer>
                <img src="/mobile_logo_fortune_aws.png" alt="解籤大師圖示" />
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
                <StartButton
                  disabled={!selectedCategory || isLoading}
                  onClick={handleStartFortune}
                >
                  {isLoading ? "請稍候..." : "開始抽籤"}
                </StartButton>

                {/* 已有籤號按鈕 */}
                <TransparentStartButton
                  disabled={!selectedCategory || isLoading}
                  onClick={() => setShowNumberModal(true)}
                >
                  已有籤號
                </TransparentStartButton>
              </FormContainer>
            </>
          ) : (
            <FortuneResult
              key={instanceKey} // 使用key強制重新渲染
              user_name={useNameAnalysis ? name : ""}
              category={selectedCategory}
              existingNumber={existingNumber}
              useNameAnalysis={useNameAnalysis}
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
              {isLoading ? "請稍候..." : "確定"}
            </StartButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {isLoading && (
        <ModalOverlay>
          <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Noto Serif TC, serif' }}>
            載入中...
          </div>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default FortuneMobileView;