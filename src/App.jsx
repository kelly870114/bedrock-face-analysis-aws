import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DesktopView from './components/common/DesktopView/DesktopView';
import MobileView from './components/face/MobileView';
import FortuneMobileView from './components/fortune/FortuneMobileView';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './i18n/config';

// 創建語言配置文件
// src/i18n/config.js
// export const SUPPORTED_LANGUAGES = ["zh", "en"];
// export const DEFAULT_LANGUAGE = "zh";

const App = () => {
  // 獲取支援的語言路徑
  const languagePaths = Object.keys(SUPPORTED_LANGUAGES);
  
  return (
    <Router>
      <Routes>
        {/* 默認重定向到預設語言路徑 */}
        <Route path="/" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} />} />
        
        {/* 為每種支援的語言創建路由 */}
        {languagePaths.map((lang) => (
          <React.Fragment key={lang}>
            {/* 主入口 */}
            <Route path={`/${lang}`} element={<DesktopView lang={lang} />} />
            
            {/* 面相大師手機介面 */}
            <Route path={`/${lang}/face/mobile`} element={<MobileView lang={lang} />} />
            
            {/* 解籤大師手機介面 */}
            <Route path={`/${lang}/fortune/mobile`} element={<FortuneMobileView lang={lang} />} />
          </React.Fragment>
        ))}
        
        {/* 捕捉無效路徑，重定向到預設語言 */}
        <Route path="*" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} />} />
      </Routes>
    </Router>
  );
};

export default App;