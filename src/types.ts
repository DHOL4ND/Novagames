export type GameCategory = 'all' | 'action' | 'arcade' | 'puzzle' | 'reflex' | 'casual' | 'multiplayer';

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
  isMultiplayerSupported?: boolean;
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
  isLimitedLevelReward?: boolean;
  levelRewardTitle?: string;
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
  reqType: 'games_played' | 'score' | 'favorites' | 'coins' | 'quest' | 'multiplayer_wins';
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
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster' | 'Nova Legend' | 'Nova Supreme';
  tierColor: string;
  title: string;
  badge?: string;
  isCurrentPlayer?: boolean;
  gameHighScores?: Record<string, number>;
}

// Multiplayer Room & Game State Interfaces
export interface RoomPlayer {
  id: string;
  name: string;
  avatar: string;
  avatarIcon: string;
  level: number;
  isHost: boolean;
  ready: boolean;
  score: number;
  paddleY?: number; // 0 to 1 ratio
  connectedAt: number;
  lastPing: number;
}

export interface MultiplayerRoom {
  id: string; // e.g. "ROOM-8821"
  code: string; // 4-letter/digit code e.g. "8821"
  gameId: string;
  status: 'waiting' | 'starting' | 'playing' | 'ended';
  hostId: string;
  players: Record<string, RoomPlayer>;
  ball?: {
    x: number; // 0 to 100
    y: number; // 0 to 100
    vx: number;
    vy: number;
    speed: number;
    isFireball?: boolean;
    lastHitter?: string;
    timestamp?: number;
  };
  score1: number;
  score2: number;
  winnerId?: string;
  winnerName?: string;
  maxScore: number;
  createdAt: number;
  updatedAt: number;
}
