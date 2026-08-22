import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Clock, Play, RotateCcw, Sparkles } from 'lucide-react';

interface MonsterStrikeProps {
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate?: (score: number) => void;
}

interface Mole {
  id: number;
  active: boolean;
  type: 'normal' | 'gold' | 'bomb';
  timer: number;
}

export const MonsterStrike: React.FC<MonsterStrikeProps> = ({ onGameOver, onScoreUpdate }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i, active: false, type: 'normal', timer: 0 }))
  );
  const [hitEffects, setHitEffects] = useState<{ id: number; text: string; color: string; x: number; y: number }[]>([]);

  const stateRef = useRef({
    score: 0,
    coins: 0,
    combo: 0,
    timeLeft: 30,
    moles: Array.from({ length: 9 }, (_, i) => ({ id: i, active: false, type: 'normal', timer: 0 })) as Mole[],
    running: false
  });

  const startGame = useCallback(() => {
    stateRef.current.score = 0;
    stateRef.current.coins = 0;
    stateRef.current.combo = 0;
    stateRef.current.timeLeft = 30;
    stateRef.current.running = true;
    stateRef.current.moles = Array.from({ length: 9 }, (_, i) => ({ id: i, active: false, type: 'normal', timer: 0 }));

    setScore(0);
    setCoins(0);
    setCombo(0);
    setTimeLeft(30);
    setMoles(stateRef.current.moles);
    setGameState('playing');
    sound.playClick();
  }, []);

  const handleWhack = (index: number) => {
    if (gameState !== 'playing') return;
    const mole = stateRef.current.moles[index];
    if (!mole.active) return;

    // Despawn mole immediately
    mole.active = false;
    mole.timer = 0;

    let pts = 0;
    if (mole.type === 'gold') {
      pts = 60;
      stateRef.current.coins += 2;
      setCoins(stateRef.current.coins);
      stateRef.current.combo++;
      sound.playCoin();
    } else if (mole.type === 'normal') {
      pts = 25;
      stateRef.current.combo++;
      sound.playHit();
    } else {
      // Bomb!
      pts = -40;
      stateRef.current.combo = 0;
      sound.playExplosion();
    }

    const comboBonus = stateRef.current.combo > 2 ? stateRef.current.combo * 5 : 0;
    stateRef.current.score = Math.max(0, stateRef.current.score + pts + comboBonus);

    setScore(stateRef.current.score);
    setCombo(stateRef.current.combo);
    setMoles([...stateRef.current.moles]);
    if (onScoreUpdate) onScoreUpdate(stateRef.current.score);

    // Floating text feedback
    const hitId = Date.now() + Math.random();
    setHitEffects(prev => [
      ...prev,
      {
        id: hitId,
        text: mole.type === 'bomb' ? '-40 💥' : `+${pts + comboBonus}`,
        color: mole.type === 'bomb' ? 'text-rose-500' : mole.type === 'gold' ? 'text-amber-400' : 'text-cyan-400',
        x: (index % 3) * 33 + 16,
        y: Math.floor(index / 3) * 33 + 16
      }
    ]);

    setTimeout(() => {
      setHitEffects(prev => prev.filter(h => h.id !== hitId));
    }, 600);
  };

  // Game Loop Timer & Mole Spawner
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const s = stateRef.current;
      if (!s.running) return;

      // Randomly spawn 1-2 moles in inactive holes
      const inactive = s.moles.filter(m => !m.active);
      if (inactive.length > 0) {
        const pick = inactive[Math.floor(Math.random() * inactive.length)];
        const rand = Math.random();
        pick.type = rand < 0.2 ? 'gold' : rand < 0.4 ? 'bomb' : 'normal';
        pick.active = true;
        pick.timer = pick.type === 'gold' ? 14 : 22; // shorter timer for gold
      }

      // Decrement timers of active moles
      s.moles.forEach(m => {
        if (m.active) {
          m.timer--;
          if (m.timer <= 0) {
            m.active = false;
            // If missed a regular monster, combo drops
            if (m.type === 'normal') {
              s.combo = 0;
              setCombo(0);
            }
          }
        }
      });

      setMoles([...s.moles]);
    }, 100);

    const clockInterval = setInterval(() => {
      const s = stateRef.current;
      if (!s.running) return;

      s.timeLeft--;
      setTimeLeft(s.timeLeft);

      if (s.timeLeft <= 0) {
        s.running = false;
        setGameState('gameover');
        sound.playVictory();
        onGameOver(s.score, s.coins);
      }
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(clockInterval);
    };
  }, [gameState, onGameOver, onScoreUpdate]);

  // Keyboard 1-9 shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if (e.code === 'Space' || e.key === 'Enter') {
          startGame();
        }
        return;
      }
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        // Map 1-9 (numpad or top keys)
        handleWhack(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame]);

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 border border-fuchsia-500/30 rounded-t-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="text-fuchsia-400 font-mono font-bold text-base">
            Skor: {score}
          </div>
          <div className="text-amber-400 font-mono font-bold text-sm">
            🪙 {coins}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40 rounded-full animate-pulse">
              <Sparkles className="w-3 h-3" /> x{combo}
            </div>
          )}
          <div className={`flex items-center gap-1 font-mono font-bold text-sm ${timeLeft <= 5 ? 'text-rose-500 animate-ping' : 'text-slate-300'}`}>
            <Clock className="w-3.5 h-3.5" /> {timeLeft}s
          </div>
        </div>
      </div>

      {/* 3x3 Arena Grid */}
      <div className="relative w-full aspect-square bg-slate-950 p-3 rounded-b-xl border border-t-0 border-fuchsia-500/30 grid grid-cols-3 gap-3 shadow-2xl shadow-fuchsia-950/40">
        {moles.map((mole, idx) => (
          <button
            key={mole.id}
            id={`btn-mole-${idx}`}
            onClick={() => handleWhack(idx)}
            className={`relative rounded-2xl border flex items-center justify-center transition-all transform active:scale-90 cursor-pointer overflow-hidden ${
              mole.active
                ? mole.type === 'gold'
                  ? 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/40 scale-95'
                  : mole.type === 'bomb'
                  ? 'bg-rose-950/70 border-rose-500 shadow-lg shadow-rose-500/40 scale-95'
                  : 'bg-fuchsia-950/70 border-fuchsia-400 shadow-lg shadow-fuchsia-500/40 scale-95'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Mole content */}
            {mole.active ? (
              <div className="flex flex-col items-center animate-bounce">
                <span className="text-3xl sm:text-4xl">
                  {mole.type === 'gold' ? '👑' : mole.type === 'bomb' ? '💣' : '👾'}
                </span>
                <span className={`text-[10px] font-mono font-bold ${mole.type === 'gold' ? 'text-amber-300' : mole.type === 'bomb' ? 'text-rose-300' : 'text-fuchsia-300'}`}>
                  {mole.type === 'gold' ? '+60' : mole.type === 'bomb' ? 'AWAS!' : '+25'}
                </span>
              </div>
            ) : (
              <div className="w-10 h-3 bg-slate-950/80 rounded-full border border-slate-800" />
            )}
            <span className="absolute top-1 left-2 text-[10px] text-slate-600 font-mono">
              {idx + 1}
            </span>
          </button>
        ))}

        {/* Floating hit effects */}
        {hitEffects.map(h => (
          <div
            key={h.id}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className={`absolute pointer-events-none font-black text-sm sm:text-base font-mono animate-fade-out ${h.color}`}
          >
            {h.text}
          </div>
        ))}

        {/* Overlay */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-b-xl flex flex-col items-center justify-center p-6 text-center z-10">
            {gameState === 'idle' ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center justify-center mb-3 shadow-lg shadow-fuchsia-500/20">
                  <Play className="w-7 h-7 text-fuchsia-400 fill-fuchsia-400 translate-x-0.5" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-wide mb-1">PIXEL STRIKE ARENA</h3>
                <p className="text-xs text-slate-300 max-w-xs mb-5">
                  Ketuk monster secepat mungkin! Tangkap alien emas 👑 dan hindari bom waktu 💣!
                </p>
                <button
                  id="btn-strike-start"
                  onClick={startGame}
                  className="px-7 py-3 bg-gradient-to-r from-fuchsia-500 to-rose-600 hover:from-fuchsia-400 hover:to-rose-500 text-white font-bold text-base rounded-xl shadow-lg shadow-fuchsia-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Mulai Pukul (Spasi)
                </button>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">⏰</div>
                <h3 className="text-2xl font-black text-fuchsia-400 mb-1">WAKTU HABIS!</h3>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-6 py-3 my-3 flex gap-6">
                  <div>
                    <div className="text-xs text-slate-400">Skor Total</div>
                    <div className="text-2xl font-black text-fuchsia-400 font-mono">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Koin Bonus</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">+{coins}</div>
                  </div>
                </div>
                <button
                  id="btn-strike-retry"
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-500 to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-fuchsia-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Pukul Lagi
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full text-center mt-2 text-xs text-slate-400">
        💡 Tekan angka 1-9 di keyboard atau ketuk langsung monster di layar!
      </div>
    </div>
  );
};
