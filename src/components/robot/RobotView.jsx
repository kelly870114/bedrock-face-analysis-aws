import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera as CameraIcon } from "lucide-react";
import { config } from "../../config";
import { useTranslation } from "../../i18n";
import Camera from "../common/Camera/Camera";
import AnalysisPage from "./AnalysisPage";
import {
  RobotContainer,
  RobotContent,
  HomeView,
  TitleContainer,
  LogoContainer,
  StartButton,
  LoadingOverlay,
  ErrorMessage,
} from "./styles-robot";

const RobotView = ({ lang }) => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(lang);
  
  // 視圖狀態管理
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'camera' | 'analysis'
  const [capturedImage, setCapturedImage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [error, setError] = useState(null);
  
  // 分析階段狀態管理
  const [analysisStages, setAnalysisStages] = useState({
    faceShape: { status: 'pending', result: null },
    features: { status: 'pending', result: null }, 
    overall: { status: 'pending', result: null }
  });
  
  const [selectedStage, setSelectedStage] = useState(null);
  
  // IoT WebSocket 連接
  const wsRef = useRef(null);
  
  // 獲取事件ID
  const eventId = searchParams.get("event");

  // 檢查事件存取權限
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

  // WebSocket 連接設置
  const connectWebSocket = (session_id) => {
    const wsUrl = `wss://tppx6nu3cg.execute-api.us-east-1.amazonaws.com/prod?session_id=${session_id}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected for session:", session_id);
    };

    ws.onmessage = (event) => {
      console.log("Raw WebSocket message:", event.data);
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);

      // 更新分析階段狀態
      if (data.stage && data.status) {
        setAnalysisStages(prev => ({
          ...prev,
          [data.stage]: {
            status: data.status,
            result: data.result || prev[data.stage].result
          }
        }));
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError(t("common.error"));
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;
    return ws;
  };

  // 清理 WebSocket 連接
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // 開始拍照處理
  const handleStartCapture = () => {
    setCurrentView('camera');
  };

  // 拍照完成處理
  const handleCapture = async (blob) => {
    try {
      setCurrentView('analysis');
      setError(null);

      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // 轉換為 base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result.split(",")[1];
          resolve(base64data);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);

      const base64data = await base64Promise;

      // 發送到後端進行分析
      const response = await fetch(`${config.apiEndpoint}/initializeAnalysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64data,
          event_id: eventId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Analysis initialized:", data);

      setSessionId(data.session_id);
      
      // 連接 WebSocket 接收分析結果
      connectWebSocket(data.session_id);
      
      // 設置第一階段為處理中
      setAnalysisStages(prev => ({
        ...prev,
        faceShape: { status: 'processing', result: null }
      }));

    } catch (error) {
      console.error("Error:", error);
      setError(error.message || t("common.error"));
    }
  };

  // 取消拍照
  const handleCameraClose = () => {
    setCurrentView('home');
  };

  // 重新開始
  const handleRestart = () => {
    // 清理資源
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    // 重置所有狀態
    setCurrentView('home');
    setCapturedImage(null);
    setSessionId(null);
    setAnalysisStages({
      faceShape: { status: 'pending', result: null },
      features: { status: 'pending', result: null }, 
      overall: { status: 'pending', result: null }
    });
    setSelectedStage(null);
    setError(null);
  };

  // 載入中顯示
  if (isLoading) {
    return (
      <RobotContainer>
        <LoadingOverlay>{t("common.loading")}</LoadingOverlay>
      </RobotContainer>
    );
  }

  // 錯誤顯示
  if (error) {
    return (
      <RobotContainer>
        <RobotContent>
          <ErrorMessage>
            <h2>{eventInfo?.name || t("faceAnalysis.title")}</h2>
            <p>{error}</p>
          </ErrorMessage>
        </RobotContent>
      </RobotContainer>
    );
  }

  return (
    <RobotContainer>
      {/* 首頁視圖 */}
      {currentView === 'home' && (
        <HomeView>
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

          <StartButton onClick={handleStartCapture}>
            <CameraIcon size={24} />
            {t("faceAnalysis.startAnalysis")}
          </StartButton>
        </HomeView>
      )}

      {/* 拍照視圖 */}
      {currentView === 'camera' && (
        <Camera
          onCapture={handleCapture}
          onClose={handleCameraClose}
        />
      )}

      {/* 分析視圖 */}
      {currentView === 'analysis' && (
        <AnalysisPage
          capturedImage={capturedImage}
          analysisStages={analysisStages}
          selectedStage={selectedStage}
          onStageSelect={setSelectedStage}
          onRestart={handleRestart}
          lang={lang}
        />
      )}
    </RobotContainer>
  );
};

export default RobotView;