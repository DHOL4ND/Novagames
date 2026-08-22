import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, ensureAuthUser } from './firebase';
import { MultiplayerRoom, PlayerProfile, RoomPlayer } from '../types';
import { getLocalDeviceId } from './cloudLeaderboard';
import { SHOP_CHARACTERS } from '../data/games';

// Generate 4-character easy alphanumeric room code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new multiplayer room
export async function createMultiplayerRoom(
  gameId: string,
  profile: PlayerProfile
): Promise<MultiplayerRoom> {
  const user = await ensureAuthUser();
  const playerId = user ? user.uid : getLocalDeviceId();
  const code = generateRoomCode();
  const roomId = `ROOM_${code}`;
  const char = SHOP_CHARACTERS.find(c => c.id === profile.avatar) || SHOP_CHARACTERS[0];

  const hostPlayer: RoomPlayer = {
    id: playerId,
    name: profile.name || 'Pemain 1',
    avatar: profile.avatar || 'cyber-samurai',
    avatarIcon: char.icon || '⚔️',
    level: profile.level || 1,
    isHost: true,
    ready: true,
    score: 0,
    paddleY: 0.5,
    connectedAt: Date.now(),
    lastPing: Date.now()
  };

  const newRoom: MultiplayerRoom = {
    id: roomId,
    code,
    gameId,
    status: 'waiting',
    hostId: playerId,
    players: {
      [playerId]: hostPlayer
    },
    ball: {
      x: 50,
      y: 50,
      vx: 0.45 * (Math.random() > 0.5 ? 1 : -1),
      vy: 0.25 * (Math.random() > 0.5 ? 1 : -1),
      speed: 1,
      isFireball: false
    },
    score1: 0,
    score2: 0,
    maxScore: 5,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const roomRef = doc(db, 'multiplayer_rooms', roomId);
  await setDoc(roomRef, newRoom);

  return newRoom;
}

// Join room by 4-digit code
export async function joinMultiplayerRoomByCode(
  code: string,
  profile: PlayerProfile
): Promise<{ success: boolean; room?: MultiplayerRoom; error?: string }> {
  const cleanCode = code.trim().toUpperCase();
  const roomId = `ROOM_${cleanCode}`;
  const roomRef = doc(db, 'multiplayer_rooms', roomId);

  try {
    const snap = await getDoc(roomRef);
    if (!snap.exists()) {
      return { success: false, error: `Kamar dengan kode "${cleanCode}" tidak ditemukan.` };
    }

    const roomData = snap.data() as MultiplayerRoom;
    const playerKeys = Object.keys(roomData.players || {});

    const user = await ensureAuthUser();
    const playerId = user ? user.uid : getLocalDeviceId();

    // If player already in room, allow rejoin
    if (roomData.players[playerId]) {
      return { success: true, room: roomData };
    }

    // Check if full
    if (playerKeys.length >= 2) {
      return { success: false, error: 'Kamar ini sudah penuh (Maksimal 2 Pemain).' };
    }

    const char = SHOP_CHARACTERS.find(c => c.id === profile.avatar) || SHOP_CHARACTERS[0];
    const guestPlayer: RoomPlayer = {
      id: playerId,
      name: profile.name || 'Pemain 2',
      avatar: profile.avatar || 'pixel-wizard',
      avatarIcon: char.icon || '🧙‍♂️',
      level: profile.level || 1,
      isHost: false,
      ready: true,
      score: 0,
      paddleY: 0.5,
      connectedAt: Date.now(),
      lastPing: Date.now()
    };

    const updatedPlayers = {
      ...roomData.players,
      [playerId]: guestPlayer
    };

    await updateDoc(roomRef, {
      players: updatedPlayers,
      status: 'starting',
      updatedAt: Date.now()
    });

    return {
      success: true,
      room: {
        ...roomData,
        players: updatedPlayers,
        status: 'starting'
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal terhubung ke kamar.' };
  }
}

// Find open public room or create one
export async function quickMatchmake(
  gameId: string,
  profile: PlayerProfile
): Promise<{ room: MultiplayerRoom; isHost: boolean }> {
  try {
    const roomsRef = collection(db, 'multiplayer_rooms');
    const q = query(
      roomsRef,
      where('gameId', '==', gameId),
      where('status', '==', 'waiting'),
      limit(5)
    );

    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      const room = docSnap.data() as MultiplayerRoom;
      const count = Object.keys(room.players || {}).length;
      if (count === 1) {
        const joinRes = await joinMultiplayerRoomByCode(room.code, profile);
        if (joinRes.success && joinRes.room) {
          return { room: joinRes.room, isHost: false };
        }
      }
    }
  } catch (e) {
    console.warn('Quick match lookup warning:', e);
  }

  // Otherwise create new room
  const newRoom = await createMultiplayerRoom(gameId, profile);
  return { room: newRoom, isHost: true };
}

// Subscribe to room updates
export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: MultiplayerRoom | null) => void
): () => void {
  const roomRef = doc(db, 'multiplayer_rooms', roomId);
  return onSnapshot(
    roomRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as MultiplayerRoom);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn('Room subscription error:', err);
    }
  );
}

// Update player paddle position
export async function updatePaddlePosition(
  roomId: string,
  playerId: string,
  paddleY: number
): Promise<void> {
  const roomRef = doc(db, 'multiplayer_rooms', roomId);
  try {
    await updateDoc(roomRef, {
      [`players.${playerId}.paddleY`]: paddleY,
      [`players.${playerId}.lastPing`]: Date.now()
    });
  } catch (err) {
    // Ignore transient network hiccups
  }
}

// Host updates ball physics and scores
export async function hostUpdateGameState(
  roomId: string,
  updates: Partial<MultiplayerRoom>
): Promise<void> {
  const roomRef = doc(db, 'multiplayer_rooms', roomId);
  try {
    await updateDoc(roomRef, {
      ...updates,
      updatedAt: Date.now()
    });
  } catch (err) {
    console.warn('Host update error:', err);
  }
}

// Leave room
export async function leaveRoom(roomId: string, playerId: string): Promise<void> {
  const roomRef = doc(db, 'multiplayer_rooms', roomId);
  try {
    const snap = await getDoc(roomRef);
    if (snap.exists()) {
      const room = snap.data() as MultiplayerRoom;
      if (room.hostId === playerId) {
        // If host leaves, delete room or mark ended
        await deleteDoc(roomRef);
      } else {
        const newPlayers = { ...room.players };
        delete newPlayers[playerId];
        await updateDoc(roomRef, {
          players: newPlayers,
          status: 'waiting'
        });
      }
    }
  } catch (e) {
    console.warn('Leave room error:', e);
  }
}
