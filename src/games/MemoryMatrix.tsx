import React, { useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

interface MemoryMatrixProps {
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate?: (score: number) => void;
}

interface Card {
  id: number;
  symbol: string;
  name: string;
  flipped: boolean;
  matched: boolean;
  color: string;
}

const ICONS = [
  { symbol: '🚀', name: 'Rocket', color: 'from-pink-500 to-rose-600' },
  { symbol: '⚡', name: 'Bolt', color: 'from-amber-400 to-yellow-500' },
  { symbol: '💎', name: 'Diamond', color: 'from-cyan-400 to-blue-500' },
  { symbol: '👾', name: 'Alien', color: 'from-purple-500 to-indigo-600' },
  { symbol: '🔥', name: 'Fire', color: 'from-orange-500 to-red-600' },
  { symbol: '🛸', name: 'UFO', color: 'from-emerald-400 to-teal-600' },
  { symbol: '⭐', name: 'Star', color: 'from-yellow-300 to-amber-500' },
  { symbol: '🛡️', name: 'Shield', color: 'from-blue-400 to-indigo-600' }
];

export const MemoryMatrix: React.FC<MemoryMatrixProps> = ({ onGameOver, onScoreUpdate }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');

  const initGame = useCallback(() => {
    // 8 pairs = 16 cards (4x4)
    const selected = ICONS.slice(0, 8);
    const deck = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({
        id: idx,
        symbol: item.symbol,
        name: item.name,
        color: item.color,
        flipped: false,
        matched: false
      }));

    setCards(deck);
    setFlippedIndices([]);
    setScore(0);
    setCoins(0);
    setMoves(0);
    setCombo(0);
    setGameState('playing');
    sound.playClick();
  }, []);

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing') return;
    if (cards[index].flipped || cards[index].matched) return;
    if (flippedIndices.length >= 2) return;

    sound.playClick();

    // Flip card
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.name === secondCard.name) {
        // MATCH!
        setTimeout(() => {
          firstCard.matched = true;
          secondCard.matched = true;
          setCards([...newCards]);
          setFlippedIndices([]);

          const nextCombo = combo + 1;
          setCombo(nextCombo);
          sound.playCombo();

          const pts = 50 + nextCombo * 15;
          const newScore = score + pts;
          const newCoins = coins + (nextCombo > 1 ? 2 : 1);
          setScore(newScore);
          setCoins(newCoins);
          if (onScoreUpdate) onScoreUpdate(newScore);

          // Check if all matched
          if (newCards.every(c => c.matched)) {
            setGameState('won');
            sound.playVictory();
            onGameOver(newScore + 200, newCoins + 10);
          }
        }, 350);
      } else {
        // NO MATCH
        setTimeout(() => {
          firstCard.flipped = false;
          secondCard.flipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
          setCombo(0);
          sound.playHit();
        }, 800);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 border border-violet-500/30 rounded-t-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="text-violet-400 font-mono font-bold text-base">
            Skor: {score}
          </div>
          <div className="text-amber-400 font-mono font-bold text-sm">
            🪙 {coins}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-violet-500/20 text-violet-300 border border-violet-400/40 rounded-full animate-pulse">
              <Sparkles className="w-3 h-3" /> Streak x{combo}
            </div>
          )}
          <span className="text-xs text-slate-400">Langkah: {moves}</span>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="relative w-full aspect-square bg-slate-950 p-3 rounded-b-xl border border-t-0 border-violet-500/30 grid grid-cols-4 gap-2.5 shadow-2xl shadow-violet-950/40">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            id={`btn-card-${idx}`}
            onClick={() => handleCardClick(idx)}
            disabled={card.matched}
            className={`w-full h-full rounded-xl border flex items-center justify-center font-bold text-2xl sm:text-3xl transition-all duration-300 transform active:scale-90 cursor-pointer ${
              card.matched
                ? 'bg-violet-950/40 border-violet-500/30 opacity-60'
                : card.flipped
                ? `bg-gradient-to-br ${card.color} border-white text-white shadow-lg shadow-violet-500/30 scale-95`
                : 'bg-slate-900 border-slate-700 hover:border-violet-500/60 hover:bg-slate-800'
            }`}
          >
            {card.flipped || card.matched ? (
              <span>{card.symbol}</span>
            ) : (
              <span className="text-sm font-mono text-slate-600">⚡</span>
            )}
          </button>
        ))}

        {/* Overlay */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-b-xl flex flex-col items-center justify-center p-6 text-center z-10">
            {gameState === 'idle' ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center mb-3 shadow-lg shadow-violet-500/20">
                  <Play className="w-7 h-7 text-violet-400 fill-violet-400 translate-x-0.5" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-wide mb-1">MEMORY MATRIX CYBER</h3>
                <p className="text-xs text-slate-300 max-w-xs mb-5">
                  Buka dan cocokkan pasangan simbol cyber! Jaga streak kombo untuk poin berlipat ganda!
                </p>
                <button
                  id="btn-memory-start"
                  onClick={initGame}
                  className="px-7 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-bold text-base rounded-xl shadow-lg shadow-violet-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Mulai Asah Otak
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-1">🧠</div>
                <h3 className="text-2xl font-black text-violet-400 mb-1">MEMORI SEMPURNA!</h3>
                <p className="text-xs text-slate-300 mb-4">Kamu berhasil menyelesaikan seluruh matriks dalam {moves} langkah!</p>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-6 py-3 my-3 flex gap-6">
                  <div>
                    <div className="text-xs text-slate-400">Total Skor</div>
                    <div className="text-2xl font-black text-violet-400 font-mono">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Koin Diperoleh</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">+{coins}</div>
                  </div>
                </div>
                <button
                  id="btn-memory-retry"
                  onClick={initGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-violet-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Main Lagi
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
