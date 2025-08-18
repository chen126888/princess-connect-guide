export interface NewbieBoostData {
  title: string;
  fragmentPriority: {
    title: string;
    description: string;
  };
  rankAdvice: {
    title: string;
    description: string;
  };
}

export const newbieBoostData: NewbieBoostData = {
  title: "若還有新手加倍期間的策略",
  fragmentPriority: {
    title: "優先刷取角色碎片",
    description: "若還有新手加倍效果，且鑽石資源足夠，請優先刷取你需要的角色碎片。與其瘋狂推主線和支線拿鑽石，不如把握加倍期間多拿碎片，避免之後多花很多體力來刷。"
  },
  rankAdvice: {
    title: "不用急著衝 Rank",
    description: "同樣地，也不用急著刷 Normal 關卡來拿裝備衝 Rank。就算你 Rank 達到當前等級最高，在高難度關卡（如深域、追憶、四階王）中，也高機率打不贏。因此，不如利用加倍期間多拿碎片。"
  }
};