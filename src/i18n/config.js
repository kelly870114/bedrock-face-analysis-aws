export const SUPPORTED_LANGUAGES = {
  zh: "中文",
  en: "English",
};

export const DEFAULT_LANGUAGE = "zh";

// 獲取當前語言（從 URL 路徑）
export const getCurrentLanguage = (pathname) => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  return Object.keys(SUPPORTED_LANGUAGES).includes(firstSegment)
    ? firstSegment
    : DEFAULT_LANGUAGE;
};
