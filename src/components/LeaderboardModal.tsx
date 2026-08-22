import React, { useState, useEffect } from 'react';
import { PlayerProfile, GameMetadata, LeaderboardPlayer } from '../types';
import { GAMES_DATA } from '../data/games';
import {
  getSortedLevelLeaderboard,
  getSortedGameScoreLeaderboard,
  getTierFromLevel
} from '../data/leaderboardData';
import { subscribeToOnlineLeaderboard, syncPlayerToCloud } from '../lib/cloudLeaderboard';
import { sound } from '../utils/audio';
import {
  Award,
  Check,
  ChevronRight,
  Crown,
  Edit3,
  Flame,
  Gamepad2,
  Globe,
  Medal,
  Radio,
  Shield,
  Sparkles,
  Star,
  Trophy,
  User,
  X,
  Zap
} from 'lucide-react';

interface LeaderboardModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onOpenProfile?: () => void;
  onUpdateNickname?: (newName: string) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  profile,
  onClose,
  onOpenProfile,
  onUpdateNickname
}) => {
  const [activeTab, setActiveTab] = useState<'level' | 'gamescore' | 'tiers'>('level');
  const [selectedGameId, setSelectedGameId] = useState<string>('cyber-runner');
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [nickInput, setNickInput] = useState(profile.name);
  const [isOnlineSync, setIsOnlineSync] = useState(false);

  // Live state from Firestore
  const [liveLeaderboard, setLiveLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [livePlayerRank, setLivePlayerRank] = useState<number>(1);
  const [livePlayerEntry, setLivePlayerEntry] = useState<LeaderboardPlayer | null>(null);

  // Sync profile to cloud upon opening
  useEffect(() => {
    syncPlayerToCloud(profile);
    const unsubscribe = subscribeToOnlineLeaderboard(profile, (data) => {
      setLiveLeaderboard(data.leaderboard);
      setLivePlayerRank(data.playerRank);
      setLivePlayerEntry(data.playerEntry);
      setIsOnlineSync(true);
    });

    return () => unsubscribe();
  }, [profile]);

  // Fallback local calculation if snapshot not yet arrived
  const localLevelCalc = getSortedLevelLeaderboard(profile);
  const leaderboard = liveLeaderboard.length > 0 ? liveLeaderboard : localLevelCalc.leaderboard;
  const playerRank = liveLeaderboard.length > 0 ? livePlayerRank : localLevelCalc.playerRank;
  const playerEntry = livePlayerEntry || localLevelCalc.playerEntry;

  // Compute live game score leaderboard
  const { gameLeaderboard, playerGameRank, playerGameScore } = getSortedGameScoreLeaderboard(
    selectedGameId,
    profile
  );

  const selectedGame = GAMES_DATA.find(g => g.id === selectedGameId) || GAMES_DATA[0];
  const { tier, tierColor, badge } = getTierFromLevel(profile.level);

  // Top 3 Podium for Level Leaderboard
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  const handleSaveNickname = () => {
    sound.playClick();
    const trimmed = nickInput.trim() || 'Gamer Nova';
    if (onUpdateNickname) {
      onUpdateNickname(trimmed);
    }
    syncPlayerToCloud({
      ...profile,
      name: trimmed
    });
    setIsEditingNick(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0D0F18] border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-indigo-950/50 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0D0F18] rounded-[14px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Papan Peringkat Pemain
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Peringkat level tertinggi real-time antar seluruh pemain game
              </p>
            </div>
          </div>

          <button
            id="btn-close-leaderboard"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Player Rank Banner */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-2xl shadow-inner">
                {playerEntry.avatarIcon}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] shadow-sm">
                #{playerRank}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {isEditingNick ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      maxLength={18}
                      value={nickInput}
                      onChange={(e) => setNickInput(e.target.value)}
                      className="px-2.5 py-1 bg-slate-900 border border-indigo-400 rounded-lg text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-400"
                      placeholder="Nickname..."
                      autoFocus
                    />
                    <button
                      onClick={handleSaveNickname}
                      className="px-2.5 py-1 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setIsEditingNick(false)}
                      className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-extrabold text-white text-sm sm:text-base">
                      {profile.name}
                    </span>
                    <button
                      id="btn-edit-nick-leaderboard"
                      onClick={() => {
                        sound.playClick();
                        setNickInput(profile.name);
                        setIsEditingNick(true);
                      }}
                      className="p-1 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      title="Ubah Nickname"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      KAMU
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="font-bold text-amber-400">Level {profile.level}</span>
                <span>•</span>
                <span className="text-slate-300">{profile.xp} XP</span>
                <span>•</span>
                <span className={`font-semibold bg-gradient-to-r ${tierColor} bg-clip-text text-transparent`}>
                  {tier}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
            <div className="text-left sm:text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Peringkat Global
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                Peringkat #{playerRank}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Main
              </div>
              <div className="text-sm font-bold text-slate-200 font-mono">
                {profile.totalGamesPlayed} Game
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 my-3.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800/80">
          <button
            id="tab-lb-level"
            onClick={() => {
              sound.playClick();
              setActiveTab('level');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'level'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Level Tertinggi</span>
          </button>

          <button
            id="tab-lb-gamescore"
            onClick={() => {
              sound.playClick();
              setActiveTab('gamescore');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'gamescore'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Skor Game</span>
          </button>

          <button
            id="tab-lb-tiers"
            onClick={() => {
              sound.playClick();
              setActiveTab('tiers');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'tiers'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Tingkat Tier</span>
          </button>
        </div>

        {/* Tab 1: Level Leaderboard */}
        {activeTab === 'level' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Top 3 Visual Podium */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2 px-1">
              {/* 2nd Place */}
              {top2 && (
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 relative">
                  <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md mb-2">
                    🥈 2
                  </div>
                  <div className="text-2xl sm:text-3xl mb-1">{top2.avatarIcon}</div>
                  <div className="font-bold text-xs text-white truncate max-w-[90px] sm:max-w-[130px]">
                    {top2.name}
                  </div>
                  <div className="text-[11px] font-extrabold text-indigo-400 mt-0.5">
                    Lv. {top2.level}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{top2.xp} XP</div>
                </div>
              )}

              {/* 1st Place (Highest Podium) */}
              {top1 && (
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 via-slate-900/80 to-slate-900/90 border-2 border-amber-400/60 shadow-xl shadow-amber-500/10 relative -translate-y-2">
                  <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[10px] shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-slate-950" /> JUARA 1
                  </div>
                  <div className="text-3xl sm:text-4xl mb-1 mt-1">{top1.avatarIcon}</div>
                  <div className="font-extrabold text-xs sm:text-sm text-amber-300 truncate max-w-[100px] sm:max-w-[150px]">
                    {top1.name}
                  </div>
                  <div className="text-xs font-black text-amber-400 mt-0.5">
                    Level {top1.level} 🔥
                  </div>
                  <div className="text-[10px] text-amber-200/80 font-mono">{top1.xp} XP</div>
                </div>
              )}

              {/* 3rd Place */}
              {top3 && (
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 relative">
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-md mb-2">
                    🥉 3
                  </div>
                  <div className="text-2xl sm:text-3xl mb-1">{top3.avatarIcon}</div>
                  <div className="font-bold text-xs text-white truncate max-w-[90px] sm:max-w-[130px]">
                    {top3.name}
                  </div>
                  <div className="text-[11px] font-extrabold text-indigo-400 mt-0.5">
                    Lv. {top3.level}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{top3.xp} XP</div>
                </div>
              )}
            </div>

            {/* Complete Full Ranking List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 px-2 flex items-center justify-between">
                <span>Daftar Seluruh Pemain</span>
                <span>Diurutkan berdasarkan Level & XP</span>
              </div>

              {leaderboard.map((item) => {
                const isUser = item.isCurrentPlayer;
                const isTop3 = item.rank <= 3;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isUser
                        ? 'bg-indigo-950/60 border-indigo-400/80 shadow-md shadow-indigo-950/50 ring-1 ring-indigo-400/40'
                        : isTop3
                        ? 'bg-slate-900/80 border-slate-700/60'
                        : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Rank & Profile */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                          item.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : item.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : item.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </div>

                      <div className="text-xl sm:text-2xl">{item.avatarIcon}</div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs sm:text-sm ${isUser ? 'text-indigo-300 font-black' : 'text-white'}`}>
                            {item.name}
                          </span>
                          {isUser && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 text-[9px] font-black border border-indigo-400/40">
                              KAMU
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            {item.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className={`font-bold bg-gradient-to-r ${item.tierColor} bg-clip-text text-transparent`}>
                            {item.tier}
                          </span>
                          <span>•</span>
                          <span>{item.totalGamesPlayed} game dimainkan</span>
                        </div>
                      </div>
                    </div>

                    {/* Level & XP Stats */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                          Lv. {item.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.xp} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Game High Score Leaderboard */}
        {activeTab === 'gamescore' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Game Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {GAMES_DATA.map(game => {
                const isSelected = selectedGameId === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedGameId(game.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    <span>{game.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Game Highscore Header */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-900/50 border border-slate-800/80 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  <span>Rekor {selectedGame.title}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedGame.tagline}</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Skor Kamu</div>
                <div className="text-base font-black text-amber-400 font-mono">
                  {playerGameScore} Poin (#{playerGameRank})
                </div>
              </div>
            </div>

            {/* Game Scores List */}
            <div className="space-y-2">
              {gameLeaderboard.map((item) => {
                return (
                  <div
                    key={`${item.name}-${item.rank}`}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      item.isCurrentPlayer
                        ? 'bg-indigo-950/60 border-indigo-400/80 shadow-md ring-1 ring-indigo-400/40'
                        : 'bg-slate-900/40 border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                          item.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : item.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : item.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </div>
                      <div className="text-xl">{item.avatarIcon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs sm:text-sm ${item.isCurrentPlayer ? 'text-indigo-300 font-black' : 'text-white'}`}>
                            {item.name}
                          </span>
                          {item.isCurrentPlayer && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 text-[9px] font-black border border-indigo-400/40">
                              KAMU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">Level {item.level}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-cyan-400 font-mono">
                        {item.score} <span className="text-[10px] text-slate-400">PTS</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Tier Progression Breakdown */}
        {activeTab === 'tiers' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              💡 <strong>Cara Naik Pangkat & Level:</strong> Mainkan game, capai skor tinggi, dan selesaikan Misi Harian untuk mengumpulkan XP. Setiap 200 XP akan meningkatkan level dan mengangkat peringkat kamu di papan skor global!
            </div>

            <div className="space-y-2">
              {[
                { name: 'Nova Legend', lv: 'Lv. 20+', color: 'from-amber-400 via-pink-500 to-purple-600', badge: '👑 LEGEND', desc: 'Peringkat kasta tertinggi gamer Nova Arcade' },
                { name: 'Grandmaster', lv: 'Lv. 15 - 19', color: 'from-red-500 to-rose-600', badge: '🔥 GRANDMASTER', desc: 'Pemain elit dengan penguasaan seluruh game' },
                { name: 'Master', lv: 'Lv. 10 - 14', color: 'from-purple-500 to-indigo-600', badge: '⚡ MASTER', desc: 'Veteran dengan rekor skor dan combo tinggi' },
                { name: 'Diamond', lv: 'Lv. 7 - 9', color: 'from-cyan-400 to-blue-600', badge: '💎 DIAMOND', desc: 'Pemain mahir dengan konsistensi permainan tinggi' },
                { name: 'Platinum', lv: 'Lv. 5 - 6', color: 'from-teal-400 to-emerald-600', badge: '🛡️ PLATINUM', desc: 'Pemain reguler yang aktif menuntaskan misi' },
                { name: 'Gold', lv: 'Lv. 3 - 4', color: 'from-yellow-400 to-amber-600', badge: '⭐ GOLD', desc: 'Mulai menguasai pola rintangan dan manuver' },
                { name: 'Silver', lv: 'Lv. 2', color: 'from-slate-300 to-slate-500', badge: '⚔️ SILVER', desc: 'Pemain berkembang yang telah memahami dasar game' },
                { name: 'Bronze', lv: 'Lv. 1', color: 'from-amber-700 to-stone-600', badge: '🌱 BRONZE', desc: 'Tingkat pemula gamer baru' }
              ].map((t) => {
                const isCurrent = t.name === tier;
                return (
                  <div
                    key={t.name}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      isCurrent
                        ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-400/80 ring-1 ring-indigo-400/40 shadow-lg'
                        : 'bg-slate-900/40 border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-1 rounded-xl bg-gradient-to-r ${t.color} text-slate-950 font-black text-xs shadow-sm`}>
                        {t.badge}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs sm:text-sm">{t.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black">
                              PANGKAT KAMU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-amber-400 font-mono">{t.lv}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
