import React, { useState } from 'react';
import { PlayerProfile, ShopCharacter } from '../types';
import { SHOP_CHARACTERS } from '../data/games';
import { sound } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/storage';
import { Check, Coins, Lock, ShoppingBag, Sparkles, User, X, Zap } from 'lucide-react';

interface ShopModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onUpdateProfile: (newProfile: PlayerProfile) => void;
  onNotify: (title: string, desc: string, icon: string) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  profile,
  onClose,
  onUpdateProfile,
  onNotify
}) => {
  const [filterRarity, setFilterRarity] = useState<'all' | 'rare' | 'epic' | 'legendary'>('all');
  const [selectedChar, setSelectedChar] = useState<ShopCharacter>(
    SHOP_CHARACTERS.find(c => c.id === profile.avatar) || SHOP_CHARACTERS[0]
  );

  const unlockedList = profile.unlockedAvatars || ['cyber-samurai', 'pixel-wizard'];

  const filteredCharacters = SHOP_CHARACTERS.filter(char => {
    if (filterRarity === 'all') return true;
    return char.rarity === filterRarity;
  });

  const handleBuyCharacter = (char: ShopCharacter) => {
    // Check level requirement
    if (char.minLevel && profile.level < char.minLevel) {
      sound.playGameOver();
      onNotify('Level Belum Cukup!', `Karakter ini membutuhkan minimal Level ${char.minLevel}. Mainkan game untuk naik level!`, '⚠️');
      return;
    }

    // Check coins
    if (profile.coins < char.price) {
      sound.playGameOver();
      onNotify('Koin Tidak Cukup!', `Kamu membutuhkan ${char.price} koin (kurang ${char.price - profile.coins} koin). Kumpulkan dari misi & game!`, '🪙');
      return;
    }

    sound.playPowerup();
    fireCelebrationConfetti();

    const newUnlocked = Array.from(new Set([...unlockedList, char.id]));
    const newCoins = profile.coins - char.price;

    const updated: PlayerProfile = {
      ...profile,
      coins: newCoins,
      unlockedAvatars: newUnlocked,
      avatar: char.id // Auto-equip on purchase
    };

    onUpdateProfile(updated);
    onNotify('Karakter Berhasil Dibeli!', `${char.name} kini siap digunakan dan langsung dipasang sebagai avatarmu!`, char.icon);
  };

  const handleEquip = (char: ShopCharacter) => {
    sound.playClick();
    const updated: PlayerProfile = {
      ...profile,
      avatar: char.id
    };
    onUpdateProfile(updated);
    onNotify('Avatar Dipasang!', `${char.name} kini menjadi avatar aktifmu.`, char.icon);
  };

  const getRarityBadge = (rarity: ShopCharacter['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">LEGENDARY</span>;
      case 'epic':
        return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">EPIC</span>;
      case 'rare':
        return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">RARE</span>;
      default:
        return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/40">STARTER</span>;
    }
  };

  const isSelectedUnlocked = unlockedList.includes(selectedChar.id);
  const isSelectedEquipped = profile.avatar === selectedChar.id;
  const isLevelLocked = Boolean(selectedChar.minLevel && profile.level < selectedChar.minLevel);
  const canAfford = profile.coins >= selectedChar.price;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0D0F18] border border-slate-800/80 rounded-3xl p-6 shadow-2xl shadow-indigo-950/40 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Toko Karakter & Avatar Cyber</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30">
                  SHOP
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Gunakan koin arkade kamu untuk membuka koleksi karakter legendaris!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Current Balance */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.coins}</span>
            </div>

            <button
              id="btn-close-shop"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Rarities */}
        <div className="flex items-center justify-between gap-2 my-3.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'rare', 'epic', 'legendary'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  sound.playClick();
                  setFilterRarity(r);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  filterRarity === r
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                {r === 'all' ? 'Semua Karakter' : r}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Dimiliki: <strong className="text-white font-mono">{unlockedList.length}/{SHOP_CHARACTERS.length}</strong>
          </div>
        </div>

        {/* Main Body: Grid of Characters + Character Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-y-auto pr-1">
          {/* Left Grid: Character Cards */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5 auto-rows-max">
            {filteredCharacters.map((char) => {
              const isUnlocked = unlockedList.includes(char.id);
              const isEquipped = profile.avatar === char.id;
              const isSelected = selectedChar.id === char.id;
              const isLvlLocked = Boolean(char.minLevel && profile.level < char.minLevel);

              return (
                <button
                  key={char.id}
                  id={`shop-item-${char.id}`}
                  onClick={() => {
                    sound.playClick();
                    setSelectedChar(char);
                  }}
                  className={`relative p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/15 scale-[1.02]'
                      : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between w-full mb-2">
                    {getRarityBadge(char.rarity)}
                    {isEquipped ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 font-semibold">Milik</span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[11px] font-mono text-amber-400 font-bold">
                        🪙 {char.price}
                      </span>
                    )}
                  </div>

                  {/* Character Avatar Icon Banner */}
                  <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${char.color} flex items-center justify-center text-3xl shadow-inner relative overflow-hidden my-1`}>
                    <span className="transform group-hover:scale-110 transition-transform">{char.icon}</span>
                    {isLvlLocked && !isUnlocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <Lock className="w-4 h-4 text-amber-400" />
                      </div>
                    )}
                  </div>

                  {/* Name and Level Req */}
                  <div className="mt-1">
                    <div className="text-xs font-bold text-white truncate">{char.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {isLvlLocked && !isUnlocked ? (
                        <span className="text-rose-400">Butuh Lv.{char.minLevel}</span>
                      ) : (
                        char.title
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Inspector: Details & Purchase/Equip Button */}
          <div className="md:col-span-5 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              {/* Selected Character Preview Banner */}
              <div className={`w-full h-28 rounded-2xl bg-gradient-to-br ${selectedChar.color} border border-slate-700/40 p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-lg mb-3.5`}>
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
                <span className="text-5xl mb-1 relative z-10 animate-bounce" style={{ animationDuration: '3s' }}>
                  {selectedChar.icon}
                </span>
                <div className="relative z-10 flex items-center gap-1.5">
                  {getRarityBadge(selectedChar.rarity)}
                  {selectedChar.minLevel && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-indigo-300 border border-indigo-500/40">
                      Min Lv.{selectedChar.minLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Character Info */}
              <div className="space-y-2">
                <div>
                  <h4 className="text-base font-extrabold text-white tracking-tight">{selectedChar.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{selectedChar.title}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                  {selectedChar.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] leading-tight font-medium">{selectedChar.perkText}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Harga Karakter:</span>
                <span className="text-base font-mono font-extrabold text-amber-400 flex items-center gap-1">
                  {selectedChar.price === 0 ? 'GRATIS' : `${selectedChar.price} 🪙`}
                </span>
              </div>

              {isSelectedEquipped ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Avatar Sedang Dipakai
                </button>
              ) : isSelectedUnlocked ? (
                <button
                  id="btn-equip-character"
                  onClick={() => handleEquip(selectedChar)}
                  className="w-full py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-1.5 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-98"
                >
                  <User className="w-4 h-4" /> Pasang Sebagai Avatar
                </button>
              ) : isLevelLocked ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-full bg-slate-800 border border-slate-700 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-75"
                >
                  <Lock className="w-4 h-4" /> Butuh Level {selectedChar.minLevel} (Level Kamu: {profile.level})
                </button>
              ) : (
                <button
                  id="btn-buy-character"
                  onClick={() => handleBuyCharacter(selectedChar)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all transform cursor-pointer ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-98'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  {canAfford
                    ? `Beli Sekarang (${selectedChar.price} 🪙)`
                    : `Koin Kurang (${profile.coins}/${selectedChar.price})`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 mt-2">
          <span>💡 Selesaikan game & klaim misi harian untuk mengumpulkan lebih banyak koin!</span>
          <span className="font-mono text-amber-400 font-bold">Dompet: {profile.coins} 🪙</span>
        </div>
      </div>
    </div>
  );
};
