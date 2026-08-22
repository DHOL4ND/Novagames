import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Flame, Play, RotateCcw, Sparkles } from 'lucide-react';

interface NeonSnakeProps {
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate?: (score: number) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
  type: 'apple' | 'golden' | 'gem';
  color: string;
  points: number;
}

export const NeonSnake: React.FC<NeonSnakeProps> = ({ onGameOver, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [isTurbo, setIsTurbo] = useState(false);

  const stateRef = useRef({
    gridSize: 20,
    tileCount: 22,
    snake: [] as Point[],
    dir: { x: 1, y: 0 } as Point,
    nextDir: { x: 1, y: 0 } as Point,
    food: null as Food | null,
    portals: [] as { in: Point; out: Point; color: string }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    score: 0,
    coins: 0,
    turbo: false,
    moveCooldown: 0,
    running: false
  });

  const spawnFood = useCallback((snake: Point[]): Food => {
    const tileCount = stateRef.current.tileCount;
    let fx = 0;
    let fy = 0;
    let valid = false;

    while (!valid) {
      fx = Math.floor(Math.random() * (tileCount - 2)) + 1;
      fy = Math.floor(Math.random() * (tileCount - 2)) + 1;
      valid = !snake.some(s => s.x === fx && s.y === fy);
    }

    const rand = Math.random();
    if (rand < 0.15) {
      return { x: fx, y: fy, type: 'gem', color: '#06b6d4', points: 30 };
    } else if (rand < 0.35) {
      return { x: fx, y: fy, type: 'golden', color: '#facc15', points: 20 };
    }
    return { x: fx, y: fy, type: 'apple', color: '#10b981', points: 10 };
  }, []);

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.food = spawnFood(s.snake);
    s.portals = [
      { in: { x: 2, y: 2 }, out: { x: 19, y: 19 }, color: '#ec4899' },
      { in: { x: 19, y: 19 }, out: { x: 2, y: 2 }, color: '#ec4899' }
    ];
    s.particles = [];
    s.score = 0;
    s.coins = 0;
    s.turbo = false;
    s.moveCooldown = 0;

    setScore(0);
    setCoins(0);
    setIsTurbo(false);
  }, [spawnFood]);

  const startGame = () => {
    initGame();
    stateRef.current.running = true;
    setGameState('playing');
    sound.playClick();
  };

  const changeDirection = useCallback((dx: number, dy: number) => {
    const s = stateRef.current;
    if (dx !== 0 && s.dir.x !== 0) return; // Prevent 180 reverse
    if (dy !== 0 && s.dir.y !== 0) return;
    s.nextDir = { x: dx, y: dy };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        changeDirection(0, -1);
      } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        changeDirection(0, 1);
      } else if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        changeDirection(-1, 0);
      } else if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        changeDirection(1, 0);
      } else if (e.key === 'Shift') {
        stateRef.current.turbo = true;
        setIsTurbo(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        stateRef.current.turbo = false;
        setIsTurbo(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, changeDirection]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const loop = () => {
      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const tile = w / s.tileCount;

      if (s.running) {
        frameCount++;
        const speedInterval = s.turbo ? 4 : 7;

        if (frameCount >= speedInterval) {
          frameCount = 0;
          s.dir = s.nextDir;

          let headX = s.snake[0].x + s.dir.x;
          let headY = s.snake[0].y + s.dir.y;

          // Wall wrapping
          if (headX < 0) headX = s.tileCount - 1;
          if (headX >= s.tileCount) headX = 0;
          if (headY < 0) headY = s.tileCount - 1;
          if (headY >= s.tileCount) headY = 0;

          // Portal check
          for (const portal of s.portals) {
            if (headX === portal.in.x && headY === portal.in.y) {
              headX = portal.out.x;
              headY = portal.out.y;
              sound.playJump();
              break;
            }
          }

          // Self Collision Check
          if (s.snake.some(segment => segment.x === headX && segment.y === headY)) {
            s.running = false;
            setGameState('gameover');
            sound.playGameOver();
            onGameOver(s.score, s.coins);
          } else {
            const newSnake = [{ x: headX, y: headY }, ...s.snake];

            // Food eating check
            if (s.food && headX === s.food.x && headY === s.food.y) {
              sound.playCoin();
              s.score += s.food.points;
              if (s.food.type === 'golden' || s.food.type === 'gem') {
                s.coins += 2;
                setCoins(s.coins);
              }
              setScore(s.score);
              if (onScoreUpdate) onScoreUpdate(s.score);

              // Burst particles
              for (let i = 0; i < 12; i++) {
                s.particles.push({
                  x: (headX + 0.5) * tile,
                  y: (headY + 0.5) * tile,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  color: s.food.color,
                  life: 20
                });
              }

              s.food = spawnFood(newSnake);
            } else {
              newSnake.pop(); // remove tail
            }
            s.snake = newSnake;
          }
        }

        // Update Particles
        s.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
        });
        s.particles = s.particles.filter(p => p.life > 0);
      }

      // RENDER
      ctx.fillStyle = '#060d0a';
      ctx.fillRect(0, 0, w, h);

      // Grid Lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= s.tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tile, 0);
        ctx.lineTo(i * tile, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * tile);
        ctx.lineTo(w, i * tile);
        ctx.stroke();
      }

      // Draw Portals
      s.portals.forEach(p => {
        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc((p.in.x + 0.5) * tile, (p.in.y + 0.5) * tile, tile * 0.45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Draw Food
      if (s.food) {
        ctx.save();
        ctx.fillStyle = s.food.color;
        ctx.shadowColor = s.food.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc((s.food.x + 0.5) * tile, (s.food.y + 0.5) * tile, tile * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc((s.food.x + 0.35) * tile, (s.food.y + 0.35) * tile, tile * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Snake
      s.snake.forEach((seg, idx) => {
        ctx.save();
        const isHead = idx === 0;
        ctx.fillStyle = isHead ? '#34d399' : '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = isHead ? 14 : 6;

        ctx.beginPath();
        ctx.roundRect(seg.x * tile + 2, seg.y * tile + 2, tile - 4, tile - 4, isHead ? 6 : 4);
        ctx.fill();

        if (isHead) {
          // Eyes
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(seg.x * tile + tile * 0.35, seg.y * tile + tile * 0.35, 2.5, 0, Math.PI * 2);
          ctx.arc(seg.x * tile + tile * 0.65, seg.y * tile + tile * 0.35, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Particles
      s.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, onGameOver, onScoreUpdate, spawnFood]);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-emerald-500/30 rounded-t-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-lg">
            <span>Skor: {score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
            <span>🪙 {coins}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isTurbo && (
            <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full animate-pulse">
              <Flame className="w-3 h-3 text-emerald-400" /> TURBO!
            </div>
          )}
          <span className="text-xs text-slate-400">Panjang: {stateRef.current.snake.length}</span>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative w-full bg-black rounded-b-xl overflow-hidden border border-t-0 border-emerald-500/30 shadow-2xl shadow-emerald-950/40">
        <canvas
          ref={canvasRef}
          width={440}
          height={440}
          className="w-full h-auto block"
        />

        {/* Start / Game Over Overlay */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            {gameState === 'idle' ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                  <Play className="w-7 h-7 text-emerald-400 fill-emerald-400 translate-x-0.5" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-wide mb-1">NEON SNAKE EVOLUTION</h3>
                <p className="text-sm text-slate-300 max-w-xs mb-5">
                  Makan buah neon, manfaatkan portal teleportasi, dan jangan menabrak ekormu sendiri!
                </p>
                <button
                  id="btn-snake-start"
                  onClick={startGame}
                  className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-base rounded-xl shadow-lg shadow-emerald-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Mulai Main (Spasi)
                </button>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">💥</div>
                <h3 className="text-2xl font-black text-rose-500 mb-1">GAME OVER!</h3>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-6 py-3 my-3 flex gap-6">
                  <div>
                    <div className="text-xs text-slate-400">Skor Akhir</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Koin Bonus</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">+{coins}</div>
                  </div>
                </div>
                <button
                  id="btn-snake-retry"
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Main Lagi
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Onscreen D-Pad Controls for Touch / Mobile */}
      <div className="w-full mt-3 flex flex-col items-center gap-1.5 px-4 max-w-xs">
        <button
          id="btn-snake-up"
          onClick={() => changeDirection(0, -1)}
          className="w-14 h-12 bg-slate-800 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-lg active:bg-emerald-600/40 active:scale-95 flex items-center justify-center transition-all shadow-md touch-manipulation"
        >
          ▲
        </button>
        <div className="flex items-center gap-3">
          <button
            id="btn-snake-left"
            onClick={() => changeDirection(-1, 0)}
            className="w-14 h-12 bg-slate-800 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-lg active:bg-emerald-600/40 active:scale-95 flex items-center justify-center transition-all shadow-md touch-manipulation"
          >
            ◀
          </button>
          <button
            id="btn-snake-turbo"
            onClick={() => {
              stateRef.current.turbo = !stateRef.current.turbo;
              setIsTurbo(stateRef.current.turbo);
            }}
            className="w-14 h-12 bg-emerald-600/30 border border-emerald-400/60 rounded-xl text-emerald-300 font-bold text-xs active:scale-95 flex items-center justify-center transition-all shadow-md touch-manipulation"
          >
            TURBO
          </button>
          <button
            id="btn-snake-right"
            onClick={() => changeDirection(1, 0)}
            className="w-14 h-12 bg-slate-800 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-lg active:bg-emerald-600/40 active:scale-95 flex items-center justify-center transition-all shadow-md touch-manipulation"
          >
            ▶
          </button>
        </div>
        <button
          id="btn-snake-down"
          onClick={() => changeDirection(0, 1)}
          className="w-14 h-12 bg-slate-800 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-lg active:bg-emerald-600/40 active:scale-95 flex items-center justify-center transition-all shadow-md touch-manipulation"
        >
          ▼
        </button>
      </div>
    </div>
  );
};
