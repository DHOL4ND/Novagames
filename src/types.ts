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

export interface PlayerProfile {
  name: string;
  avatar: string;
  coins: number;
  xp: number;
  level: number;
  totalGamesPlayed: number;
  unlockedAchievements: string[];
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
