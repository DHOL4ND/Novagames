import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { SHOP_CHARACTERS, INITIAL_ACHIEVEMENTS, GAMES_DATA } from '../data/games';
import { getTierFromLevel, COOL_NICKNAME_IDEAS } from '../data/leaderboardData';
import { sound } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/storage';
import { Award, Check, Coins, Dices, Edit3, Flame, Gamepad2, Heart, Lock, Shield, ShoppingBag, Sparkles, Trophy, User, X } from 'lucide-react';

interface ProfileModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onUpdateProfile: (newProfile: PlayerProfile) => void;
  onOpenShop?: () => void;
  onOpenLeaderboard?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onUpdateProfile,
  onOpenShop,
  onOpenLeaderboard
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

  const handleRandomizeName = () => {
    sound.playClick();
    const randomPick = COOL_NICKNAME_IDEAS[Math.floor(Math.random() * COOL_NICKNAME_IDEAS.length)];
    const num = Math.floor(Math.random() * 90) + 10;
    const generated = `${randomPick}_${num}`;
    setNameInput(generated);
    onUpdateProfile({
      ...profile,
      name: generated,
      avatar: selectedAvatar
    });
  };

  const unlockedAvatars = profile.unlockedAvatars || ['cyber-samurai', 'pixel-wizard'];
  const unlockedCount = profile.unlockedAchievements.length;
  const totalAchievements = INITIAL_ACHIEVEMENTS.length;
  const activeChar = SHOP_CHARACTERS.find(a => a.id === selectedAvatar) || SHOP_CHARACTERS[0];
  const { tier, tierColor, badge, nextLevel } = getTierFromLevel(profile.level);

  const currentLevelXp = profile.xp % 200;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 200) * 100));

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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800/80 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${activeChar.color} border border-indigo-400/30 flex items-center justify-center text-3xl shadow-md`}>
                      {activeChar.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-base">{profile.name}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                          Level {profile.level}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r ${tierColor} text-slate-950 shadow-sm`}>
                          {badge}
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
                    {onOpenLeaderboard && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          onClose();
                          onOpenLeaderboard();
                        }}
                        className="mt-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span>Lihat Peringkat</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Level XP Progress Bar */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                    <span>Progres ke Level {profile.level + 1}</span>
                    <span className="font-mono text-indigo-300 font-bold">{currentLevelXp} / 200 XP ({xpPercent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Edit Nickname */}
              <div className="p-3.5 bg-slate-900/50 rounded-2xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Nama Panggilan / Nickname:
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomizeName}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Dices className="w-3 h-3" /> Acak Nama
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    maxLength={18}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-xs font-bold text-white outline-none"
                    placeholder="Masukkan nama kamu..."
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Simpan
                  </button>
                </div>
              </div>

              {/* Avatar Selector with Shop Link */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Pilih Avatar Aktif:</label>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">({unlockedAvatars.length}/{SHOP_CHARACTERS.length})</span>
                  </div>
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
                      <span>Beli / Cek Toko</span>
                    </button>
                  )}
                </div>

                {/* Level Reward Milestone Info Hint */}
                <div className="p-2.5 mb-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                    <span>
                      Hadiah Avatar Limited gratis terbuka di <strong>Lv. 3, 6, 10, 15, 20, 30!</strong>
                    </span>
                  </div>
                  <span className="font-bold text-amber-300 ml-1">Lv. Anda: {profile.level}</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {SHOP_CHARACTERS.map((char) => {
                    const isUnlocked = unlockedAvatars.includes(char.id);
                    const isSelected = selectedAvatar === char.id;
                    const isLimited = !!char.isLimitedLevelReward;

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
                        className={`relative p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          !isUnlocked
                            ? isLimited
                              ? 'bg-slate-900/30 border-amber-500/30 opacity-70 cursor-not-allowed'
                              : 'bg-slate-900/20 border-slate-800/60 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-indigo-500/20 border-indigo-400 shadow-md shadow-indigo-500/20 scale-105 cursor-pointer ring-1 ring-indigo-400'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 cursor-pointer'
                        }`}
                        title={
                          isUnlocked
                            ? `Pilih ${char.name}`
                            : isLimited
                            ? `${char.name} (Hadiah Terkunci: Butuh Level ${char.minLevel})`
                            : `${char.name} (Beli di toko: ${char.price} Koin)`
                        }
                      >
                        <span className="text-2xl">{char.icon}</span>
                        <span className="text-[9px] font-semibold text-slate-300 truncate w-full text-center leading-tight">
                          {char.name}
                        </span>

                        {!isUnlocked && (
                          <div className="absolute top-1 right-1 flex items-center">
                            {isLimited ? (
                              <span className="text-[8px] font-mono font-black px-1 rounded bg-amber-500 text-slate-950 shadow-sm">
                                Lv.{char.minLevel}
                              </span>
                            ) : (
                              <div className="text-amber-400">
                                <Lock className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm">
                            <Check className="w-2.5 h-2.5" />
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

