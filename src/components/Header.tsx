import React, { useState } from 'react';
import { PlayerProfile, DailyQuest } from '../types';
import { sound } from '../utils/audio';
import { AVATAR_LIST } from '../data/games';
import { Coins, Dices, Edit3, Flame, Gamepad2, Gift, Search, ShoppingBag, Sparkles, Trophy, User, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  profile: PlayerProfile;
  quests: DailyQuest[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenProfile: () => void;
  onOpenQuests: () => void;
  onOpenRandom: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenNickname: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  quests,
  searchQuery,
  onSearchChange,
  onOpenProfile,
  onOpenQuests,
  onOpenRandom,
  onOpenShop,
  onOpenLeaderboard,
  onOpenNickname
}) => {
  const [muted, setMuted] = useState(sound.getMuted());
  const [volume, setVolume] = useState(sound.getVolume());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
    if (val > 0 && muted) {
      setMuted(false);
      sound.setMuted(false);
    }
  };

  const activeAvatar = AVATAR_LIST.find(a => a.id === profile.avatar) || AVATAR_LIST[0];
  const unclaimedQuests = quests.filter(q => q.completed && !q.claimed).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/40 backdrop-blur-md border-b border-slate-800/50 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0A0B10] rounded-[7px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-lg tracking-tight text-white">
                  NOVA<span className="text-indigo-400">ARCADE</span>
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Sleek Web Game Center</p>
            </div>
          </div>

          {/* Mobile Actions: Leaderboard, Shop, Sound & Profile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              id="btn-leaderboard-mobile"
              onClick={() => {
                sound.playClick();
                onOpenLeaderboard();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
              title="Papan Skor & Level"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Peringkat</span>
            </button>
            <button
              id="btn-shop-mobile"
              onClick={() => {
                sound.playClick();
                onOpenShop();
              }}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-amber-300 hover:bg-slate-800"
              title="Toko Karakter"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <button
              id="btn-sound-mobile"
              onClick={toggleMute}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              id="btn-profile-mobile"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-white"
            >
              <span>{activeAvatar.icon}</span>
              <span className="font-bold text-amber-400 font-mono">Lv.{profile.level}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-game-search"
            type="text"
            placeholder="Cari game (Runner, Snake, 2048...)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-800/40 hover:bg-slate-800/60 focus:bg-slate-900 border border-slate-700/50 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/30 rounded-full text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Hub & Profile (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Leaderboard Button */}
          <button
            id="btn-leaderboard-header"
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm shadow-amber-500/10"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Papan Peringkat</span>
          </button>

          {/* Shop Button */}
          <button
            id="btn-shop"
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="px-3.5 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Toko</span>
          </button>

          {/* Spin Random Game Button */}
          <button
            id="btn-random-game"
            onClick={() => {
              sound.playClick();
              onOpenRandom();
            }}
            className="px-3.5 py-1.5 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            <Dices className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Acak</span>
          </button>

          {/* Daily Quests Button */}
          <button
            id="btn-quests"
            onClick={() => {
              sound.playClick();
              onOpenQuests();
            }}
            className="relative px-3.5 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/40 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Misi</span>
            {unclaimedQuests > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center border-2 border-slate-900 animate-bounce">
                {unclaimedQuests}
              </span>
            )}
          </button>

          {/* Sound Controls */}
          <div className="relative">
            <button
              id="btn-sound-desktop"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title={muted ? 'Buka Suara' : 'Bisukan Suara'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Volume dropdown slider */}
            {showVolumeSlider && (
              <div
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute right-0 top-full mt-2 p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl z-50 flex items-center gap-2 w-36"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Player Nickname & Profile Quick View */}
          <div className="flex items-center gap-1 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-indigo-500/40 rounded-full pl-2 pr-3 py-1 transition-all">
            <button
              id="btn-player-profile"
              onClick={() => {
                sound.playClick();
                onOpenProfile();
              }}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${activeAvatar.color} flex items-center justify-center text-sm shadow-md`}>
                {activeAvatar.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none mb-0.5">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors max-w-[110px] truncate">
                    {profile.name}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Lv.{profile.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 font-bold leading-none">
                  <span className="flex items-center gap-0.5">🪙 {profile.coins}</span>
                  <span className="text-slate-400 font-sans text-[10px]">✨ {profile.xp % 200}/200 XP</span>
                </div>
              </div>
            </button>
            <button
              id="btn-quick-edit-nickname"
              onClick={() => {
                sound.playClick();
                onOpenNickname();
              }}
              className="p-1 text-slate-400 hover:text-indigo-300 transition-colors ml-1 cursor-pointer"
              title="Ganti Nickname"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
