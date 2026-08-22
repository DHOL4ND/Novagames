export type GameCategory = 'all' | 'action' | 'arcade' | 'puzzle' | 'reflex' | 'casual';

export interface GameMetadata {
  id: string;
  title: string;
  category: GameCategory;
  categoryName: string;
  description: string;
  tagline: string;
  rating: number;
  plays: number;
  tags: string[];
  bannerGradient: string;
  accentColor: string;
  iconName: string;
  thumbnailBadge?: string;
  controls: {
    keyboard: string[];
    touch: string;
  };
}

export interface ShopCharacter {
  id: string;
  name: string;
  title: string;
  icon: string;
  color: string;
  price: number;
  minLevel?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  perkText: string;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  coins: number;
  xp: number;
  level: number;
  totalGamesPlayed: number;
  unlockedAchievements: string[];
  unlockedAvatars: string[];
  favorites: string[];
  highScores: Record<string, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  rewardXp: number;
  reqType: 'games_played' | 'score' | 'favorites' | 'coins' | 'quest';
  reqTarget: number;
  gameId?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  desc: string;
  rewardCoins: number;
  rewardXp: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
  gameId?: string;
}

export interface LeaderboardPlayer {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  avatarIcon: string;
  level: number;
  xp: number;
  totalGamesPlayed: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster' | 'Nova Legend';
  tierColor: string;
  title: string;
  badge?: string;
  isCurrentPlayer?: boolean;
  gameHighScores?: Record<string, number>;
}
