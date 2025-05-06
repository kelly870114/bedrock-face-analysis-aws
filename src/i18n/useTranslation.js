import { useLocation } from 'react-router-dom';
import { getCurrentLanguage } from './config';
import zh from './translations/zh';
import en from './translations/en';

// 所有語言的翻譯
const translations = {
  zh,
  en
};

/**
 * 翻譯 Hook，用於獲取當前語言的翻譯
 * @param {string} lang - 可選的語言代碼，如果未提供則從 URL 路徑獲取
 * @returns {object} - 包含 t 函數和當前語言代碼
 */
export const useTranslation = (lang) => {
  const { pathname } = useLocation();
  const currentLang = lang || getCurrentLanguage(pathname);
  
  /**
   * 翻譯函數，用於獲取特定鍵的翻譯
   * @param {string} key - 點分隔的鍵，如 'common.loading'
   * @returns {string} - 翻譯後的文本
   */
  const t = (key) => {
    const keys = key.split('.');
    let result = translations[currentLang];
    
    // 迭代訪問巢狀物件
    for (const k of keys) {
      if (result && Object.prototype.hasOwnProperty.call(result, k)) {
        result = result[k];
      } else {
        // 如果找不到翻譯，返回鍵名
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return result;
  };
  
  return { t, language: currentLang };
};