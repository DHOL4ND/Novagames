import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, ensureAuthUser } from './firebase';
import { PlayerProfile, LeaderboardPlayer } from '../types';
import { getTierFromLevel, BASE_LEADERBOARD_PLAYERS } from '../data/leaderboardData';
import { SHOP_CHARACTERS } from '../data/games';

export interface CloudPlayerDoc {
  id: string;
  name: string;
  avatar: string;
  avatarIcon: string;
  level: number;
  xp: number;
  coins: number;
  totalGamesPlayed: number;
  highScores: Record<string, number>;
  updatedAt?: any;
}

// Generate persistent unique device player ID
export function getLocalDeviceId(): string {
  let id = localStorage.getItem('nova_player_uid');
  if (!id) {
    id = 'player_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem('nova_player_uid', id);
  }
  return id;
}

// Sync current player profile to Firestore
export async function syncPlayerToCloud(profile: PlayerProfile): Promise<void> {
  try {
    const user = await ensureAuthUser();
    const playerId = user ? user.uid : getLocalDeviceId();
    const activeChar = SHOP_CHARACTERS.find(c => c.id === profile.avatar) || SHOP_CHARACTERS[0];

    const playerRef = doc(db, 'players', playerId);
    await setDoc(
      playerRef,
      {
        id: playerId,
        name: profile.name || 'Gamer Nova',
        avatar: profile.avatar || 'cyber-samurai',
        avatarIcon: activeChar.icon || '⚔️',
        level: Number(profile.level) || 1,
        xp: Number(profile.xp) || 0,
        coins: Number(profile.coins) || 0,
        totalGamesPlayed: Number(profile.totalGamesPlayed) || 0,
        highScores: profile.highScores || {},
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore sync player warning:', err);
  }
}

// Subscribe to real-time online global players leaderboard
export function subscribeToOnlineLeaderboard(
  currentProfile: PlayerProfile,
  onUpdate: (data: {
    leaderboard: LeaderboardPlayer[];
    playerRank: number;
    playerEntry: LeaderboardPlayer;
    isLiveCloud: boolean;
  }) => void
): () => void {
  const currentUid = localStorage.getItem('nova_player_uid') || 'current-player';
  const playersRef = collection(db, 'players');
  const q = query(playersRef, orderBy('level', 'desc'), orderBy('xp', 'desc'), limit(100));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const cloudPlayers: CloudPlayerDoc[] = [];
      snapshot.forEach((docSnap) => {
        cloudPlayers.push(docSnap.data() as CloudPlayerDoc);
      });

      const activeChar = SHOP_CHARACTERS.find(c => c.id === currentProfile.avatar) || SHOP_CHARACTERS[0];
      const { tier, tierColor, badge } = getTierFromLevel(currentProfile.level);

      // Current player entry
      const currentPlayerEntry: Omit<LeaderboardPlayer, 'rank'> = {
        id: currentUid,
        name: currentProfile.name || 'Gamer Nova',
        avatar: currentProfile.avatar,
        avatarIcon: activeChar.icon,
        level: currentProfile.level,
        xp: currentProfile.xp,
        totalGamesPlayed: currentProfile.totalGamesPlayed,
        tier,
        tierColor,
        title: `Pemain ${tier} Online`,
        badge,
        isCurrentPlayer: true,
        gameHighScores: currentProfile.highScores
      };

      // Combine cloud players with current player and seed bots if cloud player count is small
      const playerMap = new Map<string, Omit<LeaderboardPlayer, 'rank'>>();

      // 1. Add base seed bots
      BASE_LEADERBOARD_PLAYERS.forEach((bot) => {
        playerMap.set(bot.id, bot);
      });

      // 2. Add all real players from Firestore
      cloudPlayers.forEach((cp) => {
        const isCurrent = cp.id === currentUid || (currentProfile.name && cp.name === currentProfile.name);
        const { tier: t, tierColor: tc, badge: b } = getTierFromLevel(cp.level || 1);
        const charIcon = cp.avatarIcon || '🎮';

        playerMap.set(cp.id, {
          id: cp.id,
          name: cp.name || 'Pemain Online',
          avatar: cp.avatar || 'cyber-samurai',
          avatarIcon: charIcon,
          level: cp.level || 1,
          xp: cp.xp || 0,
          totalGamesPlayed: cp.totalGamesPlayed || 0,
          tier: t,
          tierColor: tc,
          title: `Pemain ${t} Online`,
          badge: b,
          isCurrentPlayer: isCurrent,
          gameHighScores: cp.highScores || {}
        });
      });

      // 3. Ensure current player is updated
      playerMap.set(currentUid, currentPlayerEntry);

      // Convert to array and sort
      const allPlayers = Array.from(playerMap.values());
      allPlayers.sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        if (b.xp !== a.xp) return b.xp - a.xp;
        return b.totalGamesPlayed - a.totalGamesPlayed;
      });

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

      onUpdate({
        leaderboard: rankedLeaderboard,
        playerRank,
        playerEntry: fullPlayerEntry,
        isLiveCloud: true
      });
    },
    (error) => {
      console.warn('Leaderboard realtime snapshot error:', error);
    }
  );

  return unsubscribe;
}
