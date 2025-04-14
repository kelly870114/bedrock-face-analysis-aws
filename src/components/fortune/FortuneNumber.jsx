import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { config } from "../../config";
import FortuneInterpret from "./FortuneInterpret";

const MAIN_COLOR = "#C84B31";

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

// 新增: 籤詩文本容器
const FortuneTextContainer = styled.div`
  margin: 20px auto;
  padding: 20px;
  background-color: #fff0d9;
  border: 2px solid ${MAIN_COLOR};
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  font-family: "Noto Serif TC", serif;
`;

const FortuneTitle = styled.h3`
  font-size: 18px;
  color: ${MAIN_COLOR};
  margin-bottom: 16px;
`;

const FortuneText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
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
  font-family: "Noto Serif TC", serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(184, 92, 56, 0.3);
  width: 200px;

  &:hover {
    transform: translateY(-2px);
    background-color: #b85c38;
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
  font-family: "Noto Serif TC", serif;
`;

const FortuneNumber = ({
  user_name,
  category,
  existingNumber = null,
  useNameAnalysis = true,
}) => {
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isLoadingPoem, setIsLoadingPoem] = useState(useNameAnalysis); // 新增: 載入籤詩狀態
  const [interpretation, setInterpretation] = useState(null);
  const [fortunePoem, setFortunePoem] = useState(null); // 新增: 籤詩內容
  const [localFortuneNumber] = useState(() => {
    // 如果有existingNumber就使用它，否則隨機生成
    if (existingNumber && existingNumber >= 1 && existingNumber <= 24) {
      return existingNumber;
    }
    return Math.floor(Math.random() * 24) + 1;
  });

  // 新增: 根據籤號和姓名學選項載入籤詩
  useEffect(() => {
    const fetchFortunePoem = async () => {
      if (!useNameAnalysis) {
        setIsLoadingPoem(false);
        return; // 不使用姓名學分析時直接顯示圖片，不請求籤詩文本
      }

      setIsLoadingPoem(true);
      try {
        if (!category || !localFortuneNumber) {
          throw new Error("缺少必要參數");
        }

        const nameToUse = user_name?.trim() ? user_name : "訪客";

        const response = await fetch(`${config.apiEndpoint}/getFortunePoem`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: nameToUse,
            fortune_category: category,
            fortune_number: localFortuneNumber,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "獲取籤詩失敗");
        }

        const result = await response.json();
        setFortunePoem(result.poem);
      } catch (error) {
        console.error("Error fetching fortune poem:", error);
        // 獲取失敗時顯示默認文本
        setFortunePoem("無法獲取籤詩內容，請稍後再試或使用傳統抽籤模式。");
      } finally {
        setIsLoadingPoem(false);
      }
    };

    fetchFortunePoem();
  }, [localFortuneNumber, user_name, category, useNameAnalysis]);

  const handleInterpret = async () => {
    try {
      setIsInterpreting(true);

      if (!category || !localFortuneNumber) {
        throw new Error("缺少必要參數");
      }

      // 如果用户没有输入名字，使用默认值
      const nameToUse =
        useNameAnalysis && user_name?.trim() ? user_name : "訪客";

      const requestBody = {
        user_name: nameToUse,
        fortune_category: category,
        fortune_number: localFortuneNumber,
      };

      // 添加是否使用姓名學分析的參數
      if (!useNameAnalysis) {
        requestBody.use_name_analysis = false;
      }

      const response = await fetch(`${config.apiEndpoint}/interpretFortune`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "解籤失敗");
      }

      const result = await response.json();
      setInterpretation(result);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "解籤失敗，請稍後再試");
    } finally {
      setIsInterpreting(false);
    }
  };

  if (interpretation) {
    return (
      <FortuneInterpret
        name={useNameAnalysis ? user_name : ""}
        category={category}
        fortuneNumber={localFortuneNumber}
        interpretation={interpretation}
        useNameAnalysis={useNameAnalysis}
      />
    );
  }

  // 確保籤號是兩位數的字串格式
  const formattedNumber = String(localFortuneNumber).padStart(2, "0");

  return (
    <Container>
      {isLoadingPoem ? (
        <LoadingOverlay>籤詩生成中...</LoadingOverlay>
      ) : (
        <>
          {useNameAnalysis && fortunePoem ? (
            // 當使用姓名學分析時顯示文本籤詩
            <FortuneTextContainer>
              <FortuneTitle>{user_name || "訪客"}的專屬籤詩</FortuneTitle>
              <FortuneText>{fortunePoem}</FortuneText>
            </FortuneTextContainer>
          ) : (
            // 當不使用姓名學分析時顯示圖片籤詩
            <FortuneImageContainer>
              <FortuneImage>
                <img
                  src={`/jenn-ai/${formattedNumber}.png`}
                  alt={`第${localFortuneNumber}籤`}
                />
              </FortuneImage>
            </FortuneImageContainer>
          )}

          <ButtonContainer>
            <InterpretButton
              onClick={handleInterpret}
              disabled={isInterpreting}
            >
              {isInterpreting ? "解籤中..." : "開始解籤"}
            </InterpretButton>
            <InterpretButton
              onClick={() => window.location.reload()}
              disabled={isInterpreting}
              style={{
                backgroundColor: "transparent",
                color: MAIN_COLOR,
                border: `2px solid ${MAIN_COLOR}`,
              }}
            >
              重新抽籤
            </InterpretButton>
          </ButtonContainer>
        </>
      )}

      {isInterpreting && <LoadingOverlay>解籤中...</LoadingOverlay>}
    </Container>
  );
};

export default FortuneNumber;
