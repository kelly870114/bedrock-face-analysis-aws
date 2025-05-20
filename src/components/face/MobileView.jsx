import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera as CameraIcon } from "lucide-react";
import { config } from "../../config";
import { useTranslation } from "../../i18n";
import LanguageSwitcher from "../common/LanguageSwitcher";
import Camera from "../common/Camera/Camera";
import AnalysisResult from "./AnalysisResult";
import {
  PageWrapper,
  ChineseContainer,
  BorderContainer,
  Corner,
  TitleContainer,
  LogoContainer,
  Container,
  Content,
  MessageBox,
  ContentWrapper,
  CameraButton,
  ImageContainer,
  ImageOverlay,
} from "./styles-mobile";

const MobileView = () => {
  const [searchParams] = useSearchParams();
  const { t, language } = useTranslation();
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const wsRef = useRef(null);

  // 獲取事件ID
  const eventId = searchParams.get("event");

  // WebSocket connection function
  const connectWebSocket = (analysis_id) => {
    const wsUrl = `wss://tppx6nu3cg.execute-api.us-east-1.amazonaws.com/prod?analysis_id=${analysis_id}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log("Raw WebSocket message:", event.data);
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);

      if (data.status === "completed") {
        setAnalysisResult(data.result);
        setIsAnalyzing(false);
      } else if (data.status === "failed") {
        setError(data.error);
        setIsAnalyzing(false);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError(t("common.error"));
      setIsAnalyzing(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;
    return ws;
  };

  // check if event id exists
  useEffect(() => {
    const checkEventAccess = async () => {
      try {
        if (!eventId) {
          setError(t("desktop.invalidEventCode"));
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${config.apiEndpoint}/checkEvent?event=${eventId}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!data.isAccessible) {
          setError(data.message || t("desktop.eventNotAvailable"));
          setEventInfo({
            name: data.eventName,
            message: data.message,
          });
          setIsLoading(false);
          return;
        }

        setEventInfo({
          name: data.eventName,
          message: data.message,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(t("desktop.systemError"));
        setIsLoading(false);
      }
    };

    checkEventAccess();
  }, [eventId, t]);

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleCapture = async (blob) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setShowCamera(false);

      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // 轉換為 base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          // 取得 base64 字串部分（去掉 data:image/jpeg;base64, 前綴）
          const base64data = reader.result.split(",")[1];
          resolve(base64data);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);

      const base64data = await base64Promise;

      // 發送到後端
      const response = await fetch(`${config.apiEndpoint}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      setAnalysisId(data.analysis_id);
      connectWebSocket(data.analysis_id);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || t("common.error"));
      setIsAnalyzing(false);
    }
  };

  // handle retake photo
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
    setAnalysisId(null);
    setShowCamera(true);
  };

  // loading
  if (isLoading) {
    return (
      <Container>
        <Content>
          <MessageBox>
            <h2>{t("common.loading")}</h2>
          </MessageBox>
        </Content>
      </Container>
    );
  }

  // Error (including event not opened)
  if (error) {
    return (
      <Container>
        <Content>
          <MessageBox>
            <h2>{eventInfo?.name || t("faceAnalysis.title")}</h2>
            <p>{error}</p>
          </MessageBox>
        </Content>
      </Container>
    );
  }

  return (
    <PageWrapper>
      <ChineseContainer isAnalyzing={isAnalyzing || analysisResult}>
        <BorderContainer />
        <Corner className="top-left" />
        <Corner className="top-right" />
        <Corner className="bottom-left" />
        <Corner className="bottom-right" />

        <ContentWrapper>
          {/* 語言切換器 - 確保傳遞 eventId 參數 */}
          <LanguageSwitcher
            currentPath="/face/mobile"
            queryParams={{ event: eventId }}
          />
          {!isAnalyzing && !analysisResult && (
            <>
              <TitleContainer>
                <img
                  src="/app_title_face_aws.png"
                  alt={t("faceAnalysis.title")}
                />
              </TitleContainer>

              <LogoContainer>
                <img
                  src="/mobile_logo_face_aws.png"
                  alt={t("faceAnalysis.title")}
                />
              </LogoContainer>

              <CameraButton
                onClick={() => setShowCamera(true)}
                disabled={isAnalyzing}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <CameraIcon
                  size={24}
                  color={isButtonHovered ? "#009e93" : "white"}
                />
                開始分析
              </CameraButton>
            </>
          )}

          {showCamera && (
            <Camera
              onCapture={handleCapture}
              onClose={() => setShowCamera(false)}
            />
          )}

          {isAnalyzing && (
            <ImageContainer>
              <div className="image-wrapper">
                <img src={capturedImage} alt={t("faceAnalysis.title")} />
                <ImageOverlay>{t("faceAnalysis.analyzing")}</ImageOverlay>
              </div>
            </ImageContainer>
          )}

          {analysisResult && (
            <AnalysisResult
              result={analysisResult}
              imageUrl={capturedImage}
              onRetake={handleRetake}
            />
          )}
        </ContentWrapper>
      </ChineseContainer>
    </PageWrapper>
  );
};

export default MobileView;
