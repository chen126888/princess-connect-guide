export interface CharacterPriorityInfo {
  name: string;
  ue2?: string; // Only for six-star
  description?: string; // For non-six-star characters
}

export interface PriorityTier {
  tier: string;
  characters: CharacterPriorityInfo[];
  description?: string;
  color?: string; 
}
