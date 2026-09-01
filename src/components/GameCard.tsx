import React, { useState } from 'react';
import { GameMetadata } from '../types';
import { Flame, Heart, Play, Sparkles, Star, Trophy, Zap, Layers, Rocket, Grid, Feather, Target, Cpu, Swords, Users, Eye } from 'lucide-react';
import { sound } from '../utils/audio';
import { GamePreview } from './GamePreview';

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
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ICON_MAP[game.iconName] || Zap;

  return (
    <div
      id={`game-card-${game.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 hover:border-indigo-500/60 rounded-2xl p-3.5 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-950/50 hover:-translate-y-1.5 backdrop-blur-md"
    >
      <div>
        {/* Top Interactive Gameplay Preview Window */}
        <div 
          onClick={() => {
            sound.playClick();
            onPlay(game.id);
          }}
          className="relative w-full h-40 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 cursor-pointer group-hover:border-indigo-400/60 transition-all bg-slate-950"
        >
          {/* Actual Gameplay Scene Preview */}
          <GamePreview gameId={game.id} isHovered={isHovered} />

          {/* CRT Retro Scanline & Vignette Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />

          {/* Top Badges & Favorite Button */}
          <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between pointer-events-auto">
            {game.thumbnailBadge ? (
              <span className="text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-md border border-white/20 shadow-md">
                {game.thumbnailBadge}
              </span>
            ) : (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-indigo-300 backdrop-blur-md border border-indigo-500/30">
                LIVE PREVIEW
              </span>
            )}

            <button
              id={`btn-fav-${game.id}`}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onToggleFavorite(game.id);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-md ${
                isFavorite
                  ? 'bg-rose-500/40 border-rose-400 text-rose-300 scale-110'
                  : 'bg-black/60 border-white/20 text-slate-300 hover:text-rose-400 hover:bg-black/80 hover:scale-105'
              }`}
              title={isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>
          </div>

          {/* Floating Hover Play Hint */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none z-10">
            <div className="px-3.5 py-1.5 rounded-full bg-indigo-600/90 text-white font-bold text-xs flex items-center gap-1.5 border border-indigo-300/50 shadow-lg shadow-indigo-500/40 transform scale-95 group-hover:scale-100 transition-transform">
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Klik untuk Main</span>
            </div>
          </div>

          {/* Bottom Overlay in Preview: Icon & HighScore */}
          <div className="absolute bottom-2 inset-x-2.5 z-20 flex items-center justify-between pointer-events-none">
            <div className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-md">
              <IconComponent className="w-4 h-4 text-cyan-300" />
            </div>

            {highScore > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 bg-black/75 text-amber-300 rounded-md border border-amber-400/40 backdrop-blur-md shadow-md">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>{highScore}</span>
              </div>
            )}
          </div>
        </div>

        {/* Title and Category */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {game.categoryName}
            </span>
            <div className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
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
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {game.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-300 border border-slate-700/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Play Button */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">
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
