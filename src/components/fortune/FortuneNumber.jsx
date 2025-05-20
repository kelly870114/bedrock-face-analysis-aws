import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { config } from "../../config";
import FortuneInterpret from "./FortuneInterpret";
import TechFortunePoem from "./TechFortunePoem";
import { useTranslation, translateError } from "../../i18n";
import html2canvas from "html2canvas";

const MAIN_COLOR = "#009e93";

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
  background-color: rgba(0, 158, 148, 0.24);
  border: 2px solid ${MAIN_COLOR};
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  font-family: "Noto Serif TC", serif;
`;

const FortuneTitle = styled.h3`
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 16px;
  font-weight: bold;
`;

const FortuneText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #9ffcea;
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
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  width: 200px;

  &:hover {
    transform: translateY(-2px);
    background-color: #ffffff;
    color: ${MAIN_COLOR};
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

const TransparentButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 32px;
  border-radius: 16px;
  border-color: ${MAIN_COLOR};
  background-color: transparent;
  color: #9ffcea;
  font-size: 18px;
  font-weight: 800;
  font-family: "Noto Serif TC", serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  width: 200px;

  &:hover {
    transform: translateY(-2px);
    background-color: #ffffff;
    color: ${MAIN_COLOR};
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
  lang, // 新增語言參數
}) => {
  const { t } = useTranslation(lang); // 使用翻譯 Hook
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isLoadingPoem, setIsLoadingPoem] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [fortunePoem, setFortunePoem] = useState(null);
  const [fortuneAnalysisId, setFortuneAnalysisId] = useState(null);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false); // 新增列印狀態
  const fortunePoemRef = useRef(null); // 新增引用TechFortunePoem的ref

  // 創建唯一ID以識別該組件實例
  const instanceIdRef = useRef(
    `${category}_${existingNumber || "random"}_${Date.now()}`
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

  // 新增列印籤詩功能
  // 快速列印函數 - 使用預設最佳值
  const handleQuickPrint = async () => {
    if (!fortunePoemRef.current) {
      console.error("找不到籤詩組件的引用");
      return;
    }

    try {
      // 不再設置全局isPrinting，而是使用局部變量
      const printingIndicator = document.createElement("div");
      printingIndicator.style.position = "fixed";
      printingIndicator.style.bottom = "20px";
      printingIndicator.style.right = "20px";
      printingIndicator.style.background = "rgba(0,0,0,0.7)";
      printingIndicator.style.color = "white";
      printingIndicator.style.padding = "10px";
      printingIndicator.style.borderRadius = "5px";
      printingIndicator.style.zIndex = "9999";
      printingIndicator.textContent = "準備列印中...";
      document.body.appendChild(printingIndicator);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const fullCanvas = await html2canvas(fortunePoemRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false, // 減少日誌輸出
        useCORS: true,
        allowTaint: true,
        width: fortunePoemRef.current.offsetWidth,
        height: fortunePoemRef.current.offsetHeight,
      });

      const printWidth = 21; // cm
      const printHeight = 7.5; // cm

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("無法開啟列印視窗，請檢查您的瀏覽器設定是否允許彈出視窗。");
        document.body.removeChild(printingIndicator);
        return;
      }

      // 使用預設最佳值 - 縮放85%和垂直位置8%
      printWindow.document.write(`
      <html>
        <head>
          <title>籤詩列印</title>
          <style>
            @page {
              size: ${printWidth}cm ${printHeight}cm landscape;
              margin: 0;
            }
            
            body { 
              margin: 0; 
              padding: 0;
              background-color: #000;
              overflow: hidden;
            }
            
            .print-container {
              position: relative;
              width: 100%;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            
            .print-fortune {
              max-width: 100%;
              max-height: 90vh; /* 縮放85% */
              object-fit: contain;
              transform: rotate(180deg) translateY(0%); /* 垂直位置8% */
            }
            
            @media print {
              body {
                background-color: transparent;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <img src="${fullCanvas.toDataURL(
              "image/png"
            )}" class="print-fortune">
          </div>
          <script>
            window.onload = function() { 
              const img = document.querySelector('.print-fortune');
              if (img.complete) {
                setTimeout(function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 500);
                }, 300);
              } else {
                img.onload = function() {
                  setTimeout(function() {
                    window.print();
                    setTimeout(function() {
                      window.close();
                    }, 500);
                  }, 300);
                };
              }
            }
          </script>
        </body>
      </html>
    `);

      printWindow.document.close();

      // 當列印視窗關閉時，移除指示器
      printWindow.onafterprint = () => {
        document.body.removeChild(printingIndicator);
      };

      // 超時處理，確保指示器最終會消失
      setTimeout(() => {
        if (document.body.contains(printingIndicator)) {
          document.body.removeChild(printingIndicator);
        }
      }, 5000);
    } catch (error) {
      console.error("列印籤詩時出錯:", error);
      alert("列印籤詩時發生錯誤，請稍後再試");
      // 移除可能存在的指示器
      const existingIndicator = document.querySelector("#printing-indicator");
      if (existingIndicator) {
        document.body.removeChild(existingIndicator);
      }
    }
  };

  // 開發者模式列印函數 - 提供調整控制
  const handleDevModePrint = async () => {
    // 這裡使用您之前提供的代碼，帶有控制面板的版本
    if (!fortunePoemRef.current) {
      console.error("找不到籤詩組件的引用");
      return;
    }

    try {
      // 使用局部指示器代替全局狀態
      const printingIndicator = document.createElement("div");
      printingIndicator.style.position = "fixed";
      printingIndicator.style.bottom = "20px";
      printingIndicator.style.right = "20px";
      printingIndicator.style.background = "rgba(0,0,0,0.7)";
      printingIndicator.style.color = "white";
      printingIndicator.style.padding = "10px";
      printingIndicator.style.borderRadius = "5px";
      printingIndicator.style.zIndex = "9999";
      printingIndicator.textContent = "開發者模式：列印調整中...";
      document.body.appendChild(printingIndicator);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const fullCanvas = await html2canvas(fortunePoemRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: true,
        useCORS: true,
        allowTaint: true,
        width: fortunePoemRef.current.offsetWidth,
        height: fortunePoemRef.current.offsetHeight,
      });

      const printWidth = 21; // cm
      const printHeight = 7.5; // cm

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("無法開啟列印視窗，請檢查您的瀏覽器設定是否允許彈出視窗。");
        document.body.removeChild(printingIndicator);
        return;
      }

      // 開發者模式 - 帶有控制面板，預設值設為最佳值
      printWindow.document.write(`
      <html>
        <head>
          <title>籤詩列印 (開發者模式)</title>
          <style>
            @page {
              size: ${printWidth}cm ${printHeight}cm landscape;
              margin: 0;
            }
            
            body { 
              margin: 0; 
              padding: 0;
              background-color: #000;
              color: white;
              font-family: Arial, sans-serif;
              min-height: 100vh;
              overflow: hidden;
            }
            
            .print-container {
              position: relative;
              width: 100%;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            
            .print-fortune {
              max-width: 100%;
              max-height: 85vh; /* 默認值設為85% */
              object-fit: contain;
              transform: rotate(180deg) translateY(8%); /* 默認值設為8% */
            }
            
            #controls {
              position: fixed;
              top: 10px;
              left: 10px;
              background: rgba(0,0,0,0.7);
              padding: 15px;
              border-radius: 8px;
              z-index: 1000;
            }
            
            .control-group {
              margin-bottom: 15px;
            }
            
            label {
              display: block;
              margin-bottom: 5px;
              font-size: 14px;
            }
            
            input[type="range"] {
              width: 200px;
            }
            
            .value-display {
              display: inline-block;
              width: 40px;
              text-align: right;
              margin-left: 8px;
            }
            
            button {
              background: #009e93;
              color: white;
              border: none;
              padding: 8px 15px;
              border-radius: 4px;
              cursor: pointer;
              margin-right: 10px;
            }
            
            @media print {
              #controls {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div id="controls">
            <div class="control-group">
              <label>縮放大小 <span id="scale-value" class="value-display">85%</span></label>
              <input type="range" id="scale" min="70" max="130" value="85">
            </div>
            <div class="control-group">
              <label>垂直位置 <span id="position-value" class="value-display">8%</span></label>
              <input type="range" id="position" min="-30" max="30" value="8">
            </div>
            <div class="control-group">
              <label>旋轉 <span id="rotation-value" class="value-display">180°</span></label>
              <input type="range" id="rotation" min="0" max="180" value="180" step="180">
            </div>
            <div>
              <button id="print-btn">確認並列印</button>
              <button id="close-btn">取消</button>
            </div>
          </div>
          
          <div class="print-container">
            <img src="${fullCanvas.toDataURL(
              "image/png"
            )}" class="print-fortune" id="fortune-img">
          </div>
          
          <script>
            // 獲取控制元素和圖像
            const scaleInput = document.getElementById('scale');
            const positionInput = document.getElementById('position');
            const rotationInput = document.getElementById('rotation');
            const scaleValue = document.getElementById('scale-value');
            const positionValue = document.getElementById('position-value');
            const rotationValue = document.getElementById('rotation-value');
            const printBtn = document.getElementById('print-btn');
            const closeBtn = document.getElementById('close-btn');
            const img = document.getElementById('fortune-img');
            
            // 更新圖像樣式的函數
            function updateImageStyle() {
              const scale = scaleInput.value;
              const position = positionInput.value;
              const rotation = rotationInput.value;
              
              img.style.transform = \`rotate(\${rotation}deg) translateY(\${position}%)\`;
              img.style.maxHeight = \`\${scale}vh\`;
              
              scaleValue.textContent = \`\${scale}%\`;
              positionValue.textContent = \`\${position}%\`;
              rotationValue.textContent = \`\${rotation}°\`;
            }
            
            // 添加事件監聽器
            scaleInput.addEventListener('input', updateImageStyle);
            positionInput.addEventListener('input', updateImageStyle);
            rotationInput.addEventListener('input', updateImageStyle);
            
            // 列印按鈕
            printBtn.addEventListener('click', function() {
              document.getElementById('controls').style.display = 'none';
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  document.getElementById('controls').style.display = 'block';
                }, 500);
              }, 300);
            });
            
            // 關閉按鈕
            closeBtn.addEventListener('click', function() {
              window.close();
            });
            
            // 初始設定
            updateImageStyle();
          </script>
        </body>
      </html>
    `);

      printWindow.document.close();

      // 當開發者模式窗口關閉時，移除指示器
      printWindow.onunload = () => {
        if (document.body.contains(printingIndicator)) {
          document.body.removeChild(printingIndicator);
        }
      };

      // 超時處理
      setTimeout(() => {
        if (document.body.contains(printingIndicator)) {
          document.body.removeChild(printingIndicator);
        }
      }, 60000); // 開發者模式給1分鐘時間調整
    } catch (error) {
      console.error("列印籤詩時出錯:", error);
      alert("列印籤詩時發生錯誤，請稍後再試");
      // 移除可能存在的指示器
      const existingIndicator = document.querySelector("#printing-indicator");
      if (existingIndicator) {
        document.body.removeChild(existingIndicator);
      }
    }
  };

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
        const nameToUse = user_name?.trim()
          ? user_name
          : t("fortuneTelling.guestName", { defaultValue: "訪客" });

        console.log(`實例 ${instanceId} 發送獲取籤詩請求`, {
          user_name: nameToUse,
          fortune_category: category,
          fortune_number: localFortuneNumber,
          lang: lang, // 添加語言參數
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
            lang: lang, // 添加語言參數
          }),
        });

        // 檢查回應
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || t("fortuneTelling.fetchPoemError")
          );
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
        setError(translateError(error.message, lang));
        setFortunePoem(t("fortuneTelling.poemFetchFailed"));
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
    };
  }, [
    category,
    localFortuneNumber,
    user_name,
    useNameAnalysis,
    t,
    lang,
    instanceId,
  ]);

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
        throw new Error(t("fortuneTelling.missingParams"));
      }

      // 準備用戶名
      const nameToUse =
        useNameAnalysis && user_name?.trim()
          ? user_name
          : t("fortuneTelling.guestName", { defaultValue: "訪客" });

      // 構建請求體
      const requestBody = {
        user_name: nameToUse,
        fortune_category: category,
        fortune_number: localFortuneNumber,
        lang: lang, // 添加語言參數
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
        throw new Error(errorData.error || t("fortuneTelling.interpretError"));
      }

      // 解析結果
      const result = await response.json();
      console.log(`實例 ${instanceId} 解籤成功`, result);

      // 更新解釋結果
      setInterpretation(result);
    } catch (error) {
      console.error(`實例 ${instanceId} 解籤錯誤:`, error);
      setError(translateError(error.message, lang));
      alert(
        translateError(error.message, lang) ||
          t("fortuneTelling.interpretFailed")
      );
    } finally {
      // 完成解籤請求
      setIsInterpreting(false);
    }
  };

  // 重新抽籤處理
  const handleReset = () => {
    if (isInterpreting || isLoadingPoem || isPrinting) return;

    // 使用URL參數重新載入頁面
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("reset", Date.now());
    window.location.href = currentUrl.toString();
  };

  // 顯示錯誤資訊
  const ErrorMessage = () => {
    if (!error) return null;
    return (
      <div
        style={{
          color: "red",
          backgroundColor: "#fee",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        {t("common.error")}: {error}
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
        lang={lang} // 傳遞語言參數
      />
    );
  }

  // 確保籤號是兩位數的字串格式
  const formattedNumber = String(localFortuneNumber).padStart(2, "0");

  return (
    <Container>
      <ErrorMessage />

      {isLoadingPoem ? (
        <LoadingOverlay>
          {t("fortuneTelling.generatingPoem", "籤詩生成中...")}
        </LoadingOverlay>
      ) : (
        <>
          {useNameAnalysis && fortunePoem ? (
            // 使用新的TechFortunePoem組件替換FortuneTextContainer
            <TechFortunePoem
              ref={fortunePoemRef} // 新增ref
              userName={user_name || t("fortuneTelling.guestName", "訪客")}
              poemContent={fortunePoem}
            />
          ) : (
            // 當不使用姓名學分析時顯示圖片籤詩
            <FortuneImageContainer>
              <FortuneImage>
                <img
                  src={`/jenn-ai/${formattedNumber}.png`}
                  alt={t("fortuneTelling.fortuneImage", {
                    number: localFortuneNumber,
                  })}
                />
              </FortuneImage>
            </FortuneImageContainer>
          )}

          <ButtonContainer>
            {/* 新增列印籤詩按鈕，只在使用姓名學分析時顯示 */}
            {useNameAnalysis && fortunePoem && (
              <>
                <InterpretButton
                  onClick={handleQuickPrint} // 使用快速列印功能
                  disabled={isPrinting}
                >
                  {isPrinting
                    ? t("fortuneTelling.printing", "準備列印中...")
                    : t("fortuneTelling.printFortune", "列印籤詩")}
                </InterpretButton>

                {/* 新增開發者模式按鈕 */}
                <InterpretButton
                  onClick={handleDevModePrint}
                  disabled={isPrinting}
                  style={{
                    backgroundColor: "transparent",
                    color: "#009e93",
                    border: "1px solid #009e93",
                    fontSize: "14px", // 較小字體，表示次要功能
                  }}
                >
                  {t("fortuneTelling.printDevMode", "列印 (開發者模式)")}
                </InterpretButton>
              </>
            )}

            <InterpretButton
              onClick={handleInterpret}
              disabled={isInterpreting || isPrinting}
            >
              {isInterpreting
                ? t("fortuneTelling.interpreting")
                : t("fortuneTelling.startInterpreting")}
            </InterpretButton>

            <InterpretButton
              onClick={handleReset}
              disabled={isInterpreting || isPrinting}
              style={{
                backgroundColor: "transparent",
                color: MAIN_COLOR,
                border: `2px solid ${MAIN_COLOR}`,
              }}
            >
              {t("fortuneTelling.retryFortune")}
            </InterpretButton>
          </ButtonContainer>
        </>
      )}

      {isInterpreting && (
        <LoadingOverlay>{t("fortuneTelling.interpreting")}</LoadingOverlay>
      )}

      {isPrinting && (
        <LoadingOverlay>
          {t("fortuneTelling.printing", "準備列印中...")}
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default FortuneNumber;
