import React from "react";
import { AnalysisButton } from "./styles-robot";

const AnalysisStageButton = ({ 
  status, 
  onClick, 
  disabled, 
  children 
}) => {
  return (
    <AnalysisButton
      status={status}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </AnalysisButton>
  );
};

export default AnalysisStageButton;