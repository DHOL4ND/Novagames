import { LeaderboardPlayer, PlayerProfile } from '../types';
import { SHOP_CHARACTERS } from './games';

export type { LeaderboardPlayer };

export function getTierFromLevel(level: number): {
  tier: LeaderboardPlayer['tier'];
  tierColor: string;
  badge: string;
  minLevel: number;
  nextLevel: number;
} {
  if (level >= 20) {
    return { tier: 'Nova Legend', tierColor: 'from-amber-400 via-pink-500 to-purple-600', badge: '👑 LEGEND', minLevel: 20, nextLevel: 30 };
  } else if (level >= 15) {
    return { tier: 'Grandmaster', tierColor: 'from-red-500 to-rose-600', badge: '🔥 GRANDMASTER', minLevel: 15, nextLevel: 20 };
  } else if (level >= 10) {
    return { tier: 'Master', tierColor: 'from-purple-500 to-indigo-600', badge: '⚡ MASTER', minLevel: 10, nextLevel: 15 };
  } else if (level >= 7) {
    return { tier: 'Diamond', tierColor: 'from-cyan-400 to-blue-600', badge: '💎 DIAMOND', minLevel: 7, nextLevel: 10 };
  } else if (level >= 5) {
    return { tier: 'Platinum', tierColor: 'from-teal-400 to-emerald-600', badge: '🛡️ PLATINUM', minLevel: 5, nextLevel: 7 };
  } else if (level >= 3) {
    return { tier: 'Gold', tierColor: 'from-yellow-400 to-amber-600', badge: '⭐ GOLD', minLevel: 3, nextLevel: 5 };
  } else if (level >= 2) {
    return { tier: 'Silver', tierColor: 'from-slate-300 to-slate-500', badge: '⚔️ SILVER', minLevel: 2, nextLevel: 3 };
  } else {
    return { tier: 'Bronze', tierColor: 'from-amber-700 to-stone-600', badge: '🌱 BRONZE', minLevel: 1, nextLevel: 2 };
  }
}

