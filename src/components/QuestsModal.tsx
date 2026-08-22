import React from 'react';
import { DailyQuest, PlayerProfile } from '../types';
import { sound } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/storage';
import { Check, Coins, Gift, Sparkles, X } from 'lucide-react';

interface QuestsModalProps {
  quests: DailyQuest[];
  profile: PlayerProfile;
  onClose: () => void;
  onClaimQuest: (questId: string) => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  quests,
  profile,
  onClose,
  onClaimQuest
}) => {
  const handleClaim = (q: DailyQuest) => {
    sound.playVictory();
    fireCelebrationConfetti();
    onClaimQuest(q.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D0F18] border border-slate-800/80 rounded-3xl p-6 shadow-2xl shadow-indigo-950/40 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Gift className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Misi Harian Arkade</h3>
              <p className="text-[11px] text-slate-400">Selesaikan misi untuk mendapatkan koin & XP</p>
            </div>
          </div>
          <button
            id="btn-close-quests"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quests List */}
        <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-3">
          {quests.map((q) => {
            const isCompleted = q.completed || q.progress >= q.maxProgress;
            const pct = Math.min(100, Math.floor((q.progress / q.maxProgress) * 100));

            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{q.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{q.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      +{q.rewardCoins} 🪙
                    </span>
                    <span className="text-[10px] text-slate-500 block">+{q.rewardXp} XP</span>
                  </div>
                </div>

                {/* Progress bar & Action */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progres</span>
                      <span>
                        {q.progress} / {q.maxProgress}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {q.claimed ? (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-500 text-xs font-semibold flex items-center gap-1 opacity-70"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Diklaim
                    </button>
                  ) : isCompleted ? (
                    <button
                      id={`btn-claim-${q.id}`}
                      onClick={() => handleClaim(q)}
                      className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transform hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
                    >
                      Klaim Hadiah
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-full bg-slate-800/80 text-slate-500 text-xs font-medium"
                    >
                      Belum Selesai
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-800/60 text-center text-xs text-slate-400">
          ✨ Misi otomatis diperbarui seiring kamu bermain di Nova Arcade!
        </div>
      </div>
    </div>
  );
};
