import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Shield, Sparkles } from 'lucide-react';

interface CyberRunnerProps {
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate?: (score: number) => void;
}

export const CyberRunner: React.FC<CyberRunnerProps> = ({ onGameOver, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [hasShield, setHasShield] = useState(false);

  const stateRef = useRef({
    player: {
      x: 70,
      y: 200,
      w: 32,
      h: 46,
      vy: 0,
      isGrounded: false,
      jumpsLeft: 2,
      isSliding: false,
      slideTimer: 0,
      shield: false,
      color: '#06b6d4',
      trail: [] as { x: number; y: number; alpha: number; h: number }[]
    },
    groundY: 260,
    speed: 5.5,
    distance: 0,
    obstacles: [] as { x: number; y: number; w: number; h: number; type: 'low' | 'high' | 'laser'; color: string }[],
    gems: [] as { x: number; y: number; collected: boolean; pulse: number }[],
    shields: [] as { x: number; y: number; collected: boolean }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    cityBuildings: [] as { x: number; w: number; h: number; color: string; windows: { x: number; y: number; on: boolean }[] }[],
    stars: [] as { x: number; y: number; size: number; speed: number }[],
    score: 0,
    coins: 0,
    lastObstacleX: 400,
    running: false
  });

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.player.jumpsLeft > 0) {
      s.player.vy = s.player.jumpsLeft === 2 ? -10.5 : -9.5;
      s.player.isGrounded = false;
      s.player.jumpsLeft--;
      s.player.isSliding = false;
      sound.playJump();

      // Jump particles
      for (let i = 0; i < 8; i++) {
        s.particles.push({
          x: s.player.x + 16,
          y: s.player.y + s.player.h,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 2 + 1,
          color: '#06b6d4',
          life: 20
        });
      }
    }
  }, []);

  const slide = useCallback(() => {
    const s = stateRef.current;
    if (s.player.isGrounded && !s.player.isSliding) {
      s.player.isSliding = true;
      s.player.slideTimer = 35; // frames
      sound.playClick();
    }
  }, []);

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.player.x = 70;
    s.player.y = 200;
    s.player.vy = 0;
    s.player.isGrounded = true;
    s.player.jumpsLeft = 2;
    s.player.isSliding = false;
    s.player.slideTimer = 0;
    s.player.shield = false;
    s.player.trail = [];
    s.speed = 5.5;
    s.distance = 0;
    s.score = 0;
    s.coins = 0;
    s.obstacles = [];
    s.gems = [];
    s.shields = [];
    s.particles = [];
    s.lastObstacleX = 400;

    // Generate initial buildings
    s.cityBuildings = [];
    for (let i = 0; i < 15; i++) {
      const w = Math.random() * 60 + 40;
      const h = Math.random() * 120 + 60;
      s.cityBuildings.push({
        x: i * 80,
        w,
        h,
        color: i % 2 === 0 ? '#111827' : '#1e1b4b',
        windows: []
      });
    }

    // Stars
    s.stars = [];
    for (let i = 0; i < 40; i++) {
      s.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 180,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2
      });
    }

    setScore(0);
    setCoins(0);
    setHasShield(false);
  }, []);

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
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jump();
      } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        slide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, slide]);

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
      s.groundY = h - 60;

      // Update if playing
      if (s.running) {
        s.distance += s.speed;
        s.speed = Math.min(12, 5.5 + s.distance * 0.0005);
        s.score = Math.floor(s.distance / 10);
        setScore(s.score);
        if (onScoreUpdate) onScoreUpdate(s.score);

        // Player physics
        const gravity = 0.55;
        s.player.vy += gravity;
        s.player.y += s.player.vy;

        // Slide logic
        if (s.player.isSliding) {
          s.player.h = 24;
          s.player.slideTimer--;
          if (s.player.slideTimer <= 0) {
            s.player.isSliding = false;
            s.player.h = 46;
          }
        } else {
          s.player.h = 46;
        }

        // Ground check
        if (s.player.y + s.player.h >= s.groundY) {
          s.player.y = s.groundY - s.player.h;
          s.player.vy = 0;
          s.player.isGrounded = true;
          s.player.jumpsLeft = 2;
        } else {
          s.player.isGrounded = false;
        }

        // Player trail
        if (Math.random() < 0.6) {
          s.player.trail.push({
            x: s.player.x,
            y: s.player.y,
            alpha: 0.6,
            h: s.player.h
          });
        }
        s.player.trail.forEach(t => {
          t.x -= s.speed * 0.8;
          t.alpha -= 0.05;
        });
        s.player.trail = s.player.trail.filter(t => t.alpha > 0);

        // Spawn obstacles
        if (w - s.lastObstacleX >= Math.random() * 120 + 200) {
          const typeRand = Math.random();
          if (typeRand < 0.45) {
            // Low block (must jump)
            s.obstacles.push({
              x: w + 20,
              y: s.groundY - 36,
              w: 28,
              h: 36,
              type: 'low',
              color: '#ef4444'
            });
          } else if (typeRand < 0.75) {
            // High laser beam (must slide or duck)
            s.obstacles.push({
              x: w + 20,
              y: s.groundY - 65,
              w: 36,
              h: 28,
              type: 'high',
              color: '#f43f5e'
            });
          } else {
            // Laser gate
            s.obstacles.push({
              x: w + 20,
              y: s.groundY - 48,
              w: 22,
              h: 48,
              type: 'laser',
              color: '#ec4899'
            });
          }

          // Spawn energy gems sometimes
          if (Math.random() < 0.7) {
            s.gems.push({
              x: w + 70 + Math.random() * 60,
              y: s.groundY - (Math.random() < 0.5 ? 40 : 80),
              collected: false,
              pulse: 0
            });
          }

          // Spawn shield powerup rarely
          if (Math.random() < 0.12 && !s.player.shield) {
            s.shields.push({
              x: w + 140,
              y: s.groundY - 70,
              collected: false
            });
          }

          s.lastObstacleX = w + 20;
        }

        // Update obstacles
        s.obstacles.forEach(o => {
          o.x -= s.speed;
        });
        s.lastObstacleX -= s.speed;
        s.obstacles = s.obstacles.filter(o => o.x + o.w > -50);

        // Update gems
        s.gems.forEach(g => {
          g.x -= s.speed;
          g.pulse += 0.1;
          // Collect collision
          if (!g.collected && Math.hypot(g.x - (s.player.x + 16), g.y - (s.player.y + s.player.h / 2)) < 26) {
            g.collected = true;
            s.coins += 1;
            s.score += 25;
            setCoins(s.coins);
            sound.playCoin();

            // Gem spark particles
            for (let i = 0; i < 6; i++) {
              s.particles.push({
                x: g.x,
                y: g.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#eab308',
                life: 18
              });
            }
          }
        });
        s.gems = s.gems.filter(g => !g.collected && g.x > -30);

        // Update shields
        s.shields.forEach(sh => {
          sh.x -= s.speed;
          if (!sh.collected && Math.hypot(sh.x - (s.player.x + 16), sh.y - (s.player.y + s.player.h / 2)) < 28) {
            sh.collected = true;
            s.player.shield = true;
            setHasShield(true);
            sound.playPowerup();
          }
        });
        s.shields = s.shields.filter(sh => !sh.collected && sh.x > -30);

        // Check Obstacle Collisions
        const pBox = {
          x: s.player.x + 4,
          y: s.player.y + 4,
          w: s.player.w - 8,
          h: s.player.h - 8
        };

        for (const obs of s.obstacles) {
          const oBox = { x: obs.x + 4, y: obs.y + 4, w: obs.w - 8, h: obs.h - 8 };
          if (
            pBox.x < oBox.x + oBox.w &&
            pBox.x + pBox.w > oBox.x &&
            pBox.y < oBox.y + oBox.h &&
            pBox.y + pBox.h > oBox.y
          ) {
            if (s.player.shield) {
              // Destroy shield and obstacle
              s.player.shield = false;
              setHasShield(false);
              obs.x = -100;
              sound.playHit();
              for (let i = 0; i < 15; i++) {
                s.particles.push({
                  x: pBox.x + 16,
                  y: pBox.y + 20,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: '#06b6d4',
                  life: 25
                });
              }
            } else {
              // Game Over
              s.running = false;
              setGameState('gameover');
              sound.playGameOver();
              onGameOver(s.score, s.coins);
              break;
            }
          }
        }

        // Update particles
        s.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
        });
        s.particles = s.particles.filter(p => p.life > 0);

        // Update background
        s.stars.forEach(st => {
          st.x -= st.speed;
          if (st.x < 0) st.x = w;
        });
        s.cityBuildings.forEach(b => {
          b.x -= s.speed * 0.25;
          if (b.x + b.w < 0) {
            b.x = w + Math.random() * 40;
            b.h = Math.random() * 120 + 60;
          }
        });
      }

      // DRAWING
      ctx.clearRect(0, 0, w, h);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.6, '#0f172a');
      skyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      s.stars.forEach(st => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(st.x, st.y, st.size, st.size);
      });

      // City buildings (distant background)
      s.cityBuildings.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, s.groundY - b.h, b.w, b.h);
        ctx.strokeStyle = '#312e81';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, s.groundY - b.h, b.w, b.h);
      });

      // Ground with glowing grid line
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, s.groundY, w, h - s.groundY);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      ctx.lineTo(w, s.groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ground grid marks moving backwards
      const gridOffset = (s.distance * 1.5) % 40;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 2;
      for (let gx = -gridOffset; gx < w; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, s.groundY);
        ctx.lineTo(gx - 30, h);
        ctx.stroke();
      }

      // Draw obstacles
      s.obstacles.forEach(o => {
        ctx.save();
        ctx.fillStyle = o.color;
        ctx.shadowColor = o.color;
        ctx.shadowBlur = 12;

        if (o.type === 'low') {
          // Neon spike / barrier
          ctx.beginPath();
          ctx.moveTo(o.x, o.y + o.h);
          ctx.lineTo(o.x + o.w / 2, o.y);
          ctx.lineTo(o.x + o.w, o.y + o.h);
          ctx.closePath();
          ctx.fill();
        } else if (o.type === 'high') {
          // High laser bar
          ctx.fillRect(o.x, o.y, o.w, o.h);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(o.x + 4, o.y + 8, o.w - 8, o.h - 16);
        } else {
          // Neon tower
          ctx.fillRect(o.x, o.y, o.w, o.h);
        }
        ctx.restore();
      });

      // Draw Gems
      s.gems.forEach(g => {
        ctx.save();
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        const bob = Math.sin(g.pulse) * 3;
        ctx.beginPath();
        ctx.arc(g.x, g.y + bob, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(g.x - 2, g.y + bob - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Shields powerup
      s.shields.forEach(sh => {
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });

      // Draw Player Trail
      s.player.trail.forEach(t => {
        ctx.fillStyle = `rgba(6, 182, 212, ${t.alpha * 0.4})`;
        ctx.fillRect(t.x, t.y, s.player.w, t.h);
      });

      // Draw Player
      ctx.save();
      ctx.fillStyle = s.player.color;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;

      if (s.player.isSliding) {
        // Slide pose: flat capsule
        ctx.beginPath();
        ctx.roundRect(s.player.x, s.player.y, s.player.w + 14, s.player.h, 6);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(s.player.x + s.player.w, s.player.y + 4, 8, 8);
      } else {
        // Runner body
        ctx.beginPath();
        ctx.roundRect(s.player.x, s.player.y, s.player.w, s.player.h, 8);
        ctx.fill();

        // Visor glow
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(s.player.x + 16, s.player.y + 8, 12, 6);

        // Core light
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(s.player.x + 16, s.player.y + 24, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shield Aura
      if (s.player.shield) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(
          s.player.x + s.player.w / 2,
          s.player.y + s.player.h / 2,
          s.player.h / 2 + 10,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      ctx.restore();

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
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-cyan-500/30 rounded-t-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-lg">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>Skor: {score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
            <span>🪙 {coins}</span>
          </div>
        </div>
        {hasShield && (
          <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/40 rounded-full animate-pulse">
            <Shield className="w-3.5 h-3.5" /> SHIELD AKTIF
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="relative w-full bg-black rounded-b-xl overflow-hidden border border-t-0 border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
        <canvas
          ref={canvasRef}
          width={700}
          height={320}
          className="w-full h-auto block"
        />

        {/* Start / Game Over Overlay */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            {gameState === 'idle' ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/20">
                  <Play className="w-7 h-7 text-cyan-400 fill-cyan-400 translate-x-0.5" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-wide mb-1">CYBER DASH NEON</h3>
                <p className="text-sm text-slate-300 max-w-sm mb-5">
                  Lompat ganda melewati rintangan laser dan menunduk di bawah balok tinggi!
                </p>
                <button
                  id="btn-cyber-runner-start"
                  onClick={startGame}
                  className="px-7 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base rounded-xl shadow-lg shadow-cyan-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Mulai Lari (Spasi)
                </button>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">💥</div>
                <h3 className="text-2xl font-black text-rose-500 mb-1">GAME OVER!</h3>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-6 py-3 my-3 flex gap-6">
                  <div>
                    <div className="text-xs text-slate-400">Skor Akhir</div>
                    <div className="text-2xl font-black text-cyan-400 font-mono">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Koin Didapat</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">+{coins}</div>
                  </div>
                </div>
                <button
                  id="btn-cyber-runner-retry"
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Main Lagi
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Onscreen Touch / Mobile Controls */}
      <div className="w-full mt-3 flex items-center justify-center gap-4 px-2">
        <button
          id="btn-cyber-runner-jump"
          onClick={jump}
          disabled={gameState !== 'playing'}
          className="flex-1 py-3.5 bg-slate-800/90 hover:bg-slate-700 active:bg-cyan-600/40 border border-cyan-500/40 rounded-xl text-cyan-300 font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation disabled:opacity-40"
        >
          ⬆️ LOMPAT (Tap / Spasi)
        </button>
        <button
          id="btn-cyber-runner-slide"
          onClick={slide}
          disabled={gameState !== 'playing'}
          className="flex-1 py-3.5 bg-slate-800/90 hover:bg-slate-700 active:bg-rose-600/40 border border-rose-500/40 rounded-xl text-rose-300 font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation disabled:opacity-40"
        >
          ⬇️ SLIDE / TUNDUK
        </button>
      </div>
    </div>
  );
};
