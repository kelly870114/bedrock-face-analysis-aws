// src/i18n/errorMessages.js
import { getCurrentLanguage } from './config';

// 錯誤訊息映射
const errorMessages = {
  zh: {
    'Invalid event code': '無效的活動代碼',
    'Event is not available': '活動未開放',
    'System error': '系統發生錯誤，請稍後再試',
    'Cannot find faceShape analysis result': '無法找到臉型分析結果',
    'Cannot find features analysis result': '無法找到五官分析結果',
    'Analysis failed': '分析失敗',
    'Connection error': '連線錯誤，請重試',
    'default': '發生錯誤，請稍後再試'
  },
  en: {
    'Invalid event code': 'Invalid event code',
    'Event is not available': 'Event is not available',
    'System error': 'System error, please try again later',
    'Cannot find faceShape analysis result': 'Cannot find face shape analysis result',
    'Cannot find features analysis result': 'Cannot find facial features analysis result',
    'Analysis failed': 'Analysis failed',
    'Connection error': 'Connection error, please try again',
    'default': 'An error occurred, please try again later'
  }
};

/**
 * 翻譯錯誤訊息
 * @param {string} message - 原始錯誤訊息
 * @param {string} lang - 語言代碼
 * @returns {string} - 翻譯後的錯誤訊息
 */
export const translateError = (message, lang) => {
  const currentLang = lang || getCurrentLanguage(window.location.pathname);
  const langMessages = errorMessages[currentLang] || errorMessages.zh;
  
  return langMessages[message] || langMessages.default;
};