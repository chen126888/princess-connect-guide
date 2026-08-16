
export interface Item {
  id: number;
  name: string;
  description: string;
  source?: string;
}

export const items: Item[] = [
  {
    id: 1,
    name: "EXP藥水",
    description: "可用來升級角色",
    source: "經驗值冒險、商店、推關、任務獎勵等等"
  },
  {
    id: 2,
    name: "瑪那",
    description: "遊戲內貨幣，角色升級、裝備強化等大多數地方，都會使用到。",
    source: "瑪那冒險、推關、任務獎勵等等"
  },
  {
    id: 3,
    name: "盧幣",
    description: "用來購買小屋的道具以及小屋道具升級",
    source: "任務獎勵"
  },
  {
    id: 4,
    name: "裝備",
    description: "用來升級rank。",
    source: "Normal關卡"
  },
  {
    id: 5,
    name: "精煉石",
    description: "用來升級裝備星數。",
    source: "一般/限時商店"
  },
  {
    id: 6,
    name: "記憶碎片",
    description: "用來升級角色星數、專武1等級",
    source: "主線/支線 Hard關卡、女神石商店"
  },
  {
    id: 7,
    name: "純淨記憶碎片",
    description: "用來升級角色到六星、專武2等級升級",
    source: "主線VH關卡"
  },
  {
    id: 8,
    name: "女神的秘石",
    description: "用來在商店購買角色碎片",
    source: "抽角色、各式活動"
  },
  {
    id: 9,
    name: "公主之星(碎片)",
    description: "用來升級專武1",
    source: "聖蹟調查、巡遊商店、各式活動"
  },
  {
    id: 10,
    name: "公主寶珠",
    description: "用來六星開花",
    source: "神殿調查、巡遊商店"
  },
  {
    id: 11,
    name: "星素水晶球",
    description: "用來升級屬性等級",
    source: "深域、深淵討伐、活動抽獎獎勵、大師商店"
  },
  {
    id: 12,
    name: "星素碎片",
    description: "用來升級屬性技能",
    source: "深域、深淵討伐、大師商店"
  },
  {
    id: 13,
    name: "大師碎片",
    description: "用來升級大師技能",
    source: "大師/連結/巡遊商店、抽角色"
  },
  {
    id: 14,
    name: "專精卷",
    description: "用來抽取職階專精轉蛋",
    source: "主線最後幾張關卡、每日任務、活動抽獎獎勵"
  },
  {
    id: 15,
    name: "阿斯特賴亞戒指",
    description: "角色滿等級，用來極限突破，可提升角色最大等級10等",
    source: "戰鬥試煉場、巡遊商店"
  },
  {
    id: 16,
    name: "專用裝備1輝光水晶球Lv270",
    description: "使用後可免費提升角色專武1等級到270",
    source: "巡遊商店、活動抽獎獎勵"
  },
  {
    id: 17,
    name: "輝光水晶球Lv280",
    description: "使用後可免費提升角色等級到270，並免費提升到對應rank。",
    source: "巡遊商店"
  },
  {
    id: 18,
    name: "各式原礦",
    description: "可用來替代各種等級的裝備",
    source: "巡遊商店、限時商店"
  },
  {
    id: 19,
    name: "彩裝",
    description: "最高級的ex裝備，僅能在一般場所使用(戰隊戰不行)，可以刷詞條。",
    source: "EX裝備商店"
  },
  {
    id: 20,
    name: "EX裝備鍊成幣",
    description: "可以用來刷新彩裝的詞條。",
    source: "追憶戰"
  },
  {
    id: 21,
    name: "阿爾克絲幣",
    description: "商店換取彩裝。",
    source: "追憶戰"
  },
  {
    id: 22,
    name: "鍊成水晶球",
    description: "升級彩裝詞條等級。",
    source: "究極鍊成每日抽獎"
  }
];
