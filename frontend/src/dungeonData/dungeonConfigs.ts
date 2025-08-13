interface ExcelLink {
  name: string;
  url: string;
}

interface DungeonConfig {
  introduction: string;
  enhancementIntroduction: string; // New property
  excelLinks: ExcelLink[];
}

export const dungeonConfigs: DungeonConfig = {
  introduction: `深域是公主連結中的高難度PVE關卡，建議等級300以上挑戰會更容易成功。

每個區域每日有十次挑戰次數，無論挑戰成功或掃蕩，都會消耗次數及10體力。每日可消耗50鑽石重置一次挑戰次數，恢復為10次。

深域獎勵包括每次通關可獲得的星素水晶球及星素碎片，這些可用來強化屬性。

個人建議滿等玩家每天應挑戰各屬性深域以消耗次數；若為課佬玩家，則可考慮消耗鑽石重置次數。`,
  enhancementIntroduction: `強化系統有四部分：
1. 屬性等級：強化各屬性攻擊力，強化道具為星素水晶球。
2. 屬性等級：有很多節點，可強化攻擊、防禦、爆級等等，強化道具為星素碎片。
3. 大師技能：強化全角色的能力，強化道具為大師碎片。
4. 職階專精：各角色有不同職業(攻擊、破防、增益、妨礙等等)，強化該職業的能力，強化道具為轉蛋，由專精卷抽出。

各道具獲取來源：
* 星素水晶球：大師商店、深域、活動、深淵討伐等等。
* 星素碎片：大師商店、深域、活動、深淵討伐等等。
* 大師碎片：大師商店、連結幣商店、巡遊商店、抽角色。
* 專精卷：每日登陸、活動`,
  excelLinks: [
    { name: '台服', url: 'https://docs.google.com/spreadsheets/d/1iVt4tB41cl8wW_UCBwtJYCEhYPqHL6MDDPkEitFw81I/edit?gid=1757605278#gid=1757605278' },
    { name: '對岸(1~5)', url: 'https://docs.qq.com/sheet/DQ0JvVVpaU1NpcnZB?tab=7fijja' },
    { name: '對岸(6~)', url: 'https://docs.qq.com/sheet/DQ3NHeUlWcGdoUWJD?nlc=1&tab=862w5z' },
    { name: '英文版(6~)', url: 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vSI2I1LNNIz623PLPc0nW11Q8ilYuZh6RuMrefQRRUD3BNtYRBuvesuRv39ZvNGzLsR-Yx46CahJqb3/pubhtml?pli=1#gid=1699574533' },
  ],
};
