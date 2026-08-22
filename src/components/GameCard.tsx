import React from 'react';
import { GameMetadata } from '../types';
import { Flame, Heart, Play, Sparkles, Star, Trophy, Zap, Layers, Rocket, Grid, Feather, Target, Cpu, Swords, Users } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameCardProps {
  game: GameMetadata;
  highScore: number;
  isFavorite: boolean;
  onPlay: (gameId: string) => void;
  onToggleFavorite: (gameId: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Rocket,
  Layers,
  Flame,
  Grid,
  Feather,
  Target,
  Cpu,
  Swords,
  Users
};

export const GameCard: React.FC<GameCardProps> = ({
  game,
  highScore,
  isFavorite,
  onPlay,
  onToggleFavorite
}) => {
  const IconComponent = ICON_MAP[game.iconName] || Zap;

  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative flex flex-col justify-between bg-slate-900/30 hover:bg-slate-800/40 border border-slate-800/60 hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/30 hover:-translate-y-1 backdrop-blur-sm"
    >
      {/* Top Banner Gradient & Icon */}
      <div>
        <div className={`relative w-full h-32 rounded-xl bg-gradient-to-br ${game.bannerGradient} p-3 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-700/30`}>
          {/* Subtle Grid in Banner */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-15" />

          {/* Top Badge & Favorite Button */}
          <div className="relative z-10 flex items-center justify-between">
            {game.thumbnailBadge ? (
              <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20">
                {game.thumbnailBadge}
              </span>
            ) : (
              <span />
            )}

            <button
              id={`btn-fav-${game.id}`}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onToggleFavorite(game.id);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500/30 border-rose-400 text-rose-400 scale-110'
                  : 'bg-black/40 border-white/20 text-slate-300 hover:text-rose-400 hover:bg-black/60'
              }`}
              title={isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>

          {/* Center Floating Game Icon */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <IconComponent className="w-5 h-5 text-white" />
            </div>

            {highScore > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-1 bg-black/60 text-amber-300 rounded-lg border border-amber-400/30 backdrop-blur-md">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>{highScore}</span>
              </div>
            )}
          </div>
        </div>

        {/* Title and Category */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-medium mb-1">
            <span>{game.categoryName}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{game.rating}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
            {game.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {game.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/40 text-slate-400 border border-slate-700/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Play Button */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          {(game.plays / 1000).toFixed(1)}k dimainkan
        </span>

        <button
          id={`btn-play-${game.id}`}
          onClick={() => {
            sound.playClick();
            onPlay(game.id);
          }}
          className={`px-4 py-1.5 font-bold text-xs rounded-full shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
            game.isMultiplayerSupported
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-rose-500/25 ring-1 ring-rose-400/50'
              : 'bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 shadow-indigo-500/20'
          }`}
        >
          {game.isMultiplayerSupported ? (
            <Swords className="w-3.5 h-3.5 text-white" />
          ) : (
            <Play className="w-3 h-3 fill-slate-950" />
          )}
          <span>{game.isMultiplayerSupported ? 'Mabar 1v1' : 'Mainkan'}</span>
        </button>
      </div>
    </div>
  );
};
