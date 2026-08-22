import { DailyQuest, PlayerProfile } from '../types';
import { INITIAL_ACHIEVEMENTS, INITIAL_QUESTS } from '../data/games';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'nova_arcade_player_profile_v1';
const QUESTS_KEY = 'nova_arcade_quests_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Gamer Nova',
  avatar: 'cyber-samurai',
  coins: 100,
  xp: 50,
  level: 1,
  totalGamesPlayed: 0,
  unlockedAchievements: [],
  unlockedAvatars: ['cyber-samurai', 'pixel-wizard'],
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

export function loadPlayerProfile(): PlayerProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const profile = { ...DEFAULT_PROFILE, ...parsed };
      if (!profile.unlockedAvatars || !Array.isArray(profile.unlockedAvatars)) {
        profile.unlockedAvatars = ['cyber-samurai', 'pixel-wizard'];
      }
      if (!profile.unlockedAvatars.includes(profile.avatar)) {
        profile.unlockedAvatars.push(profile.avatar);
      }
      return profile;
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

// Calculate level and check achievements after any game score update
export function updateGameResults(
  profile: PlayerProfile,
  gameId: string,
  score: number,
  coinsEarned: number = 10
): { updatedProfile: PlayerProfile; newAchievements: string[]; newHighscore: boolean } {
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

  const updated: PlayerProfile = {
    ...profile,
    highScores: newHighScores,
    totalGamesPlayed: newTotalGames,
    coins: newCoins,
    xp: newXp,
    level: newLevel,
    unlockedAchievements: unlocked
  };

  savePlayerProfile(updated);
  return { updatedProfile: updated, newAchievements: newAch, newHighscore: isHigh };
}
