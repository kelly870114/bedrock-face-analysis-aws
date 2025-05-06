import React, { useState, useRef, useEffect } from "react";
import { Camera as CameraIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { X } from "lucide-react";
import { config } from "../../config";
import Camera from "../common/Camera/Camera";
import AnalysisResult from "../face/AnalysisResult";
import { useTranslation, translateError } from "../../i18n";
import {
  Container,
  ImageContainer,
  ResultContainer,
  AnalysisBlock,
  BlockTitle,
  ContentItem,
  ItemContent,
  IconImage,
  ActionButton,
  ButtonContainer,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalCloseButton,
  QRCodeContainer,
  ModalText,
  LoadingOverlay
} from "./styles-fortune-interpret";

// QR Code Modal Component
const QRCodeModal = ({ url, isOpen, onClose, lang }) => {
  const { t } = useTranslation(lang);
  
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={() => onClose()}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>
          <X size={20} />
        </ModalCloseButton>
        <ModalTitle>{t("fortuneTelling.scanToDownload")}</ModalTitle>
        <QRCodeContainer>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            dangerouslySetInnerHTML={{
              __html: `
                <rect width="100" height="100" fill="white"/>
                <image href="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  url
                )}" width="100" height="100" />
              `,
            }}
          />
        </QRCodeContainer>
        <ModalText>{t("fortuneTelling.downloadExpiration")}</ModalText>
      </ModalContent>
    </ModalOverlay>
  );
};

const FortuneInterpret = ({
  name,
  category,
  fortuneNumber,
  interpretation,
  useNameAnalysis = true,
  fortune_analysis_id = null,
  lang // 新增語言參數
}) => {
  const { t } = useTranslation(lang); // 使用翻譯 Hook
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const resultRef = useRef(null);

  // 確保解釋內容已載入
  const [isContentReady, setIsContentReady] = useState(false);
  
  useEffect(() => {
    // 檢查解釋內容是否已載入
    if (interpretation && interpretation.analysis) {
      setIsContentReady(true);
    }
  }, [interpretation]);

  const categoryText = {
    love: t("fortuneTelling.category.love"),
    career: t("fortuneTelling.category.career"),
    wealth: t("fortuneTelling.category.wealth"),
    study: t("fortuneTelling.category.study"),
    family: t("fortuneTelling.category.family"),
    travel: t("fortuneTelling.category.travel"),
  };

  // WebSocket connection setup
  const connectWebSocket = (analysisId) => {
    const wsUrl = `wss://tppx6nu3cg.execute-api.us-east-1.amazonaws.com/prod?analysis_id=${analysisId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "completed") {
        setAnalysisResult(data.result);
        setIsAnalyzing(false);
      } else if (data.status === "failed") {
        setIsAnalyzing(false);
        setError(translateError(data.error, lang) || t("fortuneTelling.analysisFailed"));
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsAnalyzing(false);
      setError(t("common.connectionError"));
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleCombineAnalysis = async (blob) => {
    try {
      setShowCamera(false);
      setIsAnalyzing(true);
      setError(null);

      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64data = await base64Promise;

      // 構建請求體
      const requestBody = {
        image: base64data,
        fortune_analysis_id: interpretation.fortune_analysis_id || fortune_analysis_id,
        lang: lang // 添加語言參數
      };

      // 添加姓名學分析參數
      if (!useNameAnalysis) {
        requestBody.use_name_analysis = false;
      }

      const response = await fetch(`${config.apiEndpoint}/fortuneAndFace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error ||
            t("fortuneTelling.requestFailed", { status: response.status, statusText: response.statusText })
        );
      }

      const data = await response.json();

      if (!data.analysis_id) {
        throw new Error(t("fortuneTelling.missingAnalysisId"));
      }

      connectWebSocket(data.analysis_id);
    } catch (error) {
      console.error("Error details:", error);
      setError(translateError(error.message, lang) || t("fortuneTelling.analysisFailed"));
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsUploading(true);
      setError(null);

      const element = resultRef.current;
      const originalWidth = element.offsetWidth;
      const originalHeight = element.offsetHeight;

      const container = document.createElement("div");
      container.style.width = `${originalWidth}px`;
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";

      const clone = element.cloneNode(true);
      container.appendChild(clone);
      document.body.appendChild(container);

      const canvas = await html2canvas(clone, {
        backgroundColor: "#FDF6E9",
        scale: 2,
        useCORS: true,
        logging: false,
        width: originalWidth,
        height: originalHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector(
            '[class*="ResultContainer"]'
          );
          if (clonedElement) {
            clonedElement.style.width = `${originalWidth}px`;
            clonedElement.style.height = `${originalHeight}px`;
          }
        },
      });

      document.body.removeChild(container);

      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      const filename = `fortune-analysis-${timestamp}-${random}.png`;

      const urlResponse = await fetch(`${config.apiEndpoint}/uploadImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: filename,
        }),
      });

      if (!urlResponse.ok) {
        throw new Error(t("fortuneTelling.cannotGetUploadUrl"));
      }

      const { uploadUrl } = await urlResponse.json();

      const base64Data = canvas.toDataURL("image/png").split(",")[1];
      const binaryData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: uint8Array,
        headers: {
          "Content-Type": "image/png",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(t("fortuneTelling.imageUploadFailed"));
      }

      const downloadUrl = `${config.apiEndpoint}/uploadImage?filename=${filename}`;
      setDownloadUrl(downloadUrl);
      setShowQRCode(true);
    } catch (error) {
      console.error("處理失敗:", error);
      setError(translateError(error.message, lang) || t("fortuneTelling.processingFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setShowCamera(true);
  };

  const handleRestart = () => {
    setIsReloading(true);
    // 使用參數重新導向，防止快取問題
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('reset', Date.now());
    window.location.href = currentUrl.toString();
  };

  if (analysisResult) {
    return (
      <AnalysisResult
        result={analysisResult}
        imageUrl={capturedImage}
        onRetake={handleRetake}
        isFromFortune={true}
        lang={lang} // 傳遞語言參數
      />
    );
  }

  if (!isContentReady) {
    return <LoadingOverlay>{t("fortuneTelling.loadingInterpretation")}</LoadingOverlay>;
  }

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
        {t("common.error")}: {error}
      </div>
    );
  };

  const getIconForBlock = (blockIndex) => {
    return `/fortune_${blockIndex}.png`;
  };

  return (
    <Container>
      <ErrorMessage />
      
      {!useNameAnalysis && (
        <ImageContainer>
          {capturedImage ? (
            <div className="image-wrapper">
              <img src={capturedImage} alt={t("fortuneTelling.capturedImage")} />
              {isAnalyzing && <div className="analysis-overlay">{t("fortuneTelling.analyzing")}</div>}
            </div>
          ) : (
            <img
              src={`/jenn-ai/${String(fortuneNumber).padStart(2, "0")}.png`}
              alt={t("fortuneTelling.fortuneImage", { number: fortuneNumber })}
            />
          )}
        </ImageContainer>
      )}

      <ResultContainer ref={resultRef}>
        <AnalysisBlock>
          <IconImage src={getIconForBlock(1)} />
          <BlockTitle>
            {/* 根據姓名學分析設定顯示不同的標題 */}
            <span className="title-text">
              {useNameAnalysis && name
                ? `${name}${t("fortuneTelling.fortuneInterpretation", { category: categoryText[category] })}`
                : `${categoryText[category]}${t("fortuneTelling.fortuneInterpretation", { category: "" })}`}
            </span>
          </BlockTitle>
          <ContentItem>
            <ItemContent>{interpretation?.analysis || ""}</ItemContent>
          </ContentItem>
        </AnalysisBlock>

        <AnalysisBlock>
          <IconImage src={getIconForBlock(2)} />
          <BlockTitle>
            <span className="title-text">{t("fortuneTelling.suggestion")}</span>
          </BlockTitle>
          <ContentItem>
            <ItemContent>{interpretation?.advice || ""}</ItemContent>
          </ContentItem>
        </AnalysisBlock>

        <AnalysisBlock>
          <IconImage src={getIconForBlock(3)} />
          <BlockTitle>
            <span className="title-text">{t("fortuneTelling.awsReminder")}</span>
          </BlockTitle>
          <ContentItem>
            <ItemContent>{interpretation?.aws_reminder || ""}</ItemContent>
          </ContentItem>
        </AnalysisBlock>
      </ResultContainer>

      <ButtonContainer>
        <ActionButton onClick={handleDownload} disabled={isUploading || isAnalyzing}>
          {isUploading ? t("common.processing") : t("fortuneTelling.downloadResult")}
        </ActionButton>

        <ActionButton
          onClick={() => setShowCamera(true)}
          disabled={isAnalyzing}
        >
          <CameraIcon size={24} />
          {t("fortuneTelling.combineWithFace")}
        </ActionButton>

        <ActionButton
          onClick={handleRestart}
          disabled={isReloading || isUploading || isAnalyzing}
          style={{
            backgroundColor: "transparent",
            color: "#9ffcea",
            border: "2px solid #009e93",
          }}
        >
          {isReloading ? t("common.redirecting") : t("fortuneTelling.retryFortune")}
        </ActionButton>
      </ButtonContainer>

      {showCamera && (
        <Camera
          onCapture={handleCombineAnalysis}
          onClose={() => setShowCamera(false)}
        />
      )}

      {isAnalyzing && <LoadingOverlay>{t("fortuneTelling.analyzing")}</LoadingOverlay>}
      {isReloading && <LoadingOverlay>{t("common.redirecting")}</LoadingOverlay>}

      <QRCodeModal
        url={downloadUrl}
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        lang={lang}
      />
    </Container>
  );
};

export default FortuneInterpret;