// 導入所有模組
import zh from './translations/zh';
import en from './translations/en';
import { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  getCurrentLanguage 
} from './config';

// 再導出配置
export { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  getCurrentLanguage 
};

// 導出翻譯 Hook
export { useTranslation } from './useTranslation';

// 導出錯誤訊息翻譯
export { translateError } from './errorMessages';

// 導出翻譯資源
export const translations = {
  zh,
  en
};

/**
 * 格式化翻譯字串，替換參數
 * @param {string} text - 包含參數佔位符的文字，如 "Hello, {name}!"
 * @param {Object} params - 參數對象，如 { name: "World" }
 * @returns {string} - 格式化後的文字，如 "Hello, World!"
 */
export const formatTranslation = (text, params) => {
  if (!params) return text;
  
  return Object.keys(params).reduce((result, key) => {
    return result.replace(new RegExp(`{${key}}`, 'g'), params[key]);
  }, text);
};

/**
 * 獲取特定語言的特定翻譯鍵
 * @param {string} lang - 語言代碼
 * @param {string} key - 點分隔的鍵，如 'common.loading'
 * @param {Object} params - 可選的參數對象
 * @returns {string} - 翻譯後的文字
 */
export const getTranslation = (lang, key, params) => {
  const keys = key.split('.');
  let result = translations[lang] || translations[DEFAULT_LANGUAGE];
  
  // 迭代訪問巢狀物件
  for (const k of keys) {
    if (result && Object.prototype.hasOwnProperty.call(result, k)) {
      result = result[k];
    } else {
      // 如果找不到翻譯，返回鍵名
      console.warn(`Translation key not found: ${key} (language: ${lang})`);
      return key;
    }
  }
  
  // 如果有參數，進行格式化
  return typeof result === 'string' && params ? formatTranslation(result, params) : result;
};

/**
 * 切換語言並重新導向到新的語言路徑
 * @param {string} currentLang - 當前語言代碼
 * @param {string} newLang - 新語言代碼
 * @param {string} pathname - 當前路徑
 * @returns {string} - 新的路徑
 */
export const changeLanguagePath = (currentLang, newLang, pathname) => {
  if (newLang === currentLang) return pathname;
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // 如果當前 URL 的第一段是語言代碼，替換它
  if (Object.keys(SUPPORTED_LANGUAGES).includes(pathSegments[0])) {
    pathSegments[0] = newLang;
  } else {
    // 否則，在路徑前加上新語言代碼
    pathSegments.unshift(newLang);
  }
  
  return `/${pathSegments.join('/')}`;
};