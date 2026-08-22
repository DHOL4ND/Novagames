import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

interface BlockBreakerProps {
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate?: (score: number) => void;
}

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  color: string;
  points: number;
  special?: 'multiball' | 'laser' | 'coin';
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  isSuper?: boolean;
}

export const BlockBreaker: React.FC<BlockBreakerProps> = ({ onGameOver, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);

  const stateRef = useRef({
    paddle: {
      x: 200,
      y: 440,
      w: 80,
      h: 12,
      speed: 8,
      isLaser: false,
      laserTimer: 0
    },
    balls: [] as Ball[],
    bricks: [] as Brick[],
    powerups: [] as { x: number; y: number; type: 'multiball' | 'laser' | 'expand' | 'coin'; color: string }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    lasers: [] as { x: number; y: number; vy: number }[],
    score: 0,
    coins: 0,
    lives: 3,
    combo: 0,
    running: false,
    keys: { left: false, right: false }
  });

  const createLevel = useCallback(() => {
    const bricks: Brick[] = [];
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];
    const rows = 5;
    const cols = 8;
    const padX = 14;
    const padY = 40;
    const bWidth = 52;
    const bHeight = 20;
    const gap = 6;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hp = r === 0 ? 2 : 1;
        const color = colors[r % colors.length];
        const specialRand = Math.random();
        let special: 'multiball' | 'laser' | 'coin' | undefined;
        if (specialRand < 0.12) special = 'multiball';
        else if (specialRand < 0.22) special = 'laser';
        else if (specialRand < 0.35) special = 'coin';

        bricks.push({
          x: padX + c * (bWidth + gap),
          y: padY + r * (bHeight + gap),
          w: bWidth,
          h: bHeight,
          hp,
          maxHp: hp,
          color,
          points: (rows - r) * 15,
          special
        });
      }
    }
    return bricks;
  }, []);

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.paddle.x = 200;
    s.paddle.w = 80;
    s.paddle.isLaser = false;
    s.paddle.laserTimer = 0;
    s.lives = 3;
    s.score = 0;
    s.coins = 0;
    s.combo = 0;
    s.powerups = [];
    s.particles = [];
    s.lasers = [];
    s.bricks = createLevel();
    s.balls = [{ x: 240, y: 420, vx: 3.5 * (Math.random() > 0.5 ? 1 : -1), vy: -4.5, r: 6 }];

    setScore(0);
    setCoins(0);
    setLives(3);
    setCombo(0);
  }, [createLevel]);

  const startGame = () => {
    initGame();
    stateRef.current.running = true;
    setGameState('playing');
    sound.playClick();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          startGame();
        }
        return;
      }
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const clientX = (e.clientX - rect.left) * scaleX;
    stateRef.current.paddle.x = Math.max(10, Math.min(canvas.width - stateRef.current.paddle.w - 10, clientX - stateRef.current.paddle.w / 2));
  };

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      if (s.running) {
        // Paddle motion via keyboard
        if (s.keys.left) s.paddle.x -= s.paddle.speed;
        if (s.keys.right) s.paddle.x += s.paddle.speed;
        s.paddle.x = Math.max(10, Math.min(w - s.paddle.w - 10, s.paddle.x));

        // Laser paddle shooting
        if (s.paddle.isLaser) {
          s.paddle.laserTimer--;
          if (s.paddle.laserTimer % 15 === 0) {
            s.lasers.push({ x: s.paddle.x + 8, y: s.paddle.y, vy: -7 });
            s.lasers.push({ x: s.paddle.x + s.paddle.w - 8, y: s.paddle.y, vy: -7 });
            sound.playLaser();
          }
          if (s.paddle.laserTimer <= 0) s.paddle.isLaser = false;
        }

        // Update lasers
        s.lasers.forEach(l => {
          l.y += l.vy;
          // Check brick hit
          s.bricks.forEach(b => {
            if (l.x > b.x && l.x < b.x + b.w && l.y > b.y && l.y < b.y + b.h) {
              l.y = -100;
              b.hp--;
              sound.playHit();
              if (b.hp <= 0) {
                s.score += b.points;
                setScore(s.score);
                if (onScoreUpdate) onScoreUpdate(s.score);
              }
            }
          });
        });
        s.lasers = s.lasers.filter(l => l.y > 0);

        // Update balls
        s.balls.forEach(ball => {
          ball.x += ball.vx;
          ball.y += ball.vy;

          // Wall bounce
          if (ball.x - ball.r <= 0) {
            ball.x = ball.r;
            ball.vx = Math.abs(ball.vx);
            sound.playClick();
          } else if (ball.x + ball.r >= w) {
            ball.x = w - ball.r;
            ball.vx = -Math.abs(ball.vx);
            sound.playClick();
          }
          if (ball.y - ball.r <= 0) {
            ball.y = ball.r;
            ball.vy = Math.abs(ball.vy);
            sound.playClick();
          }

          // Paddle bounce
          if (
            ball.y + ball.r >= s.paddle.y &&
            ball.y - ball.r <= s.paddle.y + s.paddle.h &&
            ball.x >= s.paddle.x - 4 &&
            ball.x <= s.paddle.x + s.paddle.w + 4 &&
            ball.vy > 0
          ) {
            sound.playJump();
            s.combo = 0;
            setCombo(0);

            // Calculate hit point for angle deflection
            const hitPos = (ball.x - (s.paddle.x + s.paddle.w / 2)) / (s.paddle.w / 2);
            const speed = Math.hypot(ball.vx, ball.vy);
            const angle = hitPos * (Math.PI / 3); // max 60 deg

            ball.vx = speed * Math.sin(angle);
            ball.vy = -Math.abs(speed * Math.cos(angle));
            ball.y = s.paddle.y - ball.r;

            // Paddle impact particles
            for (let i = 0; i < 6; i++) {
              s.particles.push({
                x: ball.x,
                y: s.paddle.y,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3,
                color: '#f59e0b',
                life: 15
              });
            }
          }

          // Brick Collisions
          for (const b of s.bricks) {
            if (b.hp <= 0) continue;

            if (
              ball.x + ball.r > b.x &&
              ball.x - ball.r < b.x + b.w &&
              ball.y + ball.r > b.y &&
              ball.y - ball.r < b.y + b.h
            ) {
              b.hp--;
              s.combo++;
              setCombo(s.combo);
              const comboBonus = s.combo > 1 ? s.combo * 5 : 0;
              s.score += b.points + comboBonus;
              setScore(s.score);
              if (onScoreUpdate) onScoreUpdate(s.score);

              sound.playHit();

              // Simple bounce reflection
              const overlapLeft = ball.x + ball.r - b.x;
              const overlapRight = b.x + b.w - (ball.x - ball.r);
              const overlapTop = ball.y + ball.r - b.y;
              const overlapBottom = b.y + b.h - (ball.y - ball.r);

              const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
              if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                ball.vx = -ball.vx;
              } else {
                ball.vy = -ball.vy;
              }

              // Destroy brick particles
              if (b.hp <= 0) {
                sound.playExplosion();
                for (let i = 0; i < 10; i++) {
                  s.particles.push({
                    x: b.x + b.w / 2,
                    y: b.y + b.h / 2,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    color: b.color,
                    life: 20
                  });
                }

                // Drop powerup
                if (b.special) {
                  s.powerups.push({
                    x: b.x + b.w / 2,
                    y: b.y + b.h / 2,
                    type: b.special === 'coin' ? 'coin' : b.special === 'laser' ? 'laser' : 'multiball',
                    color: b.special === 'coin' ? '#facc15' : b.special === 'laser' ? '#ec4899' : '#06b6d4'
                  });
                }
              }
              break;
            }
          }
        });

        // Filter active bricks
        s.bricks = s.bricks.filter(b => b.hp > 0);

        // Win Condition
        if (s.bricks.length === 0) {
          s.running = false;
          setGameState('won');
          s.coins += 20;
          sound.playVictory();
          onGameOver(s.score + 500, s.coins);
        }

        // Filter balls that fell below screen
        s.balls = s.balls.filter(b => b.y < h + 20);

        // Ball loss check
        if (s.balls.length === 0) {
          s.lives--;
          setLives(s.lives);
          sound.playGameOver();

          if (s.lives <= 0) {
            s.running = false;
            setGameState('gameover');
            onGameOver(s.score, s.coins);
          } else {
            // Respawn single ball
            s.balls.push({
              x: s.paddle.x + s.paddle.w / 2,
              y: s.paddle.y - 12,
              vx: 3.5 * (Math.random() > 0.5 ? 1 : -1),
              vy: -4.5,
              r: 6
            });
          }
        }

        // Update Powerups
        s.powerups.forEach(p => {
          p.y += 2.5;
          // Catch with paddle
          if (
            p.y >= s.paddle.y &&
            p.y <= s.paddle.y + s.paddle.h &&
            p.x >= s.paddle.x &&
            p.x <= s.paddle.x + s.paddle.w
          ) {
            p.y = h + 100;
            sound.playPowerup();

            if (p.type === 'multiball') {
              if (s.balls.length > 0) {
                const b = s.balls[0];
                s.balls.push({ x: b.x, y: b.y, vx: -b.vx, vy: b.vy, r: 6 });
                s.balls.push({ x: b.x, y: b.y, vx: b.vx * 0.8, vy: -Math.abs(b.vy), r: 6 });
              }
            } else if (p.type === 'laser') {
              s.paddle.isLaser = true;
              s.paddle.laserTimer = 240;
            } else if (p.type === 'coin') {
              s.coins += 2;
              setCoins(s.coins);
              sound.playCoin();
            }
          }
        });
        s.powerups = s.powerups.filter(p => p.y < h + 20);

        // Update Particles
        s.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
        });
        s.particles = s.particles.filter(p => p.life > 0);
      }

      // RENDER
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, w, h);

      // Background grid glow
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Draw Bricks
      s.bricks.forEach(b => {
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 4);
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, 3);

        if (b.maxHp > 1 && b.hp > 1) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(b.x + 4, b.y + 4, b.w - 8, b.h - 8);
        }

        if (b.special) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(b.x + b.w / 2, b.y + b.h / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Lasers
      s.lasers.forEach(l => {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.fillRect(l.x - 1.5, l.y, 3, 10);
      });

      // Draw Powerups
      s.powerups.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.type === 'coin' ? '$' : p.type === 'laser' ? 'L' : '3x', p.x, p.y);
        ctx.restore();
      });

      // Draw Paddle
      ctx.save();
      ctx.fillStyle = s.paddle.isLaser ? '#ec4899' : '#f59e0b';
      ctx.shadowColor = s.paddle.isLaser ? '#ec4899' : '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(s.paddle.x, s.paddle.y, s.paddle.w, s.paddle.h, 6);
      ctx.fill();

      // Top glowing bar
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(s.paddle.x + 6, s.paddle.y + 2, s.paddle.w - 12, 2.5);
      ctx.restore();

      // Draw Balls
      s.balls.forEach(ball => {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
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
  }, [gameState, onGameOver, onScoreUpdate]);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-amber-500/30 rounded-t-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-lg">
            <span>Skor: {score}</span>
          </div>
          {combo > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full animate-bounce">
              <Sparkles className="w-3 h-3" /> Combo x{combo}!
            </div>
          )}
          <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
            <span>🪙 {coins}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-rose-400 text-base">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={i < lives ? 'opacity-100' : 'opacity-25'}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative w-full bg-black rounded-b-xl overflow-hidden border border-t-0 border-amber-500/30 shadow-2xl shadow-amber-950/40">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          onPointerMove={handlePointerMove}
          className="w-full h-auto block touch-none cursor-ew-resize"
        />

        {/* Overlays */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            {gameState === 'idle' ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
                  <Play className="w-7 h-7 text-amber-400 fill-amber-400 translate-x-0.5" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-wide mb-1">HYPER BLOCK NEO</h3>
                <p className="text-sm text-slate-300 max-w-xs mb-5">
                  Pantulkan bola untuk menghancurkan seluruh balok neon!
                </p>
                <button
                  id="btn-block-breaker-start"
                  onClick={startGame}
                  className="px-7 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-base rounded-xl shadow-lg shadow-amber-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Mulai Main (Spasi)
                </button>
              </>
            ) : gameState === 'won' ? (
              <>
                <div className="text-4xl mb-1">🏆</div>
                <h3 className="text-2xl font-black text-amber-400 mb-1">LEVEL SELESAI!</h3>
                <p className="text-sm text-slate-300 mb-4">Kamu menghancurkan semua balok neon!</p>
                <button
                  id="btn-block-breaker-next"
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Main Lagi
                </button>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">💥</div>
                <h3 className="text-2xl font-black text-rose-500 mb-1">GAME OVER!</h3>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-6 py-3 my-3 flex gap-6">
                  <div>
                    <div className="text-xs text-slate-400">Skor</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Koin</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">+{coins}</div>
                  </div>
                </div>
                <button
                  id="btn-block-breaker-retry"
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Coba Lagi
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full text-center mt-2 text-xs text-slate-400">
        💡 Gerakkan mouse atau sentuh layar ke kiri & kanan untuk mengontrol paddle
      </div>
    </div>
  );
};
