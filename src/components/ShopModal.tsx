import React, { useState } from 'react';
import { PlayerProfile, ShopCharacter } from '../types';
import { SHOP_CHARACTERS } from '../data/games';
import { sound } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/storage';
import { Check, Coins, Gift, ShoppingBag, Sparkles, User, X, Zap } from 'lucide-react';

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
  const [selectedChar, setSelectedChar] = useState<ShopCharacter>(() => {
    return SHOP_CHARACTERS.find(c => c.id === profile.avatar) || SHOP_CHARACTERS[0];
  });

  const unlockedList = profile.unlockedAvatars && profile.unlockedAvatars.length > 0
    ? profile.unlockedAvatars
    : ['cyber-samurai', 'pixel-wizard'];

  const filteredCharacters = SHOP_CHARACTERS.filter(char => {
    if (filterRarity === 'all') return true;
    return char.rarity === filterRarity;
  });

  // Claim free coins bonus
  const handleClaimFreeCoins = () => {
    sound.playPowerup();
    fireCelebrationConfetti();
    const updated: PlayerProfile = {
      ...profile,
      coins: profile.coins + 100
    };
    onUpdateProfile(updated);
    onNotify('Bonus Koin Diklaim!', 'Kamu mendapatkan +100 koin arkade gratis untuk belanja karakter!', '🎁');
  };

  // Buy a character
  const handleBuyCharacter = (char: ShopCharacter, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Already owned
    if (unlockedList.includes(char.id)) {
      handleEquip(char);
      return;
    }

    // Check if affordable
    if (profile.coins < char.price) {
      sound.playGameOver();
      onNotify(
        'Koin Belum Cukup!',
        `Kamu punya ${profile.coins} koin, butuh ${char.price} koin. Klik tombol "Klaim Bonus Koin" di atas untuk dapat 100 koin gratis!`,
        '🪙'
      );
      return;
    }

    sound.playPowerup();
    fireCelebrationConfetti();

    const newUnlocked = Array.from(new Set([...unlockedList, char.id]));
    const newCoins = Math.max(0, profile.coins - char.price);

    const updated: PlayerProfile = {
      ...profile,
      coins: newCoins,
      unlockedAvatars: newUnlocked,
      avatar: char.id // Auto-equip on purchase!
    };

    onUpdateProfile(updated);
    setSelectedChar(char);
    onNotify('Karakter Berhasil Dibeli!', `${char.name} kini siap digunakan dan telah terpasang sebagai avatarmu!`, char.icon);
  };

  // Equip an already-owned character
  const handleEquip = (char: ShopCharacter, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    const updated: PlayerProfile = {
      ...profile,
      avatar: char.id
    };
    onUpdateProfile(updated);
    setSelectedChar(char);
    onNotify('Avatar Terpasang!', `${char.name} kini menjadi avatar aktifmu.`, char.icon);
  };

  const getRarityBadge = (rarity: ShopCharacter['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            LEGENDARY
          </span>
        );
      case 'epic':
        return (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
            EPIC
          </span>
        );
      case 'rare':
        return (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            RARE
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/40">
            STARTER
          </span>
        );
    }
  };

  const isSelectedUnlocked = unlockedList.includes(selectedChar.id);
  const isSelectedEquipped = profile.avatar === selectedChar.id;
  const canAffordSelected = profile.coins >= selectedChar.price;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0D0F18] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-indigo-950/50 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-800/70 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Toko Karakter Cyber</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30">
                  SHOP
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Beli karakter & pasang avatar favoritmu untuk bermain di arena arkade</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Free Coins Claim Button */}
            <button
              id="btn-claim-bonus-coins"
              onClick={handleClaimFreeCoins}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              title="Dapatkan 100 koin gratis untuk mencoba belanja karakter"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>+100 Koin Gratis</span>
            </button>

            {/* Current Balance */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs font-mono font-bold text-amber-400 shadow-inner">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{profile.coins}</span>
            </div>

            <button
              id="btn-close-shop"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Rarity Chips & Counter */}
        <div className="flex items-center justify-between gap-2 my-3">
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

          <div className="text-[11px] text-slate-400 hidden sm:block whitespace-nowrap">
            Koleksi Terbuka: <strong className="text-amber-400 font-mono">{unlockedList.length}/{SHOP_CHARACTERS.length}</strong>
          </div>
        </div>

        {/* Main Content Area: Left Grid + Right Preview Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1">
          {/* Left Grid: Character Cards */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5 auto-rows-max">
            {filteredCharacters.map((char) => {
              const isUnlocked = unlockedList.includes(char.id);
              const isEquipped = profile.avatar === char.id;
              const isSelected = selectedChar.id === char.id;
              const canAfford = profile.coins >= char.price;

              return (
                <div
                  key={char.id}
                  id={`shop-item-${char.id}`}
                  onClick={() => {
                    sound.playClick();
                    setSelectedChar(char);
                  }}
                  className={`relative p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/50'
                      : 'bg-slate-900/50 hover:bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar on Card */}
                  <div className="flex items-center justify-between w-full mb-1.5">
                    {getRarityBadge(char.rarity)}
                    {isEquipped ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-bold">
                        Aktif
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 font-semibold">Milik</span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[11px] font-mono text-amber-400 font-bold">
                        🪙 {char.price}
                      </span>
                    )}
                  </div>

                  {/* Character Avatar Banner */}
                  <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${char.color} flex items-center justify-center text-3xl shadow-inner relative overflow-hidden my-1 border border-white/10`}>
                    <span className="transform group-hover:scale-115 transition-transform duration-200">
                      {char.icon}
                    </span>
                  </div>

                  {/* Name & Title */}
                  <div className="my-1">
                    <div className="text-xs font-bold text-white truncate">{char.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{char.title}</div>
                  </div>

                  {/* Direct Action Button on each card */}
                  <div className="mt-1">
                    {isEquipped ? (
                      <button
                        disabled
                        className="w-full py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1 cursor-default"
                      >
                        <Check className="w-3 h-3" /> Terpasang
                      </button>
                    ) : isUnlocked ? (
                      <button
                        id={`btn-equip-${char.id}`}
                        onClick={(e) => handleEquip(char, e)}
                        className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                      >
                        <User className="w-3 h-3" /> Gunakan
                      </button>
                    ) : (
                      <button
                        id={`btn-card-buy-${char.id}`}
                        onClick={(e) => handleBuyCharacter(char, e)}
                        className={`w-full py-1.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/25 hover:scale-102 active:scale-98'
                            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <Coins className="w-3 h-3 text-amber-950" />
                        <span>Beli ({char.price} 🪙)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Inspector: Details & Purchase/Equip Button */}
          <div className="md:col-span-5 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <div>
              {/* Selected Character Preview Card */}
              <div className={`w-full h-32 rounded-2xl bg-gradient-to-br ${selectedChar.color} border border-white/20 p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-lg mb-3`}>
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
                <span className="text-6xl mb-1 relative z-10 animate-bounce" style={{ animationDuration: '3s' }}>
                  {selectedChar.icon}
                </span>
                <div className="relative z-10 flex items-center gap-1.5">
                  {getRarityBadge(selectedChar.rarity)}
                </div>
              </div>

              {/* Character Details */}
              <div className="space-y-2">
                <div>
                  <h4 className="text-lg font-extrabold text-white tracking-tight">{selectedChar.name}</h4>
                  <p className="text-xs text-indigo-400 font-semibold">{selectedChar.title}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/70">
                  {selectedChar.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] leading-tight font-semibold">{selectedChar.perkText}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions on Inspector */}
            <div className="mt-4 pt-3 border-t border-slate-800/70 space-y-2.5">
              <div className="flex items-center justify-between text-xs bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800/50">
                <span className="text-slate-400">Harga Karakter:</span>
                <span className="text-base font-mono font-extrabold text-amber-400 flex items-center gap-1">
                  {selectedChar.price === 0 ? 'GRATIS' : `${selectedChar.price} 🪙`}
                </span>
              </div>

              {isSelectedEquipped ? (
                <button
                  disabled
                  className="w-full py-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Avatar Sedang Aktif
                </button>
              ) : isSelectedUnlocked ? (
                <button
                  id="btn-equip-character"
                  onClick={() => handleEquip(selectedChar)}
                  className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-98"
                >
                  <User className="w-4 h-4" /> Pasang Sebagai Avatar Aktif
                </button>
              ) : (
                <button
                  id="btn-buy-character"
                  onClick={() => handleBuyCharacter(selectedChar)}
                  className={`w-full py-3 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition-all transform cursor-pointer ${
                    canAffordSelected
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-98 ring-2 ring-amber-400/50'
                      : 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border border-amber-500/40 hover:from-amber-500/40 hover:to-yellow-500/40'
                  }`}
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  {canAffordSelected
                    ? `Beli Sekarang (${selectedChar.price} 🪙)`
                    : `Koin Kurang (${profile.coins}/${selectedChar.price} 🪙) - Klik Beli / Klaim Bonus`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 mt-2 gap-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Karakter yang dibeli otomatis menjadi avatar resmi di game & profil kamu!</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-400 font-bold">Dompet: {profile.coins} 🪙</span>
          </div>
        </div>
      </div>
    </div>
  );
};
