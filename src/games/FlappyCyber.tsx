import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Award, Play, RotateCcw } from 'lucide-react';

interface FlappyCyberProps {
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate?: (score: number) => void;
}

export const FlappyCyber: React.FC<FlappyCyberProps> = ({ onGameOver, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);

  const stateRef = useRef({
    bird: {
      x: 70,
      y: 200,
      vy: 0,
      r: 14,
      rotation: 0
    },
    pipes: [] as { x: number; topH: number; bottomY: number; passed: boolean; color: string }[],
    gems: [] as { x: number; y: number; collected: boolean }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    stars: [] as { x: number; y: number; size: number; speed: number }[],
    score: 0,
    coins: 0,
    gravity: 0.38,
    jumpForce: -6.5,
    speed: 2.8,
    pipeTimer: 0,
    running: false
  });

  const flap = useCallback(() => {
    const s = stateRef.current;
    s.bird.vy = s.jumpForce;
    sound.playJump();

    // Spawn wing thruster particles
    for (let i = 0; i < 5; i++) {
      s.particles.push({
        x: s.bird.x - 10,
        y: s.bird.y,
        vx: -Math.random() * 3 - 1,
        vy: (Math.random() - 0.5) * 3,
        color: '#84cc16',
        life: 18
      });
    }
  }, []);

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.bird.x = 70;
    s.bird.y = 200;
    s.bird.vy = 0;
    s.bird.rotation = 0;
    s.pipes = [];
    s.gems = [];
    s.particles = [];
    s.score = 0;
    s.coins = 0;
    s.pipeTimer = 0;

    // Stars
    s.stars = [];
    for (let i = 0; i < 40; i++) {
      s.stars.push({
        x: Math.random() * 400,
        y: Math.random() * 480,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.3
      });
    }

    setScore(0);
    setCoins(0);
  }, []);

  const startGame = () => {
    initGame();
    stateRef.current.running = true;
    setGameState('playing');
    flap();
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
        flap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, flap]);

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
        // Bird Physics
        s.bird.vy += s.gravity;
        s.bird.y += s.bird.vy;
        s.bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, s.bird.vy * 0.08));

        // Floor / Ceiling check
        if (s.bird.y + s.bird.r >= h - 20 || s.bird.y - s.bird.r <= 0) {
          s.running = false;
          setGameState('gameover');
          sound.playGameOver();
          onGameOver(s.score, s.coins);
        }

        // Spawn Pipes
        s.pipeTimer++;
        if (s.pipeTimer % 95 === 0) {
          const gap = 120;
          const minH = 60;
          const maxH = h - gap - minH - 30;
          const topH = Math.floor(Math.random() * (maxH - minH)) + minH;
          const bottomY = topH + gap;

          s.pipes.push({
            x: w + 20,
            topH,
            bottomY,
            passed: false,
            color: '#84cc16'
          });

          if (Math.random() < 0.6) {
            s.gems.push({
              x: w + 45,
              y: topH + gap / 2,
              collected: false
            });
          }
        }

        // Update Pipes
        s.pipes.forEach(pipe => {
          pipe.x -= s.speed;

          // Score when passed
          if (!pipe.passed && pipe.x + 40 < s.bird.x) {
            pipe.passed = true;
            s.score += 1;
            setScore(s.score);
            sound.playClick();
            if (onScoreUpdate) onScoreUpdate(s.score);
          }

          // Collision check
          const pipeWidth = 44;
          if (
            s.bird.x + s.bird.r > pipe.x &&
            s.bird.x - s.bird.r < pipe.x + pipeWidth
          ) {
            if (s.bird.y - s.bird.r < pipe.topH || s.bird.y + s.bird.r > pipe.bottomY) {
              s.running = false;
              setGameState('gameover');
              sound.playHit();
              sound.playGameOver();
              onGameOver(s.score, s.coins);
            }
          }
        });
        s.pipes = s.pipes.filter(p => p.x > -60);

        // Update Gems
        s.gems.forEach(g => {
          g.x -= s.speed;
          if (!g.collected && Math.hypot(g.x - s.bird.x, g.y - s.bird.y) < s.bird.r + 10) {
            g.collected = true;
            s.coins += 2;
            setCoins(s.coins);
            sound.playCoin();

            for (let i = 0; i < 6; i++) {
              s.particles.push({
                x: g.x,
                y: g.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#facc15',
                life: 18
              });
            }
          }
        });
        s.gems = s.gems.filter(g => !g.collected && g.x > -30);

        // Update Particles
        s.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
        });
        s.particles = s.particles.filter(p => p.life > 0);

        // Background stars
        s.stars.forEach(st => {
          st.x -= st.speed;
          if (st.x < 0) st.x = w;
        });
      }

      // RENDER
      ctx.fillStyle = '#06130d';
      ctx.fillRect(0, 0, w, h);

      // Stars
      s.stars.forEach(st => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(st.x, st.y, st.size, st.size);
      });

      // Draw Pipes
      s.pipes.forEach(pipe => {
        ctx.save();
        ctx.fillStyle = '#1e3a1f';
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#84cc16';
        ctx.shadowBlur = 10;

        // Top Pipe
        ctx.fillRect(pipe.x, 0, 44, pipe.topH);
        ctx.strokeRect(pipe.x, -2, 44, pipe.topH + 2);
        // Top Cap
        ctx.fillStyle = '#84cc16';
        ctx.fillRect(pipe.x - 3, pipe.topH - 12, 50, 12);

        // Bottom Pipe
        ctx.fillStyle = '#1e3a1f';
        ctx.fillRect(pipe.x, pipe.bottomY, 44, h - pipe.bottomY);
        ctx.strokeRect(pipe.x, pipe.bottomY, 44, h - pipe.bottomY + 2);
        // Bottom Cap
        ctx.fillStyle = '#84cc16';
        ctx.fillRect(pipe.x - 3, pipe.bottomY, 50, 12);

        ctx.restore();
      });

      // Draw Gems
      s.gems.forEach(g => {
        ctx.save();
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(g.x, g.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(g.x - 2, g.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Ground Floor
      ctx.fillStyle = '#0f2918';
      ctx.fillRect(0, h - 20, w, 20);
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h - 20);
      ctx.lineTo(w, h - 20);
      ctx.stroke();

      // Draw Bird
      ctx.save();
      ctx.translate(s.bird.x, s.bird.y);
      ctx.rotate(s.bird.rotation);
      ctx.fillStyle = '#a3e635';
      ctx.shadowColor = '#84cc16';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, s.bird.r, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#65a30d';
      ctx.beginPath();
      ctx.ellipse(-4, 2, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(5, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(6, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(10, -2);
      ctx.lineTo(18, 1);
      ctx.lineTo(10, 4);
      ctx.closePath();
      ctx.fill();

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

  const getMedal = (s: number) => {
    if (s >= 30) return { label: 'Cyber Platinum 🏆', color: 'text-cyan-300' };
    if (s >= 20) return { label: 'Emas Murni 🥇', color: 'text-amber-400' };
    if (s >= 10) return { label: 'Perak 🥈', color: 'text-slate-300' };
    if (s >= 5) return { label: 'Perunggu 🥉', color: 'text-amber-600' };
    return null;
  };

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-lime-500/30 rounded-t-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="text-lime-400 font-mono font-bold text-lg">
            Skor: {score}
          </div>
          <div className="text-amber-400 font-mono font-bold text-sm">
            🪙 {coins}
          </div>
        </div>
        {getMedal(score) && (
          <div className={`text-xs font-bold ${getMedal(score)?.color} flex items-center gap-1`}>
            <Award className="w-3.5 h-3.5" /> {getMedal(score)?.label}
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="relative w-full bg-black rounded-b-xl overflow-hidden border border-t-0 border-lime-500/30 shadow-2xl shadow-lime-950/40">
        <canvas
          ref={canvasRef}
          width={380}
          height={460}
          onPointerDown={() => {
            if (gameState === 'playing') flap();
          }}
          className="w-full h-auto block touch-none cursor-pointer"
        />

        {/* Start / Game Over Overlay */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            {gameState === 'idle' ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-lime-500/20 border border-lime-400/40 flex items-center justify-center mb-3 shadow-lg shadow-lime-500/20">
                  <Play className="w-7 h-7 text-lime-400 fill-lime-400 translate-x-0.5" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-wide mb-1">FLAPPY CYBER WINGS</h3>
                <p className="text-xs text-slate-300 max-w-xs mb-5">
                  Ketuk layar atau tekan Spasi untuk mengepakkan sayap drone melewati laser!
                </p>
                <button
                  id="btn-flappy-start"
                  onClick={startGame}
                  className="px-7 py-3 bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-500 text-slate-950 font-bold text-base rounded-xl shadow-lg shadow-lime-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Mulai Terbang (Spasi)
                </button>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">💥</div>
                <h3 className="text-2xl font-black text-rose-500 mb-1">DRONE JATUH!</h3>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-6 py-3 my-3 flex gap-6">
                  <div>
                    <div className="text-xs text-slate-400">Pipa Dilewati</div>
                    <div className="text-2xl font-black text-lime-400 font-mono">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Koin Bonus</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">+{coins}</div>
                  </div>
                </div>
                <button
                  id="btn-flappy-retry"
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-lime-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Terbang Lagi
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Touch Action Controls */}
      <div className="w-full mt-3 flex items-center justify-center px-2">
        <button
          id="btn-flappy-flap-touch"
          onClick={flap}
          disabled={gameState !== 'playing'}
          className="w-full py-3.5 bg-gradient-to-r from-lime-600 to-emerald-600 active:from-lime-700 active:to-emerald-700 rounded-xl text-slate-950 font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation disabled:opacity-40"
        >
          🪽 KEPAKKAN SAYAP (Tap / Spasi)
        </button>
      </div>
    </div>
  );
};
