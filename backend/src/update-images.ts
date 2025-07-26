import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

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
  // 處理特殊情況
  let cleanName = characterName;
  
  // 處理括號：(祭服) -> 祭服，其他括號移除
  if (characterName.includes('（祭服）')) {
    cleanName = characterName.replace('（祭服）', '祭服');
  } else {
    cleanName = characterName.replace(/[()（）]/g, '');
  }
  
  // 移除空格和 & 符號
  cleanName = cleanName.replace(/\s+/g, '').replace(/&/g, '');
  
  // 尋找普通圖片
  let normalImage = imageFiles.find(file => file === `${cleanName}.png`);
  
  // 尋找六星圖片
  let sixStarImage = imageFiles.find(file => file === `六星${cleanName}.png`);
  
  // 如果沒找到，嘗試其他可能的變體
  if (!normalImage) {
    const variations = [
      cleanName.replace('夏日', '泳裝'),
      cleanName.replace('泳裝', '夏日'),
      cleanName.replace('聖誕節', '聖誕'),
      cleanName.replace('聖誕', '聖誕節'),
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

async function updateCharacterImages() {
  try {
    console.log('🚀 更新角色圖片檔名...');
    
    // 獲取所有角色
    const characters = await prisma.character.findMany({
      select: { id: true, 角色名稱: true }
    });
    console.log(`📊 找到 ${characters.length} 個角色`);
    
    // 獲取所有圖片檔案
    const imageFiles = getImageFiles();
    console.log(`📁 找到 ${imageFiles.length} 個圖片檔案`);
    
    let successCount = 0;
    let failCount = 0;
    
    // 為每個角色尋找並更新圖片檔名
    for (const character of characters) {
      const images = findCharacterImages(character.角色名稱, imageFiles);
      
      if (images.normal || images.sixStar) {
        await prisma.character.update({
          where: { id: character.id },
          data: {
            頭像檔名: images.normal,
            六星頭像檔名: images.sixStar
          }
        });
        
        console.log(`✅ ${character.角色名稱}: ${images.normal || '無'}${images.sixStar ? ` + ${images.sixStar}` : ''}`);
        successCount++;
      } else {
        console.log(`❌ ${character.角色名稱}: 找不到對應圖片`);
        failCount++;
      }
    }
    
    console.log(`✨ 完成! 成功: ${successCount}, 失敗: ${failCount}`);
  } catch (error) {
    console.error('❌ 更新失敗:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  updateCharacterImages();
}

export { updateCharacterImages };