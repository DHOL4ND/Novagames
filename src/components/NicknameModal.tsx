import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { COOL_NICKNAME_IDEAS } from '../data/leaderboardData';
import { SHOP_CHARACTERS } from '../data/games';
import { sound } from '../utils/audio';
import { Check, Dices, Edit3, Sparkles, User, X } from 'lucide-react';

interface NicknameModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onSaveNickname: (newName: string) => void;
}

export const NicknameModal: React.FC<NicknameModalProps> = ({
  profile,
  onClose,
  onSaveNickname
}) => {
  const [nickname, setNickname] = useState(profile.name);
  const activeChar = SHOP_CHARACTERS.find(c => c.id === profile.avatar) || SHOP_CHARACTERS[0];

  const handleRandomize = () => {
    sound.playClick();
    const randomPick = COOL_NICKNAME_IDEAS[Math.floor(Math.random() * COOL_NICKNAME_IDEAS.length)];
    const num = Math.floor(Math.random() * 90) + 10;
    setNickname(`${randomPick}_${num}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const clean = nickname.trim() || 'Gamer Nova';
    onSaveNickname(clean);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D0F18] border border-slate-800/80 rounded-3xl p-6 shadow-2xl shadow-indigo-950/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white">Ganti Nickname Pemain</h3>
          </div>
          <button
            id="btn-close-nickname-modal"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-400/40 flex items-center justify-center text-2xl shadow-md">
            {activeChar.icon}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Pratinjau Nama di Papan Skor:</div>
            <div className="text-base font-black text-white flex items-center gap-2 mt-0.5">
              <span>{nickname.trim() || 'Gamer Nova'}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Lv. {profile.level}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Masukkan Nickname Baru (Maksimal 18 Karakter):
            </label>
            <div className="relative">
              <input
                id="input-player-nickname"
                type="text"
                maxLength={18}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Contoh: NovaStriker_99"
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 rounded-2xl text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600"
                autoFocus
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                {nickname.length}/18
              </span>
            </div>
          </div>

          {/* Quick Randomize Button */}
          <button
            type="button"
            id="btn-random-nickname"
            onClick={handleRandomize}
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Dices className="w-4 h-4 text-indigo-400" />
            <span>Acak Ide Nickname Keren</span>
          </button>

          {/* Suggested Chips */}
          <div>
            <div className="text-[11px] text-slate-400 mb-1.5 font-medium">Pilihan Cepat:</div>
            <div className="flex flex-wrap gap-1.5">
              {['CyberKnight', 'RajaArkade', 'NeonHunter', 'AuraGamer', 'ShadowAce'].map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => {
                    sound.playClick();
                    setNickname(sug);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-save-nickname-submit"
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Nickname</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