export const BASE_LEADERBOARD_PLAYERS: Omit<LeaderboardPlayer, 'rank'>[] = [
  {
    id: 'bot-1',
    name: 'Aura_NovaQueen',
    avatar: 'cyber-goddess',
    avatarIcon: '👑',
    level: 18,
    xp: 3750,
    totalGamesPlayed: 320,
    tier: 'Grandmaster',
    tierColor: 'from-red-500 to-rose-600',
    title: 'Penguasa Cyber Top 1',
    badge: '🔥 JUARA 1',
    gameHighScores: {
      'cyber-runner': 890,
      'space-strike': 2450,
      'block-breaker': 1890,
      'neon-snake': 142,
      'cyber-2048': 4096,
      'flappy-cyber': 78,
      'monster-strike': 980,
      'memory-matrix': 450
    }
  },
  {
    id: 'bot-2',
    name: 'Rizky_CyberSlayer',
    avatar: 'mecha-knight',
    avatarIcon: '🤖',
    level: 14,
    xp: 2940,
    totalGamesPlayed: 245,
    tier: 'Master',
    tierColor: 'from-purple-500 to-indigo-600',
    title: 'Spesialis Runner & Refleks',
    badge: '⚡ TOP 2',
    gameHighScores: {
      'cyber-runner': 780,
      'space-strike': 1980,
      'block-breaker': 1420,
      'neon-snake': 118,
      'cyber-2048': 2048,
      'flappy-cyber': 64,
      'monster-strike': 890,
      'memory-matrix': 380
    }
  },
  {
    id: 'bot-3',
    name: 'Bintang_RetroGod',
    avatar: 'pixel-wizard',
    avatarIcon: '🧙‍♂️',
    level: 12,
    xp: 2480,
    totalGamesPlayed: 198,
    tier: 'Master',
    tierColor: 'from-purple-500 to-indigo-600',
    title: 'Master Puzzle & Snake',
    badge: '🏆 TOP 3',
    gameHighScores: {
      'cyber-runner': 640,
      'space-strike': 1650,
      'block-breaker': 1250,
      'neon-snake': 105,
      'cyber-2048': 2048,
      'flappy-cyber': 52,
      'monster-strike': 760,
      'memory-matrix': 340
    }
  },
  {
    id: 'bot-4',
    name: 'ShadowViper_99',
    avatar: 'shadow-ninja',
    avatarIcon: '🥷',
    level: 9,
    xp: 1890,
    totalGamesPlayed: 154,
    tier: 'Diamond',
    tierColor: 'from-cyan-400 to-blue-600',
    title: 'Ninja Kecepatan Tinggi',
    badge: '💎 PRO',
    gameHighScores: {
      'cyber-runner': 540,
      'space-strike': 1420,
      'block-breaker': 980,
      'neon-snake': 88,
      'cyber-2048': 1024,
      'flappy-cyber': 44,
      'monster-strike': 680,
      'memory-matrix': 290
    }
  },
  {
    id: 'bot-5',
    name: 'NeonFalcon_ID',
    avatar: 'cosmic-pilot',
    avatarIcon: '🚀',
    level: 8,
    xp: 1620,
    totalGamesPlayed: 128,
    tier: 'Diamond',
    tierColor: 'from-cyan-400 to-blue-600',
    title: 'Kapten Armada Luar Angkasa',
    badge: '💎 ELITE',
    gameHighScores: {
      'cyber-runner': 480,
      'space-strike': 1380,
      'block-breaker': 870,
      'neon-snake': 76,
      'cyber-2048': 1024,
      'flappy-cyber': 38,
      'monster-strike': 610,
      'memory-matrix': 260
    }
  },
  {
    id: 'bot-6',
    name: 'PixelHunter_X',
    avatar: 'pixel-paladin',
    avatarIcon: '🛡️',
    level: 6,
    xp: 1250,
    totalGamesPlayed: 96,
    tier: 'Platinum',
    tierColor: 'from-teal-400 to-emerald-600',
    title: 'Pemburu Koin Arkade',
    badge: '🛡️ PLATINUM',
    gameHighScores: {
      'cyber-runner': 390,
      'space-strike': 1100,
      'block-breaker': 740,
      'neon-snake': 62,
      'cyber-2048': 1024,
      'flappy-cyber': 31,
      'monster-strike': 520,
      'memory-matrix': 220
    }
  },
  {
    id: 'bot-7',
    name: 'HyperGamer_Z',
    avatar: 'cyber-samurai',
    avatarIcon: '⚔️',
    level: 5,
    xp: 1040,
    totalGamesPlayed: 78,
    tier: 'Platinum',
    tierColor: 'from-teal-400 to-emerald-600',
    title: 'Samurai Masa Depan',
    badge: '🛡️ PLATINUM',
    gameHighScores: {
      'cyber-runner': 320,
      'space-strike': 920,
      'block-breaker': 630,
      'neon-snake': 54,
      'cyber-2048': 512,
      'flappy-cyber': 25,
      'monster-strike': 460,
      'memory-matrix': 190
    }
  },
  {
    id: 'bot-8',
    name: 'Dimas_ArcadeKing',
    avatar: 'golden-champion',
    avatarIcon: '🏆',
    level: 4,
    xp: 850,
    totalGamesPlayed: 62,
    tier: 'Gold',
    tierColor: 'from-yellow-400 to-amber-600',
    title: 'Kolektor Skor Arkade',
    badge: '⭐ GOLD',
    gameHighScores: {
      'cyber-runner': 260,
      'space-strike': 780,
      'block-breaker': 540,
      'neon-snake': 42,
      'cyber-2048': 512,
      'flappy-cyber': 20,
      'monster-strike': 390,
      'memory-matrix': 160
    }
  },
  {
    id: 'bot-9',
    name: 'Ahmad_Gamer01',
    avatar: 'pixel-wizard',
    avatarIcon: '🧙‍♂️',
    level: 3,
    xp: 620,
    totalGamesPlayed: 45,
    tier: 'Gold',
    tierColor: 'from-yellow-400 to-amber-600',
    title: 'Penjelajah Game Baru',
    badge: '⭐ GOLD',
    gameHighScores: {
      'cyber-runner': 210,
      'space-strike': 610,
      'block-breaker': 440,
      'neon-snake': 32,
      'cyber-2048': 256,
      'flappy-cyber': 16,
      'monster-strike': 310,
      'memory-matrix': 130
    }
  },
  {
    id: 'bot-10',
    name: 'Siti_SweetGamer',
    avatar: 'pixel-paladin',
    avatarIcon: '🛡️',
    level: 2,
    xp: 410,
    totalGamesPlayed: 28,
    tier: 'Silver',
    tierColor: 'from-slate-300 to-slate-500',
    title: 'Pemain Casual Santai',
    badge: '⚔️ SILVER',
    gameHighScores: {
      'cyber-runner': 150,
      'space-strike': 420,
      'block-breaker': 320,
      'neon-snake': 22,
      'cyber-2048': 256,
      'flappy-cyber': 11,
      'monster-strike': 230,
      'memory-matrix': 90
    }
  }
];

