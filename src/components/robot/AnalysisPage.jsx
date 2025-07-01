import React from "react";
import { useTranslation } from "../../i18n";
import AnalysisStageButton from "./AnalysisStageButton";
import ResultDisplay from "./ResultDisplay";
import {
  AnalysisContainer,
  LeftPanel,
  RightPanel,
  ImageContainer,
  ButtonsContainer,
  ActionButton,
} from "./styles-robot";

const AnalysisPage = ({
  capturedImage,
  analysisStages,
  selectedStage,
  onStageSelect,
  onRestart,
  lang
}) => {
  const { t } = useTranslation(lang);

  // 獲取按鈕顯示文字
  const getButtonText = (stage, status) => {
    const stageNames = {
      faceShape: t("faceAnalysis.analysisStages.faceShape.title"),
      features: t("faceAnalysis.analysisStages.features.title"),
      overall: t("faceAnalysis.analysisStages.overall.title")
    };

    const baseName = stageNames[stage] || stage;

    switch (status) {
      case 'pending':
        return baseName;
      case 'processing':
        return `${baseName}中...`;
      case 'completed':
        return baseName;
      case 'failed':
        return `${baseName} (失敗)`;
      default:
        return baseName;
    }
  };

  // 處理分析按鈕點擊
  const handleStageButtonClick = (stage) => {
    const stageData = analysisStages[stage];
    
    // 只有完成狀態才能點擊查看結果
    if (stageData.status === 'completed' && stageData.result) {
      onStageSelect(selectedStage === stage ? null : stage);
    }
  };

  // 獲取按鈕狀態（添加選中狀態）
  const getButtonStatus = (stage) => {
    const stageData = analysisStages[stage];
    if (selectedStage === stage && stageData.status === 'completed') {
      return 'selected';
    }
    return stageData.status;
  };

  return (
    <AnalysisContainer>
      {/* 左側面板 */}
      <LeftPanel>
        {/* 照片顯示區 */}
        <ImageContainer>
          {capturedImage ? (
            <img src={capturedImage} alt={t("faceAnalysis.title")} />
          ) : (
            <div style={{ color: '#9ca3af', textAlign: 'center' }}>
              {t("common.loading")}
            </div>
          )}
        </ImageContainer>

        {/* 按鈕區域 */}
        <ButtonsContainer>
          {/* 分析階段按鈕 */}
          <AnalysisStageButton
            status={getButtonStatus('faceShape')}
            onClick={() => handleStageButtonClick('faceShape')}
            disabled={analysisStages.faceShape.status === 'pending' || 
                     analysisStages.faceShape.status === 'processing'}
          >
            {getButtonText('faceShape', analysisStages.faceShape.status)}
          </AnalysisStageButton>

          <AnalysisStageButton
            status={getButtonStatus('features')}
            onClick={() => handleStageButtonClick('features')}
            disabled={analysisStages.features.status === 'pending' || 
                     analysisStages.features.status === 'processing'}
          >
            {getButtonText('features', analysisStages.features.status)}
          </AnalysisStageButton>

          <AnalysisStageButton
            status={getButtonStatus('overall')}
            onClick={() => handleStageButtonClick('overall')}
            disabled={analysisStages.overall.status === 'pending' || 
                     analysisStages.overall.status === 'processing'}
          >
            {getButtonText('overall', analysisStages.overall.status)}
          </AnalysisStageButton>

          {/* 重新拍照按鈕 */}
          <ActionButton onClick={onRestart}>
            {t("faceAnalysis.retakePhoto")}
          </ActionButton>
        </ButtonsContainer>
      </LeftPanel>

      {/* 右側面板 - 結果顯示區 */}
      <RightPanel>
        <ResultDisplay
          selectedStage={selectedStage}
          analysisStages={analysisStages}
          lang={lang}
        />
      </RightPanel>
    </AnalysisContainer>
  );
};

export default AnalysisPage;