import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Shield, Zap } from 'lucide-react';

interface SpaceStrikeProps {
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate?: (score: number) => void;
}

export const SpaceStrike: React.FC<SpaceStrikeProps> = ({ onGameOver, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [weaponLevel, setWeaponLevel] = useState(1);
  const [autoFire, setAutoFire] = useState(true);
  const isPointerDownRef = useRef(false);

  const stateRef = useRef({
    player: {
      x: 200,
      y: 400,
      w: 36,
      h: 36,
      vx: 0,
      vy: 0,
      speed: 6,
      lives: 3,
      invulnerable: 0,
      weaponLevel: 1,
      fireCooldown: 0
    },
    autoFire: true,
    bullets: [] as { x: number; y: number; vx: number; vy: number; color: string; damage: number }[],
    enemyBullets: [] as { x: number; y: number; vx: number; vy: number; color: string }[],
    enemies: [] as {
      id: number;
      x: number;
      y: number;
      w: number;
      h: number;
      hp: number;
      maxHp: number;
      type: 'grunt' | 'drone' | 'boss';
      color: string;
      shootTimer: number;
      vx: number;
    }[],
    powerups: [] as { x: number; y: number; type: 'weapon' | 'shield' | 'coin'; color: string }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number; size: number }[],
    stars: [] as { x: number; y: number; size: number; speed: number }[],
    score: 0,
    coins: 0,
    waveTimer: 0,
    keys: { left: false, right: false, up: false, down: false, fire: false },
    running: false
  });

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.player.x = 200;
    s.player.y = 380;
    s.player.lives = 3;
    s.player.weaponLevel = 1;
    s.player.invulnerable = 60;
    s.player.fireCooldown = 0;
    s.bullets = [];
    s.enemyBullets = [];
    s.enemies = [];
    s.powerups = [];
    s.particles = [];
    s.score = 0;
    s.coins = 0;
    s.waveTimer = 0;

    // Background stars
    s.stars = [];
    for (let i = 0; i < 60; i++) {
      s.stars.push({
        x: Math.random() * 450,
        y: Math.random() * 480,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.8
      });
    }

    setScore(0);
    setCoins(0);
    setLives(3);
    setWeaponLevel(1);
  }, []);

  const startGame = () => {
    initGame();
    stateRef.current.running = true;
    setGameState('playing');
    sound.playClick();
  };

  const shoot = useCallback(() => {
    const s = stateRef.current;
    if (s.player.fireCooldown > 0) return;
    s.player.fireCooldown = 12;
    sound.playLaser();

    const px = s.player.x + s.player.w / 2;
    const py = s.player.y;

    if (s.player.weaponLevel === 1) {
      s.bullets.push({ x: px - 2, y: py - 6, vx: 0, vy: -9, color: '#ec4899', damage: 1 });
    } else if (s.player.weaponLevel === 2) {
      s.bullets.push({ x: px - 10, y: py, vx: 0, vy: -9.5, color: '#06b6d4', damage: 1 });
      s.bullets.push({ x: px + 10, y: py, vx: 0, vy: -9.5, color: '#06b6d4', damage: 1 });
    } else {
      // Triple / spread
      s.bullets.push({ x: px, y: py - 6, vx: 0, vy: -10, color: '#facc15', damage: 1.5 });
      s.bullets.push({ x: px - 10, y: py, vx: -2.5, vy: -9.5, color: '#06b6d4', damage: 1 });
      s.bullets.push({ x: px + 10, y: py, vx: 2.5, vy: -9.5, color: '#06b6d4', damage: 1 });
    }
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          startGame();
        }
        return;
      }
      const k = stateRef.current.keys;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = true;
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') k.up = true;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') k.down = true;
      if (e.code === 'Space') {
        e.preventDefault();
        k.fire = true;
        shoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = stateRef.current.keys;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = false;
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') k.up = false;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') k.down = false;
      if (e.code === 'Space') k.fire = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, shoot]);

  // Touch / pointer navigation
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = (e.clientX - rect.left) * scaleX;
    const clientY = (e.clientY - rect.top) * scaleY;

    stateRef.current.player.x = Math.max(0, Math.min(canvas.width - stateRef.current.player.w, clientX - stateRef.current.player.w / 2));
    stateRef.current.player.y = Math.max(50, Math.min(canvas.height - stateRef.current.player.h - 10, clientY - stateRef.current.player.h / 2));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isPointerDownRef.current = true;
    handlePointerMove(e);
    shoot();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isPointerDownRef.current = false;
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
        // Player keyboard motion
        if (s.keys.left) s.player.x -= s.player.speed;
        if (s.keys.right) s.player.x += s.player.speed;
        if (s.keys.up) s.player.y -= s.player.speed;
        if (s.keys.down) s.player.y += s.player.speed;

        s.player.x = Math.max(0, Math.min(w - s.player.w, s.player.x));
        s.player.y = Math.max(40, Math.min(h - s.player.h - 10, s.player.y));

        if (s.player.fireCooldown > 0) s.player.fireCooldown--;
        if (s.player.invulnerable > 0) s.player.invulnerable--;

        // Continuous auto-fire or touch holding
        if ((s.autoFire || s.keys.fire || isPointerDownRef.current) && s.player.fireCooldown === 0) {
          shoot();
        }

        // Spawn enemy waves
        s.waveTimer++;
        if (s.waveTimer % 45 === 0) {
          const typeRand = Math.random();
          if (typeRand < 0.5) {
            // Fast drone
            s.enemies.push({
              id: Math.random(),
              x: Math.random() * (w - 40) + 10,
              y: -30,
              w: 26,
              h: 26,
              hp: 1,
              maxHp: 1,
              type: 'drone',
              color: '#38bdf8',
              shootTimer: 60,
              vx: (Math.random() - 0.5) * 2
            });
          } else if (typeRand < 0.88) {
            // Heavy grunt
            s.enemies.push({
              id: Math.random(),
              x: Math.random() * (w - 50) + 15,
              y: -40,
              w: 38,
              h: 32,
              hp: 3,
              maxHp: 3,
              type: 'grunt',
              color: '#f43f5e',
              shootTimer: 80,
              vx: (Math.random() - 0.5) * 1.5
            });
          } else if (s.score > 200 && !s.enemies.some(e => e.type === 'boss')) {
            // Boss
            s.enemies.push({
              id: Math.random(),
              x: w / 2 - 35,
              y: -60,
              w: 70,
              h: 50,
              hp: 20,
              maxHp: 20,
              type: 'boss',
              color: '#a855f7',
              shootTimer: 40,
              vx: 2
            });
          }
        }

        // Update Bullets
        s.bullets.forEach(b => {
          b.x += b.vx;
          b.y += b.vy;
        });
        s.bullets = s.bullets.filter(b => b.y > -20 && b.x > -20 && b.x < w + 20);

        // Update Enemy Bullets
        s.enemyBullets.forEach(eb => {
          eb.x += eb.vx;
          eb.y += eb.vy;
          // Player hit check
          if (s.player.invulnerable <= 0) {
            const px = s.player.x + s.player.w / 2;
            const py = s.player.y + s.player.h / 2;
            if (Math.hypot(eb.x - px, eb.y - py) < 16) {
              eb.y = h + 100; // remove
              s.player.lives--;
              setLives(s.player.lives);
              s.player.invulnerable = 90;
              sound.playHit();

              for (let i = 0; i < 12; i++) {
                s.particles.push({
                  x: px,
                  y: py,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: '#ec4899',
                  life: 25,
                  size: 3
                });
              }

              if (s.player.lives <= 0) {
                s.running = false;
                setGameState('gameover');
                sound.playGameOver();
                onGameOver(s.score, s.coins);
              }
            }
          }
        });
        s.enemyBullets = s.enemyBullets.filter(eb => eb.y < h + 20);

        // Update Enemies
        s.enemies.forEach(e => {
          if (e.type === 'boss') {
            if (e.y < 50) e.y += 1;
            e.x += e.vx;
            if (e.x < 20 || e.x + e.w > w - 20) e.vx *= -1;

            e.shootTimer--;
            if (e.shootTimer <= 0) {
              e.shootTimer = 35;
              s.enemyBullets.push({ x: e.x + 15, y: e.y + e.h, vx: -1.5, vy: 4.5, color: '#c084fc' });
              s.enemyBullets.push({ x: e.x + e.w / 2, y: e.y + e.h, vx: 0, vy: 5, color: '#f43f5e' });
              s.enemyBullets.push({ x: e.x + e.w - 15, y: e.y + e.h, vx: 1.5, vy: 4.5, color: '#c084fc' });
            }
          } else {
            e.y += e.type === 'drone' ? 3.2 : 2.0;
            e.x += e.vx;
            if (e.x < 10 || e.x + e.w > w - 10) e.vx *= -1;

            e.shootTimer--;
            if (e.shootTimer <= 0 && e.type === 'grunt') {
              e.shootTimer = 70;
              s.enemyBullets.push({ x: e.x + e.w / 2, y: e.y + e.h, vx: 0, vy: 4.5, color: '#f87171' });
            }
          }

          // Check Bullet -> Enemy Collision
          s.bullets.forEach(b => {
            if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
              b.y = -100; // remove bullet
              e.hp -= b.damage;
              sound.playHit();

              for (let i = 0; i < 4; i++) {
                s.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#ffffff',
                  life: 15,
                  size: 2
                });
              }

              if (e.hp <= 0) {
                sound.playExplosion();
                s.score += e.type === 'boss' ? 250 : e.type === 'grunt' ? 40 : 20;
                setScore(s.score);
                if (onScoreUpdate) onScoreUpdate(s.score);

                // Explosions
                const count = e.type === 'boss' ? 35 : 14;
                for (let i = 0; i < count; i++) {
                  s.particles.push({
                    x: e.x + e.w / 2,
                    y: e.y + e.h / 2,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    color: e.color,
                    life: 30,
                    size: 3.5
                  });
                }

                // Drop powerups
                const dropRand = Math.random();
                if (dropRand < 0.25) {
                  s.powerups.push({ x: e.x + e.w / 2, y: e.y + e.h / 2, type: 'coin', color: '#facc15' });
                } else if (dropRand < 0.45 && s.player.weaponLevel < 3) {
                  s.powerups.push({ x: e.x + e.w / 2, y: e.y + e.h / 2, type: 'weapon', color: '#06b6d4' });
                }
              }
            }
          });

          // Check Enemy -> Player collision
          if (s.player.invulnerable <= 0) {
            const px = s.player.x + s.player.w / 2;
            const py = s.player.y + s.player.h / 2;
            const ex = e.x + e.w / 2;
            const ey = e.y + e.h / 2;
            if (Math.hypot(px - ex, py - ey) < 26) {
              s.player.lives--;
              setLives(s.player.lives);
              s.player.invulnerable = 90;
              sound.playHit();
              if (s.player.lives <= 0) {
                s.running = false;
                setGameState('gameover');
                sound.playGameOver();
                onGameOver(s.score, s.coins);
              }
            }
          }
        });
        s.enemies = s.enemies.filter(e => e.hp > 0 && e.y < h + 50);

        // Update Powerups
        s.powerups.forEach(p => {
          p.y += 2.2;
          const px = s.player.x + s.player.w / 2;
          const py = s.player.y + s.player.h / 2;
          if (Math.hypot(p.x - px, p.y - py) < 24) {
            p.y = h + 100; // collected
            if (p.type === 'weapon') {
              s.player.weaponLevel = Math.min(3, s.player.weaponLevel + 1);
              setWeaponLevel(s.player.weaponLevel);
              sound.playPowerup();
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

        // Update Stars
        s.stars.forEach(st => {
          st.y += st.speed;
          if (st.y > h) st.y = 0;
        });
      }

      // RENDER
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, w, h);

      // Stars
      s.stars.forEach(st => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(st.x, st.y, st.size, st.size);
      });

      // Draw Bullets
      s.bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x - 2, b.y - 6, 4, 12);
        ctx.shadowBlur = 0;
      });

      // Draw Enemy Bullets
      s.enemyBullets.forEach(eb => {
        ctx.fillStyle = eb.color;
        ctx.shadowColor = eb.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(eb.x, eb.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Enemies
      s.enemies.forEach(e => {
        ctx.save();
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;

        if (e.type === 'drone') {
          ctx.beginPath();
          ctx.moveTo(e.x + e.w / 2, e.y + e.h);
          ctx.lineTo(e.x, e.y);
          ctx.lineTo(e.x + e.w, e.y);
          ctx.closePath();
          ctx.fill();
        } else if (e.type === 'boss') {
          ctx.beginPath();
          ctx.roundRect(e.x, e.y, e.w, e.h, 8);
          ctx.fill();
          // Boss eyes
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(e.x + 14, e.y + 16, 10, 8);
          ctx.fillRect(e.x + e.w - 24, e.y + 16, 10, 8);
          // HP bar
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(e.x, e.y - 10, e.w, 5);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(e.x, e.y - 10, (e.w * e.hp) / e.maxHp, 5);
        } else {
          // Grunt
          ctx.beginPath();
          ctx.roundRect(e.x, e.y, e.w, e.h, 6);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(e.x + 8, e.y + 10, e.w - 16, 4);
        }
        ctx.restore();
      });

      // Draw Powerups
      s.powerups.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.type === 'weapon' ? 'W' : '$', p.x, p.y);
        ctx.restore();
      });

      // Draw Player Spaceship
      if (s.player.invulnerable % 8 < 4) {
        ctx.save();
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 14;

        const px = s.player.x;
        const py = s.player.y;
        const pw = s.player.w;
        const ph = s.player.h;

        ctx.beginPath();
        ctx.moveTo(px + pw / 2, py);
        ctx.lineTo(px + pw, py + ph);
        ctx.lineTo(px + pw / 2, py + ph - 8);
        ctx.lineTo(px, py + ph);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph / 2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Thruster flame
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(px + pw / 2 - 4, py + ph - 6);
        ctx.lineTo(px + pw / 2 + 4, py + ph - 6);
        ctx.lineTo(px + pw / 2, py + ph + 8 + Math.random() * 6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Draw Particles
      s.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, onGameOver, onScoreUpdate, shoot]);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-pink-500/30 rounded-t-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-pink-400 font-mono font-bold text-lg">
            <span>Skor: {score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
            <span>🪙 {coins}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-md">
            <Zap className="w-3 h-3" /> Senjata Lvl {weaponLevel}
          </div>
          <div className="flex items-center gap-0.5 text-rose-400">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-base ${i < lives ? 'opacity-100' : 'opacity-20'}`}>
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas with Enhanced Touch Tracking */}
      <div className="relative w-full bg-black rounded-b-xl overflow-hidden border border-t-0 border-pink-500/30 shadow-2xl shadow-purple-950/40">
        <canvas
          ref={canvasRef}
          width={450}
          height={480}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-auto block touch-none cursor-crosshair"
        />

        {/* Start / Game Over Overlay */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            {gameState === 'idle' ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mb-3 shadow-lg shadow-pink-500/20">
                  <Play className="w-7 h-7 text-pink-400 fill-pink-400 translate-x-0.5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-1">GALAXY STRIKE 3000</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-5">
                  Geser jari di layar untuk manuver pesawat, hindari laser musuh & kumpulkan upgrade!
                </p>
                <button
                  id="btn-space-strike-start"
                  onClick={startGame}
                  className="px-7 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-pink-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[48px]"
                >
                  Luncurkan Pesawat (Ketuk / Spasi)
                </button>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">💥</div>
                <h3 className="text-2xl font-black text-rose-500 mb-1">MISI GAGAL!</h3>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-6 py-3 my-3 flex gap-6">
                  <div>
                    <div className="text-xs text-slate-400">Skor Tempur</div>
                    <div className="text-2xl font-black text-pink-400 font-mono">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Koin Diperoleh</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">+{coins}</div>
                  </div>
                </div>
                <button
                  id="btn-space-strike-retry"
                  onClick={startGame}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer min-h-[48px]"
                >
                  <RotateCcw className="w-4 h-4" /> Ulangi Misi
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Controls & Auto-Fire Toggle */}
      <div className="w-full mt-3 flex flex-col gap-2 px-1">
        <div className="flex items-center gap-2">
          <button
            id="btn-space-autofire"
            onClick={() => {
              const next = !autoFire;
              setAutoFire(next);
              stateRef.current.autoFire = next;
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
              autoFire
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Auto Tembak: {autoFire ? 'ON ⚡' : 'OFF'}</span>
          </button>

          <button
            id="btn-space-shoot-touch"
            onClick={shoot}
            disabled={gameState !== 'playing'}
            className="flex-1 py-2.5 px-3 bg-gradient-to-r from-pink-600 to-purple-600 active:from-pink-700 active:to-purple-700 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 touch-manipulation disabled:opacity-40 min-h-[44px] cursor-pointer"
          >
            <span>🚀 Laser Turbo</span>
          </button>
        </div>

        {/* Dual Thumb Directional Steer Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          <button
            onPointerDown={() => { stateRef.current.keys.left = true; }}
            onPointerUp={() => { stateRef.current.keys.left = false; }}
            onPointerCancel={() => { stateRef.current.keys.left = false; }}
            disabled={gameState !== 'playing'}
            className="py-3 bg-slate-900/80 active:bg-slate-700 border border-slate-700/60 rounded-xl text-slate-200 font-bold text-sm flex items-center justify-center gap-1 select-none min-h-[48px] disabled:opacity-40"
          >
            <span>⬅️ Geser Kiri</span>
          </button>
          <button
            onPointerDown={() => { stateRef.current.keys.right = true; }}
            onPointerUp={() => { stateRef.current.keys.right = false; }}
            onPointerCancel={() => { stateRef.current.keys.right = false; }}
            disabled={gameState !== 'playing'}
            className="py-3 bg-slate-900/80 active:bg-slate-700 border border-slate-700/60 rounded-xl text-slate-200 font-bold text-sm flex items-center justify-center gap-1 select-none min-h-[48px] disabled:opacity-40"
          >
            <span>Geser Kanan ➡️</span>
          </button>
        </div>
      </div>
    </div>
  );
};
