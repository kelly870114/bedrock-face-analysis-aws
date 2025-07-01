import React from "react";
import { useTranslation } from "../../i18n";
import {
  ResultDisplayArea,
  ResultCard,
  PlaceholderText,
} from "./styles-robot";

const ResultDisplay = ({ selectedStage, analysisStages, lang }) => {
  const { t } = useTranslation(lang);

  // 如果沒有選擇階段，顯示提示
  if (!selectedStage) {
    return (
      <ResultDisplayArea>
        <PlaceholderText>
          請點擊左側已完成的分析按鈕<br />
          查看詳細結果
        </PlaceholderText>
      </ResultDisplayArea>
    );
  }

  const stageData = analysisStages[selectedStage];

  // 如果選擇的階段還沒有結果
  if (!stageData || !stageData.result) {
    return (
      <ResultDisplayArea>
        <PlaceholderText>
          {t("common.loading")}
        </PlaceholderText>
      </ResultDisplayArea>
    );
  }

  // 獲取階段標題
  const getStageTitle = (stage) => {
    const titles = {
      faceShape: t("faceAnalysis.faceShapeAnalysis"),
      features: t("faceAnalysis.featureAnalysis"),
      overall: t("faceAnalysis.overallAnalysis")
    };
    return titles[stage] || stage;
  };

  // 渲染分析結果內容
  const renderStageContent = (result) => {
    // 處理 faceShape 結果
    if (selectedStage === 'faceShape' && result.content) {
      return (
        <ResultCard>
          <h3>{getStageTitle('faceShape')}</h3>
          {Object.entries(result.content).map(([key, value]) => (
            <div key={key} className="content-item">
              <div className="item-title">{key}</div>
              <div className="item-content">{value}</div>
            </div>
          ))}
        </ResultCard>
      );
    }

    // 處理 features 結果
    if (selectedStage === 'features' && result.content) {
      return (
        <ResultCard>
          <h3>{getStageTitle('features')}</h3>
          {Object.entries(result.content).map(([key, value]) => (
            <div key={key} className="content-item">
              <div className="item-title">{key}</div>
              <div className="item-content">{value}</div>
            </div>
          ))}
        </ResultCard>
      );
    }

    // 處理 overall 結果
    if (selectedStage === 'overall' && result.content) {
      return (
        <>
          <ResultCard>
            <h3>{getStageTitle('overall')}</h3>
            {Object.entries(result.content).map(([key, value]) => (
              <div key={key} className="content-item">
                <div className="item-title">{key}</div>
                <div className="item-content">{value}</div>
              </div>
            ))}
          </ResultCard>
          
          {/* 如果有 summary，單獨顯示 */}
          {analysisStages.overall.summary && (
            <ResultCard>
              <h3>{t("faceAnalysis.summary")}</h3>
              <div className="content-item">
                <div className="item-content">
                  {analysisStages.overall.summary}
                </div>
              </div>
            </ResultCard>
          )}
        </>
      );
    }

    // 如果結果格式不符預期，顯示原始數據
    return (
      <ResultCard>
        <h3>{getStageTitle(selectedStage)}</h3>
        <div className="content-item">
          <div className="item-content">
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontSize: '12px',
              color: '#9ffcea',
              fontFamily: 'inherit'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      </ResultCard>
    );
  };

  return (
    <ResultDisplayArea>
      {renderStageContent(stageData.result)}
    </ResultDisplayArea>
  );
};

export default ResultDisplay;