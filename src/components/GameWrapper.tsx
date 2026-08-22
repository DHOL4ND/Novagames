import React, { useState } from 'react';
import { GameMetadata, PlayerProfile } from '../types';
import { sound } from '../utils/audio';
import { ArrowLeft, Maximize2, Minimize2, RotateCcw, Volume2, VolumeX, Trophy, Sparkles, HelpCircle, Gamepad } from 'lucide-react';
import { CyberRunner } from '../games/CyberRunner';
import { SpaceStrike } from '../games/SpaceStrike';
import { BlockBreaker } from '../games/BlockBreaker';
import { NeonSnake } from '../games/NeonSnake';
import { Cyber2048 } from '../games/Cyber2048';
import { FlappyCyber } from '../games/FlappyCyber';
import { MonsterStrike } from '../games/MonsterStrike';
import { MemoryMatrix } from '../games/MemoryMatrix';

interface GameWrapperProps {
  game: GameMetadata;
  profile: PlayerProfile;
  onBack: () => void;
  onGameOver: (gameId: string, score: number, coins: number) => void;
}

export const GameWrapper: React.FC<GameWrapperProps> = ({
  game,
  profile,
  onBack,
  onGameOver
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [muted, setMuted] = useState(sound.getMuted());
  const [currentScore, setCurrentScore] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  const highScore = profile.highScores[game.id] || 0;

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const handleRestart = () => {
    sound.playClick();
    setRestartKey(k => k + 1);
    setCurrentScore(0);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('game-container-fullscreen');
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const renderGameComponent = () => {
    const gameProps = {
      onGameOver: (score: number, coins: number) => onGameOver(game.id, score, coins),
      onScoreUpdate: (score: number) => setCurrentScore(score)
    };

    switch (game.id) {
      case 'cyber-runner':
        return <CyberRunner key={restartKey} {...gameProps} />;
      case 'space-strike':
        return <SpaceStrike key={restartKey} {...gameProps} />;
      case 'block-breaker':
        return <BlockBreaker key={restartKey} {...gameProps} />;
      case 'neon-snake':
        return <NeonSnake key={restartKey} {...gameProps} />;
      case 'cyber-2048':
        return <Cyber2048 key={restartKey} {...gameProps} />;
      case 'flappy-cyber':
        return <FlappyCyber key={restartKey} {...gameProps} />;
      case 'monster-strike':
        return <MonsterStrike key={restartKey} {...gameProps} />;
      case 'memory-matrix':
        return <MemoryMatrix key={restartKey} {...gameProps} />;
      default:
        return <div className="text-white p-8">Game tidak ditemukan</div>;
    }
  };

  return (
    <div
      id="game-container-fullscreen"
      className="min-h-screen bg-[#0A0B10] flex flex-col justify-between py-4 px-3 sm:px-6 relative overflow-x-hidden"
    >
      {/* Background Ambience Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: game.accentColor }}
      />

      {/* Top Game Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between gap-2 mb-3 z-10 bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl px-4 py-2.5 shadow-lg">
        <button
          id="btn-game-back"
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
          <span>Kembali ke Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-center hidden sm:block">
            <h2 className="text-sm font-bold text-white tracking-tight">{game.title}</h2>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>Rekor Terbaik:</span>
              <span className="text-amber-400 font-mono font-bold">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Quick Game Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="btn-game-help-toggle"
            onClick={() => setShowHelp(!showHelp)}
            className={`p-1.5 rounded-full border transition-all cursor-pointer ${
              showHelp
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 text-slate-400 hover:text-white'
            }`}
            title="Petunjuk & Kontrol"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            id="btn-game-restart-top"
            onClick={handleRestart}
            className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Mulai Ulang"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="btn-game-mute-toggle"
            onClick={toggleMute}
            className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white transition-all cursor-pointer"
            title={muted ? 'Buka Suara' : 'Bisukan'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            id="btn-game-fullscreen"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white transition-all cursor-pointer hidden sm:block"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Control Help Drawer if open */}
      {showHelp && (
        <div className="max-w-xl w-full mx-auto mb-3 p-4 bg-[#0D0F18]/95 border border-indigo-500/40 rounded-2xl backdrop-blur-md shadow-xl text-xs z-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between font-bold text-indigo-300 text-sm mb-2">
            <div className="flex items-center gap-1.5">
              <Gamepad className="w-4 h-4" />
              <span>Petunjuk & Kontrol {game.title}</span>
            </div>
            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <p className="text-slate-300 mb-3">{game.description}</p>

          <div className="space-y-2">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              <div className="text-slate-400 font-semibold mb-1">⌨️ Keyboard:</div>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {game.controls.keyboard.map((ctrl, i) => (
                  <li key={i}>{ctrl}</li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              <div className="text-slate-400 font-semibold mb-1">📱 Layar Sentuh / HP:</div>
              <div className="text-slate-300">{game.controls.touch}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Frame */}
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-center items-center z-10 py-2">
        {renderGameComponent()}
      </div>

      {/* Bottom Info Footnote */}
      <div className="max-w-4xl w-full mx-auto mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900 pt-2 px-2 z-10">
        <div className="flex items-center gap-2">
          <span>Kategori: <strong className="text-slate-400">{game.categoryName}</strong></span>
          <span>•</span>
          <span>Rating: <strong className="text-amber-400">★ {game.rating}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Audio Sintesis 8-Bit Aktif</span>
        </div>
      </div>
    </div>
  );
};
