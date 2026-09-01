import React, { useState } from 'react';
import { GameMetadata } from '../types';
import { GAMES_DATA } from '../data/games';
import { sound } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/storage';
import { Dices, Play, Sparkles, X } from 'lucide-react';
import { GamePreview } from './GamePreview';

interface RandomGameModalProps {
  onClose: () => void;
  onSelectGame: (gameId: string) => void;
}

export const RandomGameModal: React.FC<RandomGameModalProps> = ({
  onClose,
  onSelectGame
}) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameMetadata | null>(null);
  const [displayIndex, setDisplayIndex] = useState(0);

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelectedGame(null);
    sound.playClick();

    let counter = 0;
    const totalSteps = 25;
    let speed = 60;

    const spinStep = () => {
      const idx = Math.floor(Math.random() * GAMES_DATA.length);
      setDisplayIndex(idx);
      sound.playClick();
      counter++;

      if (counter < totalSteps) {
        speed += 12;
        setTimeout(spinStep, speed);
      } else {
        const finalGame = GAMES_DATA[idx];
        setSelectedGame(finalGame);
        setSpinning(false);
        sound.playVictory();
        fireCelebrationConfetti();
      }
    };

    spinStep();
  };

  const currentGame = GAMES_DATA[displayIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D0F18] border border-slate-800/80 rounded-3xl p-6 shadow-2xl shadow-indigo-950/40 flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          id="btn-close-random"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20">
          <Dices className={`w-6 h-6 text-indigo-400 ${spinning ? 'animate-spin' : ''}`} />
        </div>
        <h3 className="text-xl font-bold text-white">Putar Game Acak</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1 mb-6">
          Bingung mau main apa? Biarkan roda keberuntungan arkade memilihkan game seru untukmu!
        </p>

        {/* Display Card */}
        <div className="w-full p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center mb-6">
          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner bg-slate-950 flex flex-col items-center justify-center">
            <GamePreview gameId={currentGame.id} isHovered={true} />
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-[10px] font-bold text-white backdrop-blur-md">
              {currentGame.categoryName}
            </div>
          </div>

          <div className="mt-3 text-center">
            <h4 className="text-base font-bold text-white tracking-wide">{currentGame.title}</h4>
            <p className="text-xs text-slate-300 mt-1 px-2 line-clamp-2 leading-relaxed">
              {currentGame.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {selectedGame ? (
          <div className="flex gap-3 w-full">
            <button
              onClick={startSpin}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-full transition-all cursor-pointer"
            >
              Putar Lagi
            </button>
            <button
              id="btn-play-random-selected"
              onClick={() => {
                sound.playClick();
                onSelectGame(selectedGame.id);
              }}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-xs rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-1.5 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Mainkan Sekarang</span>
            </button>
          </div>
        ) : (
          <button
            id="btn-start-spin"
            onClick={startSpin}
            disabled={spinning}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-xs rounded-full shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>{spinning ? 'Memilih Game...' : 'Mulai Putar Keberuntungan'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