export function getSortedLevelLeaderboard(profile: PlayerProfile): {
  leaderboard: LeaderboardPlayer[];
  playerRank: number;
  playerEntry: LeaderboardPlayer;
} {
  const activeChar = SHOP_CHARACTERS.find(c => c.id === profile.avatar) || SHOP_CHARACTERS[0];
  const { tier, tierColor, badge } = getTierFromLevel(profile.level);

  const currentPlayerEntry: Omit<LeaderboardPlayer, 'rank'> = {
    id: 'current-player',
    name: profile.name || 'Gamer Nova',
    avatar: profile.avatar,
    avatarIcon: activeChar.icon,
    level: profile.level,
    xp: profile.xp,
    totalGamesPlayed: profile.totalGamesPlayed,
    tier,
    tierColor,
    title: `Pemain ${tier} Terdaftar`,
    badge,
    isCurrentPlayer: true,
    gameHighScores: profile.highScores
  };

  const allPlayers: Omit<LeaderboardPlayer, 'rank'>[] = [
    currentPlayerEntry,
    ...BASE_LEADERBOARD_PLAYERS
  ];

  // Sort by Level descending, then XP descending, then totalGamesPlayed descending
  allPlayers.sort((a, b) => {
    if (b.level !== a.level) {
      return b.level - a.level;
    }
    if (b.xp !== a.xp) {
      return b.xp - a.xp;
    }
    return b.totalGamesPlayed - a.totalGamesPlayed;
  });

  // Assign 1-indexed ranks
  let playerRank = 1;
  let fullPlayerEntry: LeaderboardPlayer = { ...currentPlayerEntry, rank: 1 };

  const rankedLeaderboard: LeaderboardPlayer[] = allPlayers.map((p, idx) => {
    const rank = idx + 1;
    const entry: LeaderboardPlayer = {
      ...p,
      rank
    };
    if (p.isCurrentPlayer) {
      playerRank = rank;
      fullPlayerEntry = entry;
    }
    return entry;
  });

  return {
    leaderboard: rankedLeaderboard,
    playerRank,
    playerEntry: fullPlayerEntry
  };
}

export function getSortedGameScoreLeaderboard(
  gameId: string,
  profile: PlayerProfile
): {
  gameLeaderboard: {
    rank: number;
    name: string;
    avatarIcon: string;
    score: number;
    level: number;
    isCurrentPlayer?: boolean;
  }[];
  playerGameRank: number;
  playerGameScore: number;
} {
  const userScore = profile.highScores[gameId] || 0;
  const activeChar = SHOP_CHARACTERS.find(c => c.id === profile.avatar) || SHOP_CHARACTERS[0];

  const userEntry = {
    name: profile.name || 'Gamer Nova',
    avatarIcon: activeChar.icon,
    score: userScore,
    level: profile.level,
    isCurrentPlayer: true
  };

  const botEntries = BASE_LEADERBOARD_PLAYERS.map(b => ({
    name: b.name,
    avatarIcon: b.avatarIcon,
    score: b.gameHighScores?.[gameId] || 0,
    level: b.level,
    isCurrentPlayer: false
  }));

  const all = [userEntry, ...botEntries];
  all.sort((a, b) => b.score - a.score);

  let playerRank = 1;
  const ranked = all.map((entry, idx) => {
    const rank = idx + 1;
    if (entry.isCurrentPlayer) {
      playerRank = rank;
    }
    return {
      ...entry,
      rank
    };
  });

  return {
    gameLeaderboard: ranked,
    playerGameRank: playerRank,
    playerGameScore: userScore
  };
}

export const COOL_NICKNAME_IDEAS = [
  'CyberNinja', 'NeonKnight', 'PixelSlayer', 'StarLord',
  'HyperFalcon', 'ShadowBlade', 'TurboRacer', 'QuantumAce',
  'NovaChamp', 'AuraMaster', 'ApexGamer', 'ZeroStrike',
  'RajaArkade', 'BintangNova', 'MegaCyber', 'VortexKing'
];
