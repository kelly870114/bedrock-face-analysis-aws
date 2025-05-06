import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { SUPPORTED_LANGUAGES, getCurrentLanguage } from '../../i18n/config';

const MAIN_COLOR = '#009e93';

const SwitcherContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const LanguageButton = styled.button`
  background-color: ${props => props.active ? MAIN_COLOR : 'transparent'};
  color: ${props => props.active ? 'white' : MAIN_COLOR};
  border: 1px solid ${MAIN_COLOR};
  border-radius: 8px;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Noto Serif TC', serif;
  
  &:hover {
    background-color: ${props => props.active ? MAIN_COLOR : '#f3f4f6'};
  }
`;

const LanguageSwitcher = ({ queryParams }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 獲取當前語言
  const currentLang = getCurrentLanguage(location.pathname);
  
  // 切換語言
  const handleLanguageChange = (newLang) => {
    if (newLang === currentLang) return;
    
    // 將路徑切換為新語言路徑
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // 如果當前 URL 的第一段是語言代碼，替換它
    if (Object.keys(SUPPORTED_LANGUAGES).includes(pathSegments[0])) {
      pathSegments[0] = newLang;
    } else {
      // 否則，在路徑前加上新語言代碼
      pathSegments.unshift(newLang);
    }
    
    // 獲取當前 URL 的查詢參數
    let searchParams = new URLSearchParams(location.search);
    
    // 如果提供了額外的查詢參數，將它們合併
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) searchParams.set(key, value);
      });
    }
    
    // 構建新的 URL，包含查詢參數
    const newPath = `/${pathSegments.join('/')}`;
    const queryString = searchParams.toString();
    const newUrl = queryString ? `${newPath}?${queryString}` : newPath;
    
    navigate(newUrl);
  };
  
  return (
    <SwitcherContainer>
      {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
        <LanguageButton
          key={code}
          active={currentLang === code}
          onClick={() => handleLanguageChange(code)}
        >
          {name}
        </LanguageButton>
      ))}
    </SwitcherContainer>
  );
};

export default LanguageSwitcher;