import React, { useState, useEffect, useRef } from 'react';
import { MultiplayerRoom, PlayerProfile, RoomPlayer } from '../types';
import {
  createMultiplayerRoom,
  joinMultiplayerRoomByCode,
  quickMatchmake,
  subscribeToRoom,
  updatePaddlePosition,
  hostUpdateGameState,
  leaveRoom
} from '../lib/multiplayerService';
import { getLocalDeviceId } from '../lib/cloudLeaderboard';
import { sound } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/storage';
import {
  ArrowLeft,
  Copy,
  Check,
  Flame,
  Globe,
  Play,
  Radio,
  RefreshCw,
  Share2,
  Shield,
  Swords,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  Zap,
  Sparkles
} from 'lucide-react';

interface NeonPongGameProps {
  profile: PlayerProfile;
  onExit: () => void;
  onGameOver: (gameId: string, score: number, coins: number) => void;
  onNotify: (title: string, desc: string, icon?: string) => void;
}

export const NeonPongGame: React.FC<NeonPongGameProps> = ({
  profile,
  onExit,
  onGameOver,
  onNotify
}) => {
  // Lobby states: 'menu' | 'waiting' | 'playing' | 'gameover'
  const [gameState, setGameState] = useState<'menu' | 'waiting' | 'playing' | 'gameover'>('menu');
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Play Mode: 'online' vs 'bot'
  const [isBotMode, setIsBotMode] = useState(false);

  // Game coordinates & physics
  const [myPaddleY, setMyPaddleY] = useState(50); // 0 to 100 percentage
  const [opponentPaddleY, setOpponentPaddleY] = useState(50);
  const [ball, setBall] = useState<{ x: number; y: number; isFireball: boolean }>({
    x: 50,
    y: 50,
    isFireball: false
  });
  const [scores, setScores] = useState<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const [isWinner, setIsWinner] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const myPlayerId = getLocalDeviceId();

  // Determine if this client is Player 1 (Host/Left) or Player 2 (Guest/Right)
  const isHost = room ? room.hostId === myPlayerId : true;
  const isPlayer1 = isHost || isBotMode;

  const playerKeys = room ? Object.keys(room.players) : [];
  const hostPlayer = room && room.players[room.hostId] ? room.players[room.hostId] : null;
  const guestId = room ? playerKeys.find((id) => id !== room.hostId) : null;
  const guestPlayer = room && guestId ? room.players[guestId] : null;

  const myPlayerInfo = isHost ? hostPlayer : guestPlayer;
  const opponentPlayerInfo = isHost ? guestPlayer : hostPlayer;

  // Subscribe to room realtime updates
  useEffect(() => {
    if (!room?.id || isBotMode) return;

    const unsub = subscribeToRoom(room.id, (updatedRoom) => {
      if (!updatedRoom) {
        if (gameState === 'playing' || gameState === 'waiting') {
          setErrorMsg('Lawan telah meninggalkan arena mabar.');
          setGameState('menu');
        }
        return;
      }

      setRoom(updatedRoom);
      const pCount = Object.keys(updatedRoom.players || {}).length;

      // Handle room transition to playing
      if (updatedRoom.status === 'starting' && gameState === 'waiting') {
        sound.playPowerup();
        setCountdown(3);
      }

      // Sync opponent paddle position
      if (!isHost && hostPlayer?.paddleY !== undefined) {
        setOpponentPaddleY(hostPlayer.paddleY * 100);
      } else if (isHost && guestPlayer?.paddleY !== undefined) {
        setOpponentPaddleY(guestPlayer.paddleY * 100);
      }

      // Sync ball and scores from host if guest
      if (!isHost && updatedRoom.ball) {
        setBall({
          x: updatedRoom.ball.x,
          y: updatedRoom.ball.y,
          isFireball: !!updatedRoom.ball.isFireball
        });
        setScores({ p1: updatedRoom.score1, p2: updatedRoom.score2 });
      }

      // Check win status
      if (updatedRoom.status === 'ended') {
        const won = updatedRoom.winnerId === myPlayerId;
        setIsWinner(won);
        setGameState('gameover');
        if (won) {
          fireCelebrationConfetti();
          sound.playPowerup();
          onGameOver('neon-pong-duel', 500, 50);
        } else {
          sound.playGameOver();
          onGameOver('neon-pong-duel', 150, 15);
        }
      }
    });

    return () => unsub();
  }, [room?.id, isHost, myPlayerId, isBotMode, gameState]);

  // Countdown timer before starting
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => {
        sound.playClick();
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(t);
    } else {
      setCountdown(null);
      setGameState('playing');
      if (isHost && room) {
        hostUpdateGameState(room.id, { status: 'playing' });
      }
    }
  }, [countdown, isHost, room]);

  // Handle paddle movement input (Touch / Mouse / Keyboard)
  const handleMovePaddle = (clientY: number) => {
    if (!canvasRef.current || gameState !== 'playing') return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const percentage = Math.max(10, Math.min(90, (relativeY / rect.height) * 100));

    setMyPaddleY(percentage);

    if (!isBotMode && room?.id) {
      updatePaddlePosition(room.id, myPlayerId, percentage / 100);
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setMyPaddleY((prev) => {
          const next = Math.max(10, prev - 6);
          if (!isBotMode && room?.id) updatePaddlePosition(room.id, myPlayerId, next / 100);
          return next;
        });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setMyPaddleY((prev) => {
          const next = Math.min(90, prev + 6);
          if (!isBotMode && room?.id) updatePaddlePosition(room.id, myPlayerId, next / 100);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isBotMode, room?.id, myPlayerId]);

  // Physics simulation loop (Only run by Host or in Bot Mode for single-authority collision)
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!isHost && !isBotMode) return;

    let ballX = 50;
    let ballY = 50;
    let vx = (Math.random() > 0.5 ? 0.7 : -0.7);
    let vy = (Math.random() - 0.5) * 0.8;
    let speed = 1.0;
    let isFire = false;
    let scoreP1 = scores.p1;
    let scoreP2 = scores.p2;
    const maxScore = 5;

    let botY = 50;

    const interval = setInterval(() => {
      // Bot AI logic if in Bot Mode
      if (isBotMode) {
        const targetY = ballY;
        const diff = targetY - botY;
        botY += Math.sign(diff) * Math.min(Math.abs(diff), 1.2);
        setOpponentPaddleY(botY);
      }

      // Update ball
      ballX += vx * speed;
      ballY += vy * speed;

      // Top & Bottom Wall collision
      if (ballY <= 4) {
        ballY = 4;
        vy = -vy;
        sound.playJump();
      } else if (ballY >= 96) {
        ballY = 96;
        vy = -vy;
        sound.playJump();
      }

      // Paddle Left (Player 1 / Host)
      const p1Y = isPlayer1 ? myPaddleY : opponentPaddleY;
      const p2Y = !isPlayer1 ? myPaddleY : opponentPaddleY;

      // Check Left Paddle Collision (x around 5%)
      if (ballX <= 7 && ballX >= 3) {
        if (Math.abs(ballY - p1Y) <= 12) {
          ballX = 7.1;
          const hitOffset = (ballY - p1Y) / 12; // -1 to 1
          vy = hitOffset * 0.9;
          vx = Math.abs(vx) * 1.05; // speed up slightly
          speed = Math.min(speed + 0.04, 2.2);
          isFire = speed > 1.4;
          sound.playLaser();
        }
      }

      // Check Right Paddle Collision (x around 95%)
      if (ballX >= 93 && ballX <= 97) {
        if (Math.abs(ballY - p2Y) <= 12) {
          ballX = 92.9;
          const hitOffset = (ballY - p2Y) / 12;
          vy = hitOffset * 0.9;
          vx = -Math.abs(vx) * 1.05;
          speed = Math.min(speed + 0.04, 2.2);
          isFire = speed > 1.4;
          sound.playLaser();
        }
      }

      // Left Goal (Player 2 scores)
      if (ballX < 0) {
        scoreP2 += 1;
        sound.playCoin();
        ballX = 50;
        ballY = 50;
        vx = 0.7;
        vy = (Math.random() - 0.5) * 0.6;
        speed = 1.0;
        isFire = false;
        setScores({ p1: scoreP1, p2: scoreP2 });

        if (scoreP2 >= maxScore) {
          const winner = isPlayer1 ? 'p2' : 'p1';
          handleEndMatch(winner === 'p1' ? (isHost ? myPlayerId : guestId || '') : (isHost ? guestId || '' : myPlayerId));
          return;
        }
      }

      // Right Goal (Player 1 scores)
      if (ballX > 100) {
        scoreP1 += 1;
        sound.playCoin();
        ballX = 50;
        ballY = 50;
        vx = -0.7;
        vy = (Math.random() - 0.5) * 0.6;
        speed = 1.0;
        isFire = false;
        setScores({ p1: scoreP1, p2: scoreP2 });

        if (scoreP1 >= maxScore) {
          const winner = isPlayer1 ? 'p1' : 'p2';
          handleEndMatch(winner === 'p1' ? (isHost ? myPlayerId : guestId || '') : (isHost ? guestId || '' : myPlayerId));
          return;
        }
      }

      // Update local state
      setBall({ x: ballX, y: ballY, isFireball: isFire });

      // If online host, sync state to Firebase
      if (!isBotMode && room?.id) {
        hostUpdateGameState(room.id, {
          ball: {
            x: ballX,
            y: ballY,
            vx,
            vy,
            speed,
            isFireball: isFire
          },
          score1: scoreP1,
          score2: scoreP2
        });
      }
    }, 1000 / 60);

    const handleEndMatch = (winPlayerId: string) => {
      clearInterval(interval);
      const isMe = winPlayerId === myPlayerId || (isBotMode && scoreP1 >= maxScore);
      setIsWinner(isMe);
      setGameState('gameover');

      if (!isBotMode && room?.id) {
        hostUpdateGameState(room.id, {
          status: 'ended',
          winnerId: winPlayerId,
          winnerName: isMe ? profile.name : opponentPlayerInfo?.name || 'Lawan'
        });
      }

      if (isMe) {
        fireCelebrationConfetti();
        sound.playPowerup();
        onGameOver('neon-pong-duel', 500, 50);
      } else {
        sound.playGameOver();
        onGameOver('neon-pong-duel', 150, 15);
      }
    };

    return () => clearInterval(interval);
  }, [gameState, isHost, isBotMode, myPaddleY, opponentPaddleY, scores, room?.id, myPlayerId, isPlayer1, guestId, profile.name, opponentPlayerInfo?.name]);

  // Create room handler
  const handleCreateRoom = async () => {
    setErrorMsg(null);
    setIsSearching(true);
    sound.playClick();
    try {
      const newRoom = await createMultiplayerRoom('neon-pong-duel', profile);
      setRoom(newRoom);
      setIsBotMode(false);
      setGameState('waiting');
    } catch (err: any) {
      setErrorMsg('Gagal membuat room. Silakan coba lagi.');
    } finally {
      setIsSearching(false);
    }
  };

  // Join room by code handler
  const handleJoinRoom = async () => {
    if (!inputCode.trim()) {
      setErrorMsg('Masukkan 4-digit kode kamar.');
      return;
    }
    setErrorMsg(null);
    setIsSearching(true);
    sound.playClick();
    try {
      const res = await joinMultiplayerRoomByCode(inputCode, profile);
      if (res.success && res.room) {
        setRoom(res.room);
        setIsBotMode(false);
        setGameState('waiting');
      } else {
        setErrorMsg(res.error || 'Kamar tidak ditemukan.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal bergabung.');
    } finally {
      setIsSearching(false);
    }
  };

  // Quick matchmaking handler
  const handleQuickMatch = async () => {
    setErrorMsg(null);
    setIsSearching(true);
    sound.playClick();
    try {
      const res = await quickMatchmake('neon-pong-duel', profile);
      setRoom(res.room);
      setIsBotMode(false);
      setGameState('waiting');
    } catch (e: any) {
      setErrorMsg('Gagal mencari lawan. Coba buat kamar baru.');
    } finally {
      setIsSearching(false);
    }
  };

  // Play vs Bot (offline / practice)
  const handlePlayBot = () => {
    sound.playClick();
    setIsBotMode(true);
    setScores({ p1: 0, p2: 0 });
    setGameState('waiting');
    setCountdown(3);
  };

  // Copy room code
  const handleCopyCode = () => {
    if (!room?.code) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    sound.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuitRoom = async () => {
    sound.playClick();
    if (room?.id && !isBotMode) {
      await leaveRoom(room.id, myPlayerId);
    }
    setRoom(null);
    setGameState('menu');
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-3 sm:p-6 select-none font-sans">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 backdrop-blur-md px-4 py-3 rounded-2xl mb-4 shadow-xl">
        <button
          onClick={() => {
            sound.playClick();
            if (gameState !== 'menu') {
              handleQuitRoom();
            } else {
              onExit();
            }
          }}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{gameState === 'menu' ? 'Kembali ke Arcade' : 'Tinggalkan Mabar'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Neon Pong Duel</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                1v1 PvP
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {isBotMode ? 'Mode Latihan AI Bot' : 'Mode Mabar Online Real-Time'}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>{isBotMode ? 'BOT OFFLINE' : 'CLOUD LIVE'}</span>
        </div>
      </div>

      {/* ======================= VIEW 1: LOBBY MENU ======================= */}
      {gameState === 'menu' && (
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-lg mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black tracking-wider mb-3 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ARENA DUEL MULTIPLAYER ONLINE
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Tantang Teman & Lawan Online!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Mainkan duel tenis meja neon kecepatan tinggi secara langsung. Siapa yang mencapai 5 poin duluan menjadi pemenang dan membawa pulang koin bonus!
            </p>
          </div>

          {errorMsg && (
            <div className="max-w-md mx-auto mb-6 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs text-center font-bold">
              {errorMsg}
            </div>
          )}

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Card 1: Quick Match & Buat Kamar */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-rose-500/50 transition-all">
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Cari Lawan / Buat Kamar</span>
                </div>
                <p className="text-xs text-slate-400">
                  Buat kode kamar baru untuk dikirim ke teman, atau cari lawan pemain online secara acak.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  id="btn-quick-match"
                  onClick={handleQuickMatch}
                  disabled={isSearching}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
                >
                  {isSearching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  <span>{isSearching ? 'Menghubungkan...' : '⚡ Matchmaking Otomatis'}</span>
                </button>

                <button
                  id="btn-create-room"
                  onClick={handleCreateRoom}
                  disabled={isSearching}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buat Kamar Privat (Dapat Kode)</span>
                </button>
              </div>
            </div>

            {/* Card 2: Gabung Kamar Teman */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                  <KeypadIcon className="w-4 h-4" />
                  <span>Gabung Kode Kamar Teman</span>
                </div>
                <p className="text-xs text-slate-400">
                  Punya kode kamar dari temanmu? Masukkan 4 karakter kode di bawah untuk langsung duel.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    id="input-room-code"
                    type="text"
                    maxLength={4}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="KODE (cth: 8F2A)"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-center font-mono font-black text-amber-300 text-base tracking-widest uppercase outline-none"
                  />
                  <button
                    id="btn-join-room"
                    onClick={handleJoinRoom}
                    disabled={isSearching || inputCode.length < 2}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer transition-all disabled:opacity-40 whitespace-nowrap"
                  >
                    Gabung
                  </button>
                </div>

                <button
                  id="btn-bot-mode"
                  onClick={handlePlayBot}
                  className="w-full py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-semibold border border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>Main Latihan Melawan Bot AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Player Banner Badge */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between max-w-2xl mx-auto text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-xl">{profile.avatar ? '🥷' : '⚔️'}</span>
              <div>
                <span className="text-white font-bold">{profile.name}</span>
                <span className="ml-2 font-mono text-amber-400 font-bold">Lv. {profile.level}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sistem Matchmaking Firebase Aktif</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================= VIEW 2: WAITING ROOM ======================= */}
      {gameState === 'waiting' && (
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center max-w-xl mx-auto">
          {countdown !== null ? (
            <div className="py-12 space-y-4">
              <div className="text-6xl sm:text-8xl font-black font-mono text-amber-400 animate-bounce">
                {countdown === 0 ? 'GO!' : countdown}
              </div>
              <p className="text-sm font-bold text-white uppercase tracking-widest">
                Pertandingan Segera Dimulai!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-rose-500/30">
                <Users className="w-8 h-8 text-white" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Menunggu Lawan Masuk...
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Bagikan kode kamar ini ke temanmu agar mereka bisa bergabung!
                </p>
              </div>

              {/* Room Code Card */}
              {room?.code && (
                <div className="bg-slate-950/80 border-2 border-dashed border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 max-w-xs mx-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Kode Kamar Mabar:
                  </span>
                  <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-widest">
                    {room.code}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                  </button>
                </div>
              )}

              {/* Slot Pemain */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center gap-2">
                  <span className="text-2xl">{myPlayerInfo?.avatarIcon || '⚔️'}</span>
                  <div>
                    <div className="text-xs font-bold text-white truncate">{myPlayerInfo?.name}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">● Siap Bertanding</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 border-dashed flex flex-col items-center justify-center gap-2 text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400/60" />
                  <div className="text-[11px] font-bold text-slate-400">Menunggu Lawan...</div>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handleQuitRoom}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handlePlayBot}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                >
                  Main Lawan Bot Saja
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= VIEW 3: ACTIVE PLAYING ARENA ======================= */}
      {gameState === 'playing' && (
        <div className="w-full flex flex-col items-center">
          {/* Top Scoreboard */}
          <div className="w-full max-w-3xl flex items-center justify-between bg-slate-900/90 border border-slate-800 px-6 py-3 rounded-2xl mb-3 shadow-lg">
            {/* Player 1 (Left) */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">{isPlayer1 ? myPlayerInfo?.avatarIcon || '⚔️' : opponentPlayerInfo?.avatarIcon || '🤖'}</span>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[100px] sm:max-w-[150px]">
                  {isPlayer1 ? myPlayerInfo?.name : opponentPlayerInfo?.name || 'Bot AI'}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono font-bold">
                  {isPlayer1 ? 'Kamu (Kiri)' : 'Lawan'}
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 bg-slate-950/80 px-5 py-2 rounded-xl border border-slate-800">
              <span className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">{scores.p1}</span>
              <span className="text-xs text-slate-600 font-bold">:</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-rose-400">{scores.p2}</span>
            </div>

            {/* Player 2 (Right) */}
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[100px] sm:max-w-[150px]">
                  {!isPlayer1 ? myPlayerInfo?.name : isBotMode ? 'Cyber Bot AI' : opponentPlayerInfo?.name || 'Lawan'}
                </div>
                <div className="text-[10px] text-rose-400 font-mono font-bold">
                  {!isPlayer1 ? 'Kamu (Kanan)' : 'Lawan'}
                </div>
              </div>
              <span className="text-3xl">{!isPlayer1 ? myPlayerInfo?.avatarIcon || '⚔️' : isBotMode ? '🤖' : opponentPlayerInfo?.avatarIcon || '🥷'}</span>
            </div>
          </div>

          {/* Interactive Game Canvas Box */}
          <div
            ref={canvasRef}
            onMouseMove={(e) => handleMovePaddle(e.clientY)}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handleMovePaddle(e.touches[0].clientY);
              }
            }}
            className="relative w-full max-w-3xl aspect-[16/9] bg-slate-950 border-2 border-indigo-500/40 rounded-3xl overflow-hidden shadow-2xl touch-none cursor-ns-resize select-none"
          >
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b15_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b15_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            {/* Center Net Divider */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 border-r border-dashed border-indigo-500/30" />

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-indigo-500/20 pointer-events-none" />

            {/* Left Paddle (Player 1) */}
            <div
              className="absolute left-3 w-3 h-[20%] rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[0_0_15px_#06b6d4] transition-all duration-75 -translate-y-1/2"
              style={{ top: `${isPlayer1 ? myPaddleY : opponentPaddleY}%` }}
            />

            {/* Right Paddle (Player 2) */}
            <div
              className="absolute right-3 w-3 h-[20%] rounded-full bg-gradient-to-b from-rose-400 to-amber-500 shadow-[0_0_15px_#f43f5e] transition-all duration-75 -translate-y-1/2"
              style={{ top: `${!isPlayer1 ? myPaddleY : opponentPaddleY}%` }}
            />

            {/* Neon Ball */}
            <div
              className={`absolute w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${
                ball.isFireball
                  ? 'bg-gradient-to-tr from-amber-400 to-red-500 shadow-[0_0_20px_#ef4444] animate-pulse'
                  : 'bg-white shadow-[0_0_15px_#ffffff]'
              }`}
              style={{
                left: `${ball.x}%`,
                top: `${ball.y}%`
              }}
            >
              {ball.isFireball && (
                <Flame className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
              )}
            </div>

            {/* Touch Control Overlay Hint */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-semibold bg-slate-900/60 px-3 py-1 rounded-full pointer-events-none">
              Geser mouse / sentuh layar ke atas & bawah untuk menggerakkan paddle
            </div>
          </div>
        </div>
      )}

      {/* ======================= VIEW 4: GAME OVER / RESULT ======================= */}
      {gameState === 'gameover' && (
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30">
            {isWinner ? '🏆' : '💀'}
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {isWinner ? '🎉 KAMU MENANG DUEL!' : 'KAMU KALAH!'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isWinner
                ? 'Luar biasa! Refleks dan taktikmu mengantarkan kemenangan telak!'
                : 'Pertandingan yang sengit! Ayo balas dendam di ronde berikutnya!'}
            </p>
          </div>

          {/* Final Score Table */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skor Akhir</div>
            <div className="text-3xl font-mono font-black text-amber-400">
              {scores.p1} - {scores.p2}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>Hadiah Bonus XP & Koin:</span>
              <span className="font-mono font-bold text-amber-400">
                {isWinner ? '+500 XP | +50 🪙' : '+150 XP | +15 🪙'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleQuitRoom}
              className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
            >
              Kembali ke Menu
            </button>
            <button
              onClick={() => {
                if (isBotMode) {
                  handlePlayBot();
                } else {
                  handleQuickMatch();
                }
              }}
              className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs cursor-pointer shadow-md"
            >
              Main Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function KeypadIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01" />
    </svg>
  );
}
