import React, { useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';
import { RotateCcw, Sparkles, Undo2 } from 'lucide-react';

interface Cyber2048Props {
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate?: (score: number) => void;
}

type Board = number[][];

export const Cyber2048: React.FC<Cyber2048Props> = ({ onGameOver, onScoreUpdate }) => {
  const [board, setBoard] = useState<Board>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState<{ board: Board; score: number } | null>(null);

  const getEmptyCells = (b: Board) => {
    const cells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) cells.push({ r, c });
      }
    }
    return cells;
  };

  const addRandomTile = useCallback((b: Board): Board => {
    const empty = getEmptyCells(b);
    if (empty.length === 0) return b;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const newBoard = b.map(row => [...row]);
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }, []);

  const initGame = useCallback(() => {
    let b: Board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    b = addRandomTile(b);
    b = addRandomTile(b);
    setBoard(b);
    setScore(0);
    setCoins(0);
    setGameOver(false);
    setWon(false);
    setHistory(null);
    sound.playClick();
  }, [addRandomTile]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const checkGameOver = (b: Board): boolean => {
    if (getEmptyCells(b).length > 0) return false;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = b[r][c];
        if (r < 3 && val === b[r + 1][c]) return false;
        if (c < 3 && val === b[r][c + 1]) return false;
      }
    }
    return true;
  };

  const slideRow = (row: number[]): { newRow: number[]; gainedScore: number; merged: boolean } => {
    const filtered = row.filter(x => x !== 0);
    const newRow: number[] = [];
    let gainedScore = 0;
    let merged = false;

    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        newRow.push(mergedVal);
        gainedScore += mergedVal;
        merged = true;
        i++;
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }
    return { newRow, gainedScore, merged };
  };

  const move = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (gameOver) return;

      let changed = false;
      let totalGained = 0;
      let anyMerged = false;
      const newBoard: Board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      // Save state for undo
      const prevBoard = board.map(r => [...r]);
      const prevScore = score;

      if (direction === 'left') {
        for (let r = 0; r < 4; r++) {
          const res = slideRow(board[r]);
          newBoard[r] = res.newRow;
          totalGained += res.gainedScore;
          if (res.merged) anyMerged = true;
          if (res.newRow.some((val, idx) => val !== board[r][idx])) changed = true;
        }
      } else if (direction === 'right') {
        for (let r = 0; r < 4; r++) {
          const reversed = [...board[r]].reverse();
          const res = slideRow(reversed);
          newBoard[r] = res.newRow.reverse();
          totalGained += res.gainedScore;
          if (res.merged) anyMerged = true;
          if (newBoard[r].some((val, idx) => val !== board[r][idx])) changed = true;
        }
      } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
          const col = [board[0][c], board[1][c], board[2][c], board[3][c]];
          const res = slideRow(col);
          for (let r = 0; r < 4; r++) {
            newBoard[r][c] = res.newRow[r];
            if (newBoard[r][c] !== board[r][c]) changed = true;
          }
          totalGained += res.gainedScore;
          if (res.merged) anyMerged = true;
        }
      } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
          const col = [board[3][c], board[2][c], board[1][c], board[0][c]];
          const res = slideRow(col);
          for (let r = 0; r < 4; r++) {
            newBoard[3 - r][c] = res.newRow[r];
            if (newBoard[3 - r][c] !== board[3 - r][c]) changed = true;
          }
          totalGained += res.gainedScore;
          if (res.merged) anyMerged = true;
        }
      }

      if (changed) {
        setHistory({ board: prevBoard, score: prevScore });
        const spawnedBoard = addRandomTile(newBoard);
        const newScore = score + totalGained;
        setBoard(spawnedBoard);
        setScore(newScore);

        if (totalGained >= 64) {
          setCoins(c => c + Math.floor(totalGained / 64));
        }

        if (anyMerged) {
          sound.playCombo();
        } else {
          sound.playClick();
        }

        if (onScoreUpdate) onScoreUpdate(newScore);

        // Win check
        if (!won && spawnedBoard.some(row => row.some(cell => cell === 2048))) {
          setWon(true);
          sound.playVictory();
        }

        // Loss check
        if (checkGameOver(spawnedBoard)) {
          setGameOver(true);
          sound.playGameOver();
          onGameOver(newScore, Math.floor(newScore / 50));
        }
      }
    },
    [board, score, gameOver, won, addRandomTile, onGameOver, onScoreUpdate]
  );

  const undo = () => {
    if (history) {
      setBoard(history.board);
      setScore(history.score);
      setHistory(null);
      setGameOver(false);
      sound.playClick();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move('right');
      } else if (e.code === 'KeyU') {
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Tile styles by number
  const getTileStyle = (val: number) => {
    switch (val) {
      case 2:
        return 'bg-slate-800 text-cyan-300 border-cyan-500/30';
      case 4:
        return 'bg-slate-800 text-cyan-200 border-cyan-400/50 shadow-cyan-500/20';
      case 8:
        return 'bg-cyan-950 text-cyan-100 border-cyan-400 shadow-cyan-500/40';
      case 16:
        return 'bg-blue-900 text-blue-100 border-blue-400 shadow-blue-500/40';
      case 32:
        return 'bg-indigo-900 text-indigo-100 border-indigo-400 shadow-indigo-500/50';
      case 64:
        return 'bg-purple-900 text-purple-100 border-purple-400 shadow-purple-500/50';
      case 128:
        return 'bg-pink-900 text-pink-100 border-pink-400 shadow-pink-500/60 font-bold';
      case 256:
        return 'bg-rose-900 text-rose-100 border-rose-400 shadow-rose-500/70 font-bold';
      case 512:
        return 'bg-amber-900 text-amber-100 border-amber-400 shadow-amber-500/80 font-bold';
      case 1024:
        return 'bg-amber-600 text-slate-950 border-amber-300 shadow-amber-400 font-extrabold';
      case 2048:
        return 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 border-white shadow-xl animate-pulse font-black';
      default:
        return 'bg-slate-900/60 text-transparent border-slate-800';
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 border border-indigo-500/30 rounded-t-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="text-indigo-300 font-mono font-bold text-base">
            Skor: {score}
          </div>
          <div className="text-amber-400 font-mono font-bold text-sm">
            🪙 {coins}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-2048-undo"
            onClick={undo}
            disabled={!history}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs font-semibold text-indigo-300 flex items-center gap-1 border border-indigo-500/30 transition-all cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" /> Undo
          </button>
          <button
            id="btn-2048-restart"
            onClick={initGame}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Mulai Ulang"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative w-full aspect-square bg-slate-950 p-3 rounded-b-xl border border-t-0 border-indigo-500/30 grid grid-cols-4 gap-2.5 shadow-2xl shadow-indigo-950/50">
        {board.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-full h-full rounded-xl border flex items-center justify-center font-mono text-xl sm:text-2xl transition-all duration-150 shadow-md ${getTileStyle(
                val
              )}`}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}

        {/* Win / Over Overlay */}
        {(gameOver || won) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-b-xl flex flex-col items-center justify-center p-6 text-center z-10">
            {won ? (
              <>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mb-2 animate-bounce">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black text-amber-400 mb-1">2048 TERCAPAI!</h3>
                <p className="text-xs text-slate-300 mb-4">Luar biasa! Kamu berhasil menyatukan inti 2048!</p>
                <div className="flex gap-2">
                  <button
                    id="btn-2048-continue"
                    onClick={() => setWon(false)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Lanjut Main
                  </button>
                  <button
                    id="btn-2048-newgame"
                    onClick={initGame}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Game Baru
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">🚫</div>
                <h3 className="text-xl font-black text-rose-500 mb-1">TIDAK ADA GERAKAN</h3>
                <div className="text-xs text-slate-400 mb-4">Skor Akhir: {score}</div>
                <button
                  id="btn-2048-retry"
                  onClick={initGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Coba Lagi
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Onscreen Swipe / Directional Control Pad */}
      <div className="w-full mt-3 flex flex-col items-center gap-1.5 px-4">
        <button
          id="btn-2048-up"
          onClick={() => move('up')}
          className="w-14 h-11 bg-slate-800 border border-indigo-500/40 rounded-xl text-indigo-300 font-bold text-lg active:scale-95 flex items-center justify-center shadow-md touch-manipulation"
        >
          ▲
        </button>
        <div className="flex items-center gap-4">
          <button
            id="btn-2048-left"
            onClick={() => move('left')}
            className="w-14 h-11 bg-slate-800 border border-indigo-500/40 rounded-xl text-indigo-300 font-bold text-lg active:scale-95 flex items-center justify-center shadow-md touch-manipulation"
          >
            ◀
          </button>
          <button
            id="btn-2048-down"
            onClick={() => move('down')}
            className="w-14 h-11 bg-slate-800 border border-indigo-500/40 rounded-xl text-indigo-300 font-bold text-lg active:scale-95 flex items-center justify-center shadow-md touch-manipulation"
          >
            ▼
          </button>
          <button
            id="btn-2048-right"
            onClick={() => move('right')}
            className="w-14 h-11 bg-slate-800 border border-indigo-500/40 rounded-xl text-indigo-300 font-bold text-lg active:scale-95 flex items-center justify-center shadow-md touch-manipulation"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
