import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { X } from "lucide-react";
import { config } from "../../config";
import {
  Container,
  ImageContainer,
  RetakeButton,
  AnalysisBlock,
  BlockTitle,
  ContentItem,
  ItemTitle,
  ItemContent,
  Summary,
  IconImage,
  DownloadButton,
  ResultContainer,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalCloseButton,
  QRCodeContainer,
  ModalText,
} from "./styles-result";

// QR Code Modal 組件
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

const AnalysisResult = ({
  result,
  imageUrl,
  onRetake,
  isFromFortune = false,
}) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const resultRef = useRef(null);
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('event');

  const getIconForBlock = (blockIndex) => {
    return `/face_${blockIndex}_white.png`;
  };

  const handleDownload = async () => {
    try {
      setIsUploading(true);

      // 取得目標元素
      const element = resultRef.current;
      
      // 獲取元素的實際尺寸
      const originalWidth = element.offsetWidth;
      const originalHeight = element.offsetHeight;
      
      // 創建一個新的容器來保持原始佈局
      const container = document.createElement('div');
      container.style.width = `${originalWidth}px`;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      
      // 克隆目標元素到新容器
      const clone = element.cloneNode(true);
      container.appendChild(clone);
      document.body.appendChild(container);

      // 設置 html2canvas 選項
      const canvas = await html2canvas(clone, {
        backgroundColor: "#FDF6E9",
        scale: 2, // 提高輸出質量
        useCORS: true,
        logging: false,
        width: originalWidth,
        height: originalHeight,
        onclone: (clonedDoc) => {
          // 確保克隆的元素有正確的樣式
          const clonedElement = clonedDoc.body.querySelector('[class*="ResultContainer"]');
          if (clonedElement) {
            clonedElement.style.width = `${originalWidth}px`;
            clonedElement.style.height = `${originalHeight}px`;
          }
        }
      });

      // 清理臨時元素
      document.body.removeChild(container);

      // 生成檔名
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      const filename = `analysis-${timestamp}-${random}.png`;

      // 獲取上傳 URL
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

      // 轉換 canvas 為二進制數據
      const base64Data = canvas.toDataURL("image/png").split(",")[1];
      const binaryData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      // 上傳圖片
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

      // 設置下載 URL 並顯示 QR code
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

  return (
    <Container>
      {imageUrl && (
        <ImageContainer>
          <img src={imageUrl} alt="captured" />
        </ImageContainer>
      )}
      <ResultContainer ref={resultRef}>
        {result.faceShape && (
          <AnalysisBlock>
            <IconImage src={getIconForBlock(1)} />
            <BlockTitle>
              <span className="title-text">{result.faceShape.title}</span>
            </BlockTitle>
            {Object.entries(result.faceShape.content).map(([key, value]) => (
              <ContentItem key={key}>
                <ItemTitle>{key}</ItemTitle>
                <ItemContent>{value}</ItemContent>
              </ContentItem>
            ))}
          </AnalysisBlock>
        )}

        {result.features && (
          <AnalysisBlock>
            <IconImage src={getIconForBlock(2)} />
            <BlockTitle>
              <span className="title-text">{result.features.title}</span>
            </BlockTitle>
            {Object.entries(result.features.content).map(([key, value]) => (
              <ContentItem key={key}>
                <ItemTitle>{key}</ItemTitle>
                <ItemContent>{value}</ItemContent>
              </ContentItem>
            ))}
          </AnalysisBlock>
        )}

        {result.overall && (
          <AnalysisBlock>
            <IconImage src={getIconForBlock(3)} />
            <BlockTitle>
              <span className="title-text">{result.overall.title}</span>
            </BlockTitle>
            {Object.entries(result.overall.content).map(([key, value]) => (
              <ContentItem key={key}>
                <ItemTitle>{key}</ItemTitle>
                <ItemContent>{value}</ItemContent>
              </ContentItem>
            ))}
          </AnalysisBlock>
        )}

        {result.summary && (
          <Summary>
            <BlockTitle>
              <span className="title-text">整體評析</span>
            </BlockTitle>
            <p>{result.summary}</p>
          </Summary>
        )}
      </ResultContainer>

      <DownloadButton onClick={handleDownload} disabled={isUploading}>
        {isUploading ? "處理中..." : "下載分析結果"}
      </DownloadButton>
      {isFromFortune ? (
        <RetakeButton
          onClick={() => (window.location.href = `/fortune/mobile?event=${eventId}`)}
        >
          重新抽籤
        </RetakeButton>
      ) : (
        <RetakeButton onClick={onRetake}>重新拍照</RetakeButton>
      )}

      <QRCodeModal
        url={downloadUrl}
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
      />
    </Container>
  );
};

export default AnalysisResult;