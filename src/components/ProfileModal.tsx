import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { SHOP_CHARACTERS, INITIAL_ACHIEVEMENTS, GAMES_DATA } from '../data/games';
import { sound } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/storage';
import { Award, Check, Coins, Edit3, Flame, Gamepad2, Heart, Lock, Shield, ShoppingBag, Sparkles, Trophy, User, X } from 'lucide-react';

interface ProfileModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onUpdateProfile: (newProfile: PlayerProfile) => void;
  onOpenShop?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onUpdateProfile,
  onOpenShop
}) => {
  const [tab, setTab] = useState<'profile' | 'achievements' | 'stats'>('profile');
  const [nameInput, setNameInput] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleSaveProfile = () => {
    sound.playClick();
    onUpdateProfile({
      ...profile,
      name: nameInput.trim() || 'Gamer Nova',
      avatar: selectedAvatar
    });
    setIsEditingName(false);
  };

  const unlockedAvatars = profile.unlockedAvatars || ['cyber-samurai', 'pixel-wizard'];
  const unlockedCount = profile.unlockedAchievements.length;
  const totalAchievements = INITIAL_ACHIEVEMENTS.length;
  const activeChar = SHOP_CHARACTERS.find(a => a.id === selectedAvatar) || SHOP_CHARACTERS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0D0F18] border border-slate-800/80 rounded-3xl p-6 shadow-2xl shadow-indigo-950/40 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white">Profil & Prestasi Pemain</h3>
          </div>
          <button
            id="btn-close-profile"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 my-4 bg-slate-900/80 p-1 rounded-full border border-slate-800/60">
          <button
            onClick={() => {
              sound.playClick();
              setTab('profile');
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'profile'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profil
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTab('achievements');
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'achievements'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> Prestasi ({unlockedCount}/{totalAchievements})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTab('stats');
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'stats'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" /> Skor Game
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {tab === 'profile' && (
            <div className="space-y-5">
              {/* Level & XP Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80 border border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${activeChar.color} border border-indigo-400/30 flex items-center justify-center text-3xl shadow-md`}>
                    {activeChar.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{profile.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                        Level {profile.level}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Karakter: <strong className="text-slate-200">{activeChar.name}</strong> • Total: <strong className="text-slate-200">{profile.totalGamesPlayed} game</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-amber-400 font-mono flex items-center gap-1 justify-end">
                    <Coins className="w-4 h-4" /> {profile.coins} Koin
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    XP: {profile.xp % 200}/200
                  </div>
                </div>
              </div>

              {/* Edit Nickname */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Nama Panggilan / Nickname:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    maxLength={18}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-xs text-white outline-none"
                    placeholder="Masukkan nama kamu..."
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Avatar Selector with Shop Link */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">Pilih Avatar Aktif:</label>
                  {onOpenShop && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onClose();
                        onOpenShop();
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Beli Avatar di Toko</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {SHOP_CHARACTERS.map((char) => {
                    const isUnlocked = unlockedAvatars.includes(char.id);
                    const isSelected = selectedAvatar === char.id;

                    return (
                      <button
                        key={char.id}
                        disabled={!isUnlocked}
                        onClick={() => {
                          if (isUnlocked) {
                            sound.playClick();
                            setSelectedAvatar(char.id);
                            onUpdateProfile({ ...profile, avatar: char.id });
                          }
                        }}
                        className={`relative p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                          !isUnlocked
                            ? 'bg-slate-900/20 border-slate-800/60 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-indigo-500/20 border-indigo-400 shadow-md shadow-indigo-500/20 scale-105 cursor-pointer'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 cursor-pointer'
                        }`}
                      >
                        <span className="text-2xl">{char.icon}</span>
                        <span className="text-[10px] font-semibold text-slate-300 truncate w-full text-center">
                          {char.name}
                        </span>

                        {!isUnlocked && (
                          <div className="absolute top-1.5 right-1.5 text-[10px] text-amber-400">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'achievements' && (
            <div className="space-y-3">
              {INITIAL_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = profile.unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-slate-900/80 border-amber-500/40 shadow-sm'
                        : 'bg-slate-900/20 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                          isUnlocked
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isUnlocked ? '🏆' : '🔒'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                        <p className="text-[11px] text-slate-400">{ach.description}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-[11px] font-mono text-amber-400 font-bold">
                        +{ach.rewardCoins} 🪙
                      </span>
                      {isUnlocked ? (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                          <Check className="w-3 h-3" /> Terbuka
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 mt-0.5">Terkunci</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'stats' && (
            <div className="space-y-2.5">
              {GAMES_DATA.map((g) => {
                const score = profile.highScores[g.id] || 0;
                return (
                  <div
                    key={g.id}
                    className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g.bannerGradient} flex items-center justify-center text-xs text-white`}>
                        ★
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{g.title}</div>
                        <div className="text-[10px] text-slate-400">{g.categoryName}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Skor Tertinggi</div>
                      <div className="text-sm font-mono font-bold text-cyan-400">{score}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

