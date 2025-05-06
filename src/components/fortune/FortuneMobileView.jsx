import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
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
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useTranslation, translateError } from "../../i18n";

const FortuneMobileView = ({ lang }) => {
  const [searchParams] = useSearchParams(); 
  const { pathname } = useLocation();
  const { t } = useTranslation(lang);
  
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [fortuneNumber, setFortuneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingNumber, setExistingNumber] = useState(null);
  const [useNameAnalysis, setUseNameAnalysis] = useState(true); // 默認開啟姓名學分析
  const [instanceKey, setInstanceKey] = useState(Date.now()); // 用於強制重新渲染FortuneResult
  const [error, setError] = useState("");

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
      setError("");
      
      // 更新URL，移除reset參數
      const url = new URL(window.location.href);
      url.searchParams.delete("reset");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const handleStartFortune = () => {
    // 檢查是否選擇了類別
    if (!selectedCategory) {
      setError(t("fortuneTelling.noCategoryError"));
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // 如果啟用姓名學分析但沒有填寫姓名，使用預設值
    if (useNameAnalysis && !name.trim()) {
      setName(t("fortuneTelling.guestName", { defaultValue: "訪客" }));
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
      setError("");
      
      // 如果啟用姓名學分析但沒有填寫姓名，使用預設值
      if (useNameAnalysis && !name.trim()) {
        setName(t("fortuneTelling.guestName", { defaultValue: "訪客" }));
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
      setError(t("fortuneTelling.invalidFortuneNumber", { defaultValue: "請輸入 1-24 之間的籤號" }));
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
          <LanguageSwitcher />
          
          {!showResult ? (
            <>
              <TitleContainer>
                <img src="/app_title_fortune_aws.png" alt={t("fortuneTelling.title")} />
              </TitleContainer>

              <LogoContainer>
                <img src="/mobile_logo_fortune_aws.png" alt={t("fortuneTelling.title")} />
              </LogoContainer>

              <FormContainer>
                {/* 姓名學分析開關 */}
                <ToggleContainer>
                  <ToggleLabel>
                    {t("fortuneTelling.nameAnalysis")}
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
                      placeholder={t("fortuneTelling.enterName")}
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
                    {t("fortuneTelling.category.love")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "career"}
                    onClick={() => setSelectedCategory("career")}
                  >
                    {t("fortuneTelling.category.career")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "wealth"}
                    onClick={() => setSelectedCategory("wealth")}
                  >
                    {t("fortuneTelling.category.wealth")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "family"}
                    onClick={() => setSelectedCategory("family")}
                  >
                    {t("fortuneTelling.category.family")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "study"}
                    onClick={() => setSelectedCategory("study")}
                  >
                    {t("fortuneTelling.category.study")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "travel"}
                    onClick={() => setSelectedCategory("travel")}
                  >
                    {t("fortuneTelling.category.travel")}
                  </CategoryButton>
                </ButtonGroup>
                
                {error && (
                  <div style={{ 
                    color: 'red', 
                    backgroundColor: '#fee', 
                    padding: '10px', 
                    margin: '10px 0', 
                    borderRadius: '5px',
                    textAlign: 'center',
                    width: '90%',
                    maxWidth: '400px'
                  }}>
                    {error}
                  </div>
                )}
                
                {/* 開始抽籤按鈕 */}
                <StartButton
                  disabled={!selectedCategory || isLoading}
                  onClick={handleStartFortune}
                >
                  {isLoading ? t("common.loading") : t("fortuneTelling.startFortuneTelling")}
                </StartButton>

                {/* 已有籤號按鈕 */}
                <TransparentStartButton
                  disabled={!selectedCategory || isLoading}
                  onClick={() => setShowNumberModal(true)}
                >
                  {t("fortuneTelling.hasFortuneNumber")}
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
              lang={lang} // 傳遞語言設定給子組件
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
            <ModalTitle>{t("fortuneTelling.chooseFortuneNumber")}</ModalTitle>

            {/* 數字輸入框 */}
            <NumberInput
              type="number"
              min="1"
              max="24"
              value={fortuneNumber}
              onChange={(e) => setFortuneNumber(e.target.value)}
              placeholder={t("fortuneTelling.fortuneNumberPlaceholder")}
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

            {error && (
              <div style={{ 
                color: 'red', 
                backgroundColor: '#fee', 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '5px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <StartButton
              onClick={handleExistingNumber}
              disabled={
                isLoading ||
                !fortuneNumber ||
                parseInt(fortuneNumber) < 1 ||
                parseInt(fortuneNumber) > 24
              }
            >
              {isLoading ? t("common.loading") : t("fortuneTelling.confirm")}
            </StartButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {isLoading && (
        <ModalOverlay>
          <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Noto Serif TC, serif' }}>
            {t("common.loading")}
          </div>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default FortuneMobileView;