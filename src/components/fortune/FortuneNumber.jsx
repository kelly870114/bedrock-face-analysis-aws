import React, { useState, useEffect, useRef } from "react";
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

// 籤詩文本容器
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

// 建立一個全局變數來追蹤請求，避免重複
// 這是React.StrictMode在開發中重複渲染的解決方案
const hasInitializedMap = {};

const FortuneNumber = ({
  user_name,
  category,
  existingNumber = null,
  useNameAnalysis = true,
}) => {
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isLoadingPoem, setIsLoadingPoem] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [fortunePoem, setFortunePoem] = useState(null);
  const [fortuneAnalysisId, setFortuneAnalysisId] = useState(null);
  const [error, setError] = useState(null);
  
  // 創建唯一ID以識別該組件實例
  const instanceIdRef = useRef(
    `${category}_${existingNumber || 'random'}_${Date.now()}`
  );
  
  // 使用 instanceId 來防止重複請求
  const instanceId = instanceIdRef.current;

  // 使用固定的fortuneNumber
  const [localFortuneNumber] = useState(() => {
    if (existingNumber && existingNumber >= 1 && existingNumber <= 24) {
      return existingNumber;
    }
    return Math.floor(Math.random() * 24) + 1;
  });

  // 初始化籤詩數據 - 使用單獨的useEffect確保只執行一次
  useEffect(() => {
    // 如果不使用姓名學分析，直接返回
    if (!useNameAnalysis) {
      return;
    }
    
    // 如果缺少必要參數，直接返回
    if (!category || !localFortuneNumber) {
      return;
    }
    
    // 確認此實例是否已經初始化過
    if (hasInitializedMap[instanceId]) {
      console.log(`實例 ${instanceId} 已經初始化過，跳過`);
      return;
    }
    
    // 標記此實例已初始化
    hasInitializedMap[instanceId] = true;
    
    console.log(`實例 ${instanceId} 開始初始化籤詩數據`);
    
    // 設置載入狀態
    setIsLoadingPoem(true);
    
    // 異步函數定義
    const initializeFortunePoem = async () => {
      try {
        // 準備用戶名
        const nameToUse = user_name?.trim() ? user_name : "訪客";
        
        console.log(`實例 ${instanceId} 發送獲取籤詩請求`, {
          user_name: nameToUse,
          fortune_category: category,
          fortune_number: localFortuneNumber
        });
        
        // 發送API請求
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
        
        // 檢查回應
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "獲取籤詩失敗");
        }
        
        // 解析結果
        const result = await response.json();
        console.log(`實例 ${instanceId} 籤詩獲取成功`, result);
        
        // 更新狀態
        setFortunePoem(result.poem);
        if (result.fortune_analysis_id) {
          setFortuneAnalysisId(result.fortune_analysis_id);
        }
        
      } catch (error) {
        console.error(`實例 ${instanceId} 籤詩獲取錯誤:`, error);
        setError(error.message);
        setFortunePoem("無法獲取籤詩內容，請稍後再試或使用傳統抽籤模式。");
      } finally {
        // 完成載入
        setIsLoadingPoem(false);
        console.log(`實例 ${instanceId} 籤詩載入完成`);
      }
    };
    
    // 執行初始化
    initializeFortunePoem();
    
    // 組件卸載時的清理
    return () => {
      console.log(`實例 ${instanceId} 組件卸載`);
      // 可以在這裡添加取消請求的邏輯
    };
  }, []); // 空依賴陣列確保只執行一次

  // 處理解籤請求
  const handleInterpret = async () => {
    // 防止重複點擊
    if (isInterpreting) return;
    
    try {
      // 設置解籤中狀態
      setIsInterpreting(true);
      setError(null);

      // 驗證必要參數
      if (!category || !localFortuneNumber) {
        throw new Error("缺少必要參數");
      }

      // 準備用戶名
      const nameToUse = useNameAnalysis && user_name?.trim() ? user_name : "訪客";

      // 構建請求體
      const requestBody = {
        user_name: nameToUse,
        fortune_category: category,
        fortune_number: localFortuneNumber,
      };

      // 如果有fortuneAnalysisId，添加到請求體
      if (fortuneAnalysisId) {
        requestBody.fortune_analysis_id = fortuneAnalysisId;
      }

      // 如果不使用姓名學分析，設置標誌
      if (!useNameAnalysis) {
        requestBody.use_name_analysis = false;
      }

      console.log(`實例 ${instanceId} 發送解籤請求`, requestBody);

      // 發起API請求
      const response = await fetch(`${config.apiEndpoint}/interpretFortune`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // 檢查響應狀態
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "解籤失敗");
      }

      // 解析結果
      const result = await response.json();
      console.log(`實例 ${instanceId} 解籤成功`, result);
      
      // 更新解釋結果
      setInterpretation(result);
    } catch (error) {
      console.error(`實例 ${instanceId} 解籤錯誤:`, error);
      setError(error.message);
      alert(error.message || "解籤失敗，請稍後再試");
    } finally {
      // 完成解籤請求
      setIsInterpreting(false);
    }
  };

  // 重新抽籤處理
  const handleReset = () => {
    if (isInterpreting || isLoadingPoem) return;
    
    // 使用URL參數重新載入頁面
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('reset', Date.now());
    window.location.href = currentUrl.toString();
  };

  // 顯示錯誤資訊
  const ErrorMessage = () => {
    if (!error) return null;
    return (
      <div style={{ 
        color: 'red', 
        backgroundColor: '#fee', 
        padding: '10px', 
        margin: '10px 0', 
        borderRadius: '5px',
        textAlign: 'center'
      }}>
        錯誤: {error}
      </div>
    );
  };

  // 如果已有解釋結果，顯示解釋頁面
  if (interpretation) {
    return (
      <FortuneInterpret
        name={useNameAnalysis ? user_name : ""}
        category={category}
        fortuneNumber={localFortuneNumber}
        interpretation={interpretation}
        useNameAnalysis={useNameAnalysis}
        fortune_analysis_id={fortuneAnalysisId}
      />
    );
  }

  // 確保籤號是兩位數的字串格式
  const formattedNumber = String(localFortuneNumber).padStart(2, "0");

  // 添加調試信息
  console.log(`實例 ${instanceId} 渲染狀態`, { 
    isLoadingPoem, 
    fortunePoem, 
    useNameAnalysis, 
    localFortuneNumber, 
    error 
  });

  return (
    <Container>
      <ErrorMessage />
      
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
              disabled={isInterpreting || isLoadingPoem}
            >
              {isInterpreting ? "解籤中..." : "開始解籤"}
            </InterpretButton>
            <InterpretButton
              onClick={handleReset}
              disabled={isInterpreting || isLoadingPoem}
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