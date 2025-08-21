export interface CharacterPlanningData {
  sixStarAdvice: {
    title: string;
    description: string;
    actionText: string;
  };
  teamBuildingStrategy: {
    title: string;
    description: string;
    recommendedTeams: string[];
  };
  eventStrategy: {
    title: string;
    description: string;
  };
  nonSixStarStrategy: {
    title: string;
    description: string;
  };
  resourceManagement: {
    title: string;
    description: string;
  };
}

export const characterPlanningData: CharacterPlanningData = {
  sixStarAdvice: {
    title: "確認六星角色",
    description: "首先，確認你離開後推出的重要六星角色是否都已開花。建議將 A級以上 的角色都練起來，競技場角色有一隊就足夠，另一隊可以先用默涅隊代替，等後期戰隊戰重要角色都養完了再考慮。",
    actionText: "前往六星角色養成頁面"
  },
  teamBuildingStrategy: {
    title: "善用未來視抽角",
    description: "回鍋玩家的鑽石資源通常較少。請先確認自己的角色池，參考未來視，並以戰隊戰為主來規劃要組的隊伍。因為滿等後還有深域要推，每個屬性都至少要有一隊。",
    recommendedTeams: ["火物", "風物", "暗法"]
  },
  eventStrategy: {
    title: "跟隨加倍活動",
    description: "大多數時間都會有加倍活動，若不在新手加倍其間，請跟隨該加倍項目刷資源，加速養成。若無加倍活動，此時可以刷支線角色。"
  },
  nonSixStarStrategy: {
    title: "刷取非六星常用角色",
    description: "這邊角色有三星後，開專>升五星，有些時候沒五星也能用。"
  },
  resourceManagement: {
    title: "資源管理建議",
    description: "女神的秘石(母豬石)只用在刷不到的角色，等打戰隊戰或深域時，有使用到在拉上去。阿斯特賴亞戒指(突破戒指)不多的話，請用在常駐不可刷的角色上，因為限定的極限突破只要40碎片，常駐不可刷的卻需要120碎片。"
  }
};