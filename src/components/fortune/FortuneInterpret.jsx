import React, { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon } from "lucide-react";
import html2canvas from 'html2canvas';
import { X } from "lucide-react";
import { config } from '../../config';
import Camera from '../common/Camera/Camera';
import AnalysisResult from '../face/AnalysisResult';
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
} from './styles-fortune-interpret';

// QR Code Modal Component
const QRCodeModal = ({ url, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={() => onClose()}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>
          <X size={20} />
        </ModalCloseButton>
        <ModalTitle>掃描 QR Code 下載分析結果</ModalTitle>
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
        <ModalText>請在 10 分鐘內完成下載</ModalText>
      </ModalContent>
    </ModalOverlay>
  );
};

const FortuneInterpret = ({ 
  name, 
  category, 
  fortuneNumber,
  interpretation
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const wsRef = useRef(null);
  const resultRef = useRef(null);

  const categoryText = {
    love: '愛情',
    career: '事業',
    wealth: '財運',
    study: '學業',
    family: '家庭',
    travel: '旅遊'
  }[category];

  // WebSocket connection setup
  const connectWebSocket = (analysisId) => {
    const wsUrl = `wss://tppx6nu3cg.execute-api.us-east-1.amazonaws.com/prod?analysis_id=${analysisId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'completed') {
        setAnalysisResult(data.result);
        setIsAnalyzing(false);
      } else if (data.status === 'failed') {
        setIsAnalyzing(false);
        alert(data.error || '分析失敗');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsAnalyzing(false);
      alert('連線錯誤，請重試');
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
  
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
  
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
  
      const base64data = await base64Promise;
  
      const response = await fetch(`${config.apiEndpoint}/fortuneAndFace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64data,
          fortune_analysis_id: interpretation.fortune_analysis_id
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || 
          `API 請求失敗 (${response.status}: ${response.statusText})`
        );
      }
  
      const data = await response.json();
      
      if (!data.analysis_id) {
        throw new Error('回應中缺少 analysis_id');
      }
  
      connectWebSocket(data.analysis_id);
  
    } catch (error) {
      console.error('Error details:', error);
      alert(`分析失敗: ${error.message}`);
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsUploading(true);

      const element = resultRef.current;
      const originalWidth = element.offsetWidth;
      const originalHeight = element.offsetHeight;
      
      const container = document.createElement('div');
      container.style.width = `${originalWidth}px`;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      
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
          const clonedElement = clonedDoc.body.querySelector('[class*="ResultContainer"]');
          if (clonedElement) {
            clonedElement.style.width = `${originalWidth}px`;
            clonedElement.style.height = `${originalHeight}px`;
          }
        }
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
        throw new Error("無法獲取上傳網址");
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
        throw new Error("圖片上傳失敗");
      }

      const downloadUrl = `${config.apiEndpoint}/uploadImage?filename=${filename}`;
      setDownloadUrl(downloadUrl);
      setShowQRCode(true);
    } catch (error) {
      console.error("處理失敗:", error);
      alert("圖片處理失敗，請稍後再試");
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
    setShowCamera(true);
  };

  if (analysisResult) {
    return (
      <AnalysisResult
        result={analysisResult}
        imageUrl={capturedImage}
        onRetake={handleRetake}
        isFromFortune={true}
      />
    );
  }

  const getIconForBlock = (blockIndex) => {
    return `/fortune_${blockIndex}.png`;
  };

  return (
    <Container>
      <ImageContainer>
        {capturedImage ? (
          <div className="image-wrapper">
            <img src={capturedImage} alt="captured" />
            {isAnalyzing && (
              <div className="analysis-overlay">
                分析中...
              </div>
            )}
          </div>
        ) : (
          <img 
            src={`/jenn-ai/${String(fortuneNumber).padStart(2, '0')}.png`} 
            alt={`第${fortuneNumber}籤`}
          />
        )}
      </ImageContainer>

      <ResultContainer ref={resultRef}>
        <AnalysisBlock>
          <IconImage src={getIconForBlock(1)} />
          <BlockTitle>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            <span className="title-text">{name} 的{categoryText}解籤</span>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
          </BlockTitle>
          <ContentItem>
            <ItemContent>{interpretation?.analysis || ''}</ItemContent>
          </ContentItem>
        </AnalysisBlock>

        <AnalysisBlock>
          <IconImage src={getIconForBlock(2)} />
          <BlockTitle>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            <span className="title-text">建議</span>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
          </BlockTitle>
          <ContentItem>
            <ItemContent>{interpretation?.advice || ''}</ItemContent>
          </ContentItem>
        </AnalysisBlock>

        <AnalysisBlock>
          <IconImage src={getIconForBlock(3)} />
          <BlockTitle>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            <span className="title-text">AWS 小提醒</span>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
          </BlockTitle>
          <ContentItem>
            <ItemContent>{interpretation?.aws_reminder || ''}</ItemContent>
          </ContentItem>
        </AnalysisBlock>
      </ResultContainer>
      
      <ButtonContainer>
        <ActionButton 
          onClick={handleDownload} 
          disabled={isUploading}
        >
          {isUploading ? "處理中..." : "下載解籤結果"}
        </ActionButton>

        <ActionButton 
          onClick={() => setShowCamera(true)}
          disabled={isAnalyzing}
        >
          <CameraIcon size={24} />
          結合面相獲取建議
        </ActionButton>

        <ActionButton 
          onClick={() => window.location.reload()}
          style={{ 
            backgroundColor: 'transparent', 
            color: '#C84B31', 
            border: '2px solid #C84B31' 
          }}
        >
          重新抽籤
        </ActionButton>
      </ButtonContainer>

      {showCamera && (
        <Camera
          onCapture={handleCombineAnalysis}
          onClose={() => setShowCamera(false)}
        />
      )}

      <QRCodeModal
        url={downloadUrl}
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
      />
    </Container>
  );
};

export default FortuneInterpret;