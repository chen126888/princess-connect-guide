/**
 * 商品說明字典
 * 集中管理所有商品的懸停說明文字
 */
export const itemDescriptions: Record<string, string> = {
  // 星素系列
  '星素水晶球(火)': '屬性等級強化用',
  '星素水晶球(水)': '屬性等級強化用',
  '星素水晶球(風)': '屬性等級強化用',
  '星素水晶球(光)': '屬性等級強化用',
  '星素水晶球(闇)': '屬性等級強化用',
  '星素碎片': '屬性技能強化用',
  
  // 角色相關
  '大師碎片': '大師技能強化用',
  
  // 裝備相關
  '阿斯特賴亞戒指': '角色等級突破上限用',
  '各式原礦': '有多種等級，可替代對應等級之裝備',
  '輝光水晶球Lv280': '使用後，可無須消耗資源，提升到水晶球等級以及對應Rank',
  '專用裝備1輝光水晶球Lv270': '使用後，可將專1等級免費提升至水晶球等級'
};

/**
 * 獲取商品說明
 * @param itemName 商品名稱
 * @returns 說明文字或 null
 */
export const getItemDescription = (itemName: string): string | null => {
  return itemDescriptions[itemName] || null;
};