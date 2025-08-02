import type { Character } from '../types';

// 共用的圖片路徑生成函數
export const getCharacterImagePath = (character: Character): { sixStar: string | null; normal: string | null } => {
  const API_BASE_URL = 'http://localhost:3000';
  
  return {
    sixStar: character.六星頭像檔名 ? `${API_BASE_URL}/images/characters/${character.六星頭像檔名}` : null,
    normal: character.頭像檔名 ? `${API_BASE_URL}/images/characters/${character.頭像檔名}` : null
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