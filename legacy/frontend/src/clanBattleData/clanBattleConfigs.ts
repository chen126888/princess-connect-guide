export interface YoutubeChannel {
  name: string;
  link: string;
}

export type CharacterTier = '核心' | '重要' | '普通';

export interface ClanBattleCharacter {
  name: string;
  tier: CharacterTier;
}

export interface ClanBattleDamageTypeSection {
  physical: ClanBattleCharacter[];
  magic: ClanBattleCharacter[];
}

export interface ClanBattleAttributeSection {
  [attribute: string]: ClanBattleDamageTypeSection;
}

interface ClanBattleConfig {
  youtubeChannels: YoutubeChannel[];
  commonCharacters: ClanBattleAttributeSection;
  compensationKnifeContent: {
    recommendedCharacters: string[];
  };
}

export const clanBattleConfigs: ClanBattleConfig = {
  youtubeChannels: [
    { name: '煌靈/LongTimeNoC', link: 'https://www.youtube.com/@LongTimeNoC/videos' },
    { name: 'Eruru/えるるぅ', link: 'https://www.youtube.com/@Eruru/featured' },
  ],
  // 角色資料已遷移到資料庫，由 ClanBattleCommonCharacter 和 ClanBattleCompensationCharacter 表管理
  compensationKnifeContent: {
    recommendedCharacters: [], // 已遷移到資料庫
  },
  commonCharacters: {
    // 所有角色資料已遷移到資料庫，由 ClanBattleCommonCharacter 表管理
    fire: { physical: [], magic: [] },
    water: { physical: [], magic: [] },
    wind: { physical: [], magic: [] },
    light: { physical: [], magic: [] },
    dark: { physical: [], magic: [] },
  },
};
