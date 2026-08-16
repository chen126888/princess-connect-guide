import type { ArenaConfig } from '../types/arena';

export const arenaConfigMemory: ArenaConfig = {
  name: '追憶',
  description: '',
  icon: '📖',
  content: {
    title: '',
    sections: [
      {
        title: '追憶之戰域簡介',
        description: '300等後再考慮打，會打王，分為追憶戰，和追憶戰霸。\n追憶戰：目前有12層，首通會獎勵EX裝備鍊成Pt，且每隔一段時間，可根據已經通關層數獲得獎勵，開啟可獲得EX裝備鍊成Pt、阿爾克絲幣、鍊成水晶球(可能)。\n追憶戰霸：有兩關，分別為霸瞳和贊恩，各五層，首通會有EX裝備鍊成Pt、阿爾克絲幣，且每隔一段週期(一週？)，會補充三次挑戰機會(打贏才扣一次)。\nEX裝備鍊備鍊成Pt：用於改變彩裝詞條。\n阿爾克絲幣：商店換取彩裝。\n鍊成水晶球：直接將特定詞條變成最高級，通常用於貫通1石，可變成3。',
      },
      {
        title: '霸瞳1~5',
        description: '通用隊伍',
        recommendedCharacters: ['厄', '多娜', '公黑', '魔吉塔', '闇空花'],
      },
      {
        title: '贊恩1~5',
        description: '通用隊伍',
        recommendedCharacters: ['涅妃', '克莉絲提娜', '萬聖智', '星日', '狂野跳跳虎'],
      },
    ]
  }
};