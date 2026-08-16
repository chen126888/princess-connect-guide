/**
 * 角色領域常數。
 *
 * 這些值來自 2026-06-30 資料庫備份的實測結果（314 筆角色），
 * 而非文件推測——只有實際資料中「值域封閉」的欄位才在此定義為型別列舉。
 * 值域開放/髒資料的欄位（角色定位、常駐限定）暫不列舉，見 §Phase 2 待處理。
 */

/** 角色位置。實測僅此三值（前衛 108、中衛 103、後衛 103）。 */
export const POSITIONS = ['前衛', '中衛', '後衛'] as const;
export type Position = (typeof POSITIONS)[number];

/** 角色屬性。實測僅此五值——注意沒有「土屬」（舊型別註解有誤）。 */
export const ELEMENTS = ['火屬', '水屬', '風屬', '光屬', '闇屬'] as const;
export type Element = (typeof ELEMENTS)[number];

/** 評級，由強到弱；「倉管」表示不推薦培養。 */
export const RATING_TIERS = ['T0', 'T1', 'T2', 'T3', 'T4', '倉管'] as const;
export type RatingTier = (typeof RATING_TIERS)[number];

/** 四個互相獨立的評級維度（對應 characters 表的四個評級欄位）。 */
export const RATING_CATEGORIES = ['arenaAtk', 'arenaDef', 'clanBattle', 'dungeon'] as const;
export type RatingCategory = (typeof RATING_CATEGORIES)[number];

/** 評級維度的顯示名稱。 */
export const RATING_CATEGORY_LABELS: Record<RatingCategory, string> = {
  arenaAtk: '競技場進攻',
  arenaDef: '競技場防守',
  clanBattle: '戰隊戰',
  dungeon: '深域及抄作業',
};

/** 評級強弱排序用的權重（數字越小越強），供排序與比較使用。 */
export const RATING_TIER_ORDER: Record<RatingTier, number> = {
  T0: 0,
  T1: 1,
  T2: 2,
  T3: 3,
  T4: 4,
  倉管: 5,
};

/** 型別守衛：判斷任意字串是否為合法評級。 */
export function isRatingTier(value: string): value is RatingTier {
  return (RATING_TIERS as readonly string[]).includes(value);
}
