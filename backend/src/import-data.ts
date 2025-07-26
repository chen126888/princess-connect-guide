import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

// 獲取所有圖片檔案名稱
const getImageFiles = (): string[] => {
  const imagesPath = path.join(__dirname, '../../data/images/characters');
  if (!fs.existsSync(imagesPath)) {
    console.error('圖片資料夾不存在:', imagesPath);
    return [];
  }
  return fs.readdirSync(imagesPath).filter(file => file.endsWith('.png'));
};

// 根據角色名稱尋找對應的圖片檔案
const findCharacterImages = (characterName: string, imageFiles: string[]): { normal: string | null, sixStar: string | null } => {
  // 移除括號、空格並轉換為檔案名格式
  const cleanName = characterName.replace(/[()]/g, '').replace(/\s+/g, '');
  
  // 尋找普通圖片
  let normalImage = imageFiles.find(file => file === `${cleanName}.png`);
  
  // 尋找六星圖片
  let sixStarImage = imageFiles.find(file => file === `六星${cleanName}.png`);
  
  // 如果沒找到，嘗試其他可能的變體
  if (!normalImage) {
    // 嘗試一些常見的名稱變換
    const variations = [
      cleanName.replace('夏日', '泳裝'),
      cleanName.replace('泳裝', '夏日'),
      cleanName.replace('聖誕節', '聖誕'),
      cleanName.replace('聖誕', '聖誕節'),
      cleanName.replace('（', ''),
      cleanName.replace('）', ''),
      // 處理 & 符號
      cleanName.replace('&', '&'),
    ];
    
    for (const variation of variations) {
      const found = imageFiles.find(file => file === `${variation}.png`);
      if (found) {
        normalImage = found;
        break;
      }
    }
  }
  
  return {
    normal: normalImage || null,
    sixStar: sixStarImage || null
  };
};

// 從 Excel 檔案讀取角色資料
const readCharactersFromExcel = (): any[] => {
  const excelPath = path.join(__dirname, '../../data/excel/2025公主連結角色簡略介紹表_converted.xlsx');
  
  if (!fs.existsSync(excelPath)) {
    console.error('Excel 檔案不存在:', excelPath);
    return [];
  }
  
  const workbook = XLSX.readFile(excelPath);
  const characters: any[] = [];
  
  // 讀取所有工作表 (前衛、中衛、後衛)
  const sheets = ['前衛', '中衛', '後衛'];
  
  for (const sheetName of sheets) {
    if (workbook.SheetNames.includes(sheetName)) {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet);
      
      // 為每個角色添加位置資訊
      const charactersWithPosition = sheetData.map((row: any) => ({
        ...row,
        位置: sheetName
      }));
      
      characters.push(...charactersWithPosition);
      console.log(`📊 從 ${sheetName} 工作表讀取了 ${charactersWithPosition.length} 個角色`);
    }
  }
  
  return characters;
};

async function importData() {
  try {
    console.log('🚀 開始匯入資料...');
    
    // 從 Excel 讀取角色資料
    const charactersData = readCharactersFromExcel();
    console.log(`📊 總共讀取了 ${charactersData.length} 個角色`);
    
    if (charactersData.length === 0) {
      console.error('❌ 沒有讀取到角色資料');
      return;
    }
    
    // 獲取所有圖片檔案
    const imageFiles = getImageFiles();
    console.log(`📁 找到 ${imageFiles.length} 個圖片檔案`);
    
    // 清空現有資料
    await prisma.characterImage.deleteMany();
    await prisma.character.deleteMany();
    
    // 匯入角色資料和圖片對應
    for (const rawData of charactersData) {
      // 清理和映射資料欄位
      const characterData = {
        角色名稱: String(rawData['角色名稱'] || '').trim(),
        暱稱: rawData['暱稱'] ? String(rawData['暱稱']).trim() : null,
        位置: String(rawData['位置'] || '').trim(),
        角色定位: rawData['角色定位'] ? String(rawData['角色定位']).trim() : null,
        常駐限定: rawData['常駐/限定'] ? String(rawData['常駐/限定']).trim() : null,
        屬性: rawData['屬性'] ? String(rawData['屬性']).trim() : null,
        能力偏向: rawData['能力偏向'] ? String(rawData['能力偏向']).trim() : null,
        競技場進攻: rawData['競技場進攻'] ? String(rawData['競技場進攻']).trim() : null,
        競技場防守: rawData['競技場防守'] ? String(rawData['競技場防守']).trim() : null,
        戰隊戰等抄作業場合: rawData['戰隊戰等抄作業場合'] ? String(rawData['戰隊戰等抄作業場合']).trim() : null,
        說明: rawData['說明'] ? String(rawData['說明']).trim() : null
      };
      
      // 跳過空的角色名稱
      if (!characterData.角色名稱) {
        continue;
      }
      
      // 創建角色資料
      const character = await prisma.character.create({
        data: characterData
      });
      
      // 尋找對應的圖片
      const images = findCharacterImages(characterData.角色名稱, imageFiles);
      
      // 創建圖片對應資料
      if (images.normal) {
        await prisma.characterImage.create({
          data: {
            角色名稱: characterData.角色名稱,
            頭像檔名: images.normal,
            六星頭像檔名: images.sixStar
          }
        });
        console.log(`✅ ${characterData.角色名稱}: ${images.normal}${images.sixStar ? ` + ${images.sixStar}` : ''}`);
      } else {
        console.log(`❌ ${characterData.角色名稱}: 找不到對應圖片`);
      }
    }
    
    console.log('✨ 資料匯入完成!');
  } catch (error) {
    console.error('❌ 匯入失敗:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  importData();
}

export { importData };