import type { Character } from '../types';

// 生成檔案名稱的輔助函數
const generateFileName = (characterName: string): string => {
  // 去除括號並替換為對應格式，處理常見的角色名稱模式
  return characterName
    .replace(/[()（）]/g, '') // 移除所有括號
    .replace(/\s+/g, '') // 移除空格
    + '.png';
};

// 共用的圖片路徑生成函數
export const getCharacterImagePath = (character: Character): { sixStar: string | null; normal: string | null } => {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:3000/images';
  
  // 如果有明確的檔名，優先使用
  let normalImagePath: string | null = null;
  
  if (character.頭像檔名) {
    normalImagePath = `${IMAGE_BASE_URL}/characters/${encodeURIComponent(character.頭像檔名)}`;
  } else if (character.角色名稱) {
    // 如果沒有檔名，嘗試根據角色名稱生成
    const generatedFileName = generateFileName(character.角色名稱);
    normalImagePath = `${IMAGE_BASE_URL}/characters/${encodeURIComponent(generatedFileName)}`;
  }
  
  return {
    sixStar: character.六星頭像檔名 ? `${IMAGE_BASE_URL}/characters/${encodeURIComponent(character.六星頭像檔名)}` : null,
    normal: normalImagePath
  };
};

// 共用的圖片 URL 決定邏輯
export const getCharacterImageSrc = (character: Character): string => {
  const imagePaths = getCharacterImagePath(character);
  
  // 優先顯示六星圖片，沒有則顯示普通圖片，都沒有則顯示預設圖片
  if (imagePaths.sixStar) return imagePaths.sixStar;
  if (imagePaths.normal) return imagePaths.normal;
  return "/default-character.svg";
};

// 共用的圖片錯誤處理邏輯
export const handleCharacterImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  character: Character,
  imageError: boolean,
  setImageError: (error: boolean) => void
) => {
  const img = e.target as HTMLImageElement;
  const imagePaths = getCharacterImagePath(character);
  
  if (!imageError && imagePaths.sixStar && img.src === imagePaths.sixStar) {
    // 六星圖片載入失敗，嘗試普通圖片
    if (imagePaths.normal) {
      img.src = imagePaths.normal;
      setImageError(true);
    } else {
      // 沒有普通圖片，使用預設圖片
      img.src = "/default-character.svg";
    }
  } else {
    // 普通圖片也載入失敗，使用預設圖片
    img.src = "/default-character.svg";
  }
};