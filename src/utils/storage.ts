import { DailyQuest, PlayerProfile, ShopCharacter } from '../types';
import { INITIAL_ACHIEVEMENTS, INITIAL_QUESTS, SHOP_CHARACTERS } from '../data/games';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'nova_arcade_player_profile_v1';
const QUESTS_KEY = 'nova_arcade_quests_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Gamer Nova',
  avatar: 'cyber-samurai',
  coins: 200,
  xp: 50,
  level: 1,
  totalGamesPlayed: 0,
  unlockedAchievements: [],
  unlockedAvatars: ['cyber-samurai', 'pixel-wizard', 'retro-gamer'],
  favorites: ['cyber-runner', 'neon-snake'],
  highScores: {
    'cyber-runner': 120,
    'space-strike': 350,
    'block-breaker': 480,
    'neon-snake': 18,
    'cyber-2048': 512,
    'flappy-cyber': 12,
    'monster-strike': 240,
    'memory-matrix': 160
  }
};

// Check and automatically unlock level milestone limited rewards
export function checkAndUnlockLevelRewards(profile: PlayerProfile): {
  updatedProfile: PlayerProfile;
  newlyUnlockedAvatars: ShopCharacter[];
} {
  const currentUnlocked = profile.unlockedAvatars && Array.isArray(profile.unlockedAvatars)
    ? [...profile.unlockedAvatars]
    : ['cyber-samurai', 'pixel-wizard', 'retro-gamer'];

  const newlyUnlocked: ShopCharacter[] = [];

  SHOP_CHARACTERS.forEach(char => {
    // If it's a limited level reward and player level >= minLevel
    if (char.isLimitedLevelReward && char.minLevel && profile.level >= char.minLevel) {
      if (!currentUnlocked.includes(char.id)) {
        currentUnlocked.push(char.id);
        newlyUnlocked.push(char);
      }
    }
  });

  const updatedProfile: PlayerProfile = {
    ...profile,
    unlockedAvatars: currentUnlocked
  };

  return { updatedProfile, newlyUnlockedAvatars: newlyUnlocked };
}

export function loadPlayerProfile(): PlayerProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      let profile: PlayerProfile = { ...DEFAULT_PROFILE, ...parsed };
      if (!profile.unlockedAvatars || !Array.isArray(profile.unlockedAvatars)) {
        profile.unlockedAvatars = ['cyber-samurai', 'pixel-wizard'];
      }
      if (!profile.unlockedAvatars.includes(profile.avatar)) {
        profile.unlockedAvatars.push(profile.avatar);
      }
      // Give starter boost if profile has fewer than 100 coins
      if (typeof profile.coins !== 'number' || profile.coins < 100) {
        profile.coins = Math.max(100, Number(profile.coins) || 100);
      }

      // Check if any level milestone avatar qualifies
      const { updatedProfile } = checkAndUnlockLevelRewards(profile);
      return updatedProfile;
    }
  } catch {}
  return DEFAULT_PROFILE;
}

export function savePlayerProfile(profile: PlayerProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

export function loadQuests(): DailyQuest[] {
  try {
    const data = localStorage.getItem(QUESTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {}
  return INITIAL_QUESTS;
}

export function saveQuests(quests: DailyQuest[]) {
  try {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  } catch {}
}

export function fireCelebrationConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch {}
}

// Calculate level, rewards, and check achievements after any game score update
export function updateGameResults(
  profile: PlayerProfile,
  gameId: string,
  score: number,
  coinsEarned: number = 10
): {
  updatedProfile: PlayerProfile;
  newAchievements: string[];
  newHighscore: boolean;
  newlyUnlockedAvatars: ShopCharacter[];
  didLevelUp: boolean;
} {
  const currentHigh = profile.highScores[gameId] || 0;
  const isHigh = score > currentHigh;
  const newHighScores = {
    ...profile.highScores,
    [gameId]: Math.max(currentHigh, score)
  };

  const newTotalGames = profile.totalGamesPlayed + 1;
  const newCoins = profile.coins + coinsEarned;
  const newXp = profile.xp + Math.max(10, Math.floor(score / 5));
  const newLevel = Math.floor(newXp / 200) + 1;
  const didLevelUp = newLevel > profile.level;

  const unlocked = [...profile.unlockedAchievements];
  const newAch: string[] = [];

  INITIAL_ACHIEVEMENTS.forEach(ach => {
    if (!unlocked.includes(ach.id)) {
      let qualified = false;
      if (ach.reqType === 'games_played' && newTotalGames >= ach.reqTarget) qualified = true;
      if (ach.reqType === 'score' && score >= ach.reqTarget) qualified = true;
      if (ach.reqType === 'coins' && newCoins >= ach.reqTarget) qualified = true;
      if (ach.reqType === 'favorites' && profile.favorites.length >= ach.reqTarget) qualified = true;

      if (qualified) {
        unlocked.push(ach.id);
        newAch.push(ach.title);
      }
    }
  });

  const baseUpdated: PlayerProfile = {
    ...profile,
    highScores: newHighScores,
    totalGamesPlayed: newTotalGames,
    coins: newCoins,
    xp: newXp,
    level: newLevel,
    unlockedAchievements: unlocked
  };

  // Check limited level milestone unlocks
  const { updatedProfile, newlyUnlockedAvatars } = checkAndUnlockLevelRewards(baseUpdated);

  savePlayerProfile(updatedProfile);
  return {
    updatedProfile,
    newAchievements: newAch,
    newHighscore: isHigh,
    newlyUnlockedAvatars,
    didLevelUp
  };
}
