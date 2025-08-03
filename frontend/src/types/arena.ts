// 競技/試煉/追憶頁面的類型定義

export type ArenaType = 'arena' | 'trial' | 'memory';

export interface ArenaConfig {
  name: string;
  description: string;
  icon: string;
  content: {
    title: string;
    sections: ArenaSection[];
  };
}

export interface ArenaSection {
  title: string;
  description: string;
  items?: ArenaItem[];
  subsections?: ArenaSubsection[];
}

export interface ArenaSubsection {
  title: string;
  description: string;
  items?: ArenaItem[];
}

export interface ArenaItem {
  name: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  type?: string;
  icon?: string;
}