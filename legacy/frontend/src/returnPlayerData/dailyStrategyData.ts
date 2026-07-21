export interface DailyStrategyData {
  dungeonAdvice: {
    title: string;
    mainTip: string;
    details: string[];
  };
  challengeAdvice: {
    title: string;
    problem: string;
    solution: string;
  };
}

export const dailyStrategyData: DailyStrategyData = {
  dungeonAdvice: {
    title: "地下城與小屋",
    mainTip: "地下城能打到 EX6 就盡量打，這能獲得小屋的體力道具。",
    details: [
      "小屋產體力的道具記得升級，許多玩家（包括我自己）在滿等後才發現這點。"
    ]
  },
  challengeAdvice: {
    title: "挑戰與作業",
    problem: "在一些需要抄作業的場合，如果半自動或手動刀無法順利執行，可能是因為現在的職階系統有 TP 加速，導致出招順序錯亂。",
    solution: "直接改用「全 set」。"
  }
};