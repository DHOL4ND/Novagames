import React, { useState, useEffect, useMemo } from 'react';
import { GameCategory, GameMetadata, PlayerProfile, DailyQuest } from './types';
import { GAMES_DATA } from './data/games';
import {
  loadPlayerProfile,
  savePlayerProfile,
  loadQuests,
  saveQuests,
  updateGameResults,
  fireCelebrationConfetti
} from './utils/storage';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GameWrapper } from './components/GameWrapper';
import { ProfileModal } from './components/ProfileModal';
import { QuestsModal } from './components/QuestsModal';
import { RandomGameModal } from './components/RandomGameModal';
import {
  Award,
  ChevronRight,
  Compass,
  Dices,
  Flame,
  Gamepad2,
  Heart,
  Layers,
  Play,
  Rocket,
  Search,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';

const CATEGORIES: { id: GameCategory | 'favorites'; label: string; icon: string }[] = [
  { id: 'all', label: 'Semua Game', icon: '🎮' },
  { id: 'favorites', label: 'Favorit Saya', icon: '❤️' },
  { id: 'action', label: 'Aksi & Runner', icon: '⚡' },
  { id: 'arcade', label: 'Arkade Klasik', icon: '🕹️' },
  { id: 'puzzle', label: 'Puzzle & Otak', icon: '🧠' },
  { id: 'reflex', label: 'Refleks & Kecepatan', icon: '🎯' }
];

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [quests, setQuests] = useState<DailyQuest[]>(() => loadQuests());
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; icon: string } | null>(null);

  // Auto hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Save profile & quests whenever changed
  useEffect(() => {
    savePlayerProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveQuests(quests);
  }, [quests]);

  const handleToggleFavorite = (gameId: string) => {
    const isFav = profile.favorites.includes(gameId);
    const newFavs = isFav
      ? profile.favorites.filter(id => id !== gameId)
      : [...profile.favorites, gameId];

    const updated = { ...profile, favorites: newFavs };
    setProfile(updated);
  };

  const handlePlayGame = (gameId: string) => {
    setActiveGameId(gameId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameOver = (gameId: string, score: number, coins: number) => {
    const { updatedProfile, newAchievements, newHighscore } = updateGameResults(
      profile,
      gameId,
      score,
      coins
    );
    setProfile(updatedProfile);

    // Update quest progress
    const updatedQuests = quests.map(q => {
      let nextProgress = q.progress;
      if (q.id === 'quest-1') nextProgress = Math.min(q.maxProgress, q.progress + 1);
      if (q.id === 'quest-2' && gameId === 'cyber-runner' && score >= 200) nextProgress = 200;
      if (q.id === 'quest-3' && gameId === 'space-strike') nextProgress = 1;

      const isDone = nextProgress >= q.maxProgress;
      return {
        ...q,
        progress: nextProgress,
        completed: isDone
      };
    });
    setQuests(updatedQuests);

    // Notify if highscore
    if (newHighscore && score > 0) {
      fireCelebrationConfetti();
      setToastMessage({
        title: 'REKOR SKOR BARU! 🏆',
        desc: `Kamu mencetak skor tertinggi baru: ${score} poin!`,
        icon: '👑'
      });
    }

    // Notify if achievement unlocked
    if (newAchievements.length > 0) {
      fireCelebrationConfetti();
      setToastMessage({
        title: 'PRESTASI TERBUKA! 🎖️',
        desc: `${newAchievements.join(', ')}`,
        icon: '🏆'
      });
    }
  };

  const handleClaimQuest = (questId: string) => {
    const target = quests.find(q => q.id === questId);
    if (!target || target.claimed) return;

    const updatedQuests = quests.map(q => (q.id === questId ? { ...q, claimed: true } : q));
    setQuests(updatedQuests);

    const updatedProfile = {
      ...profile,
      coins: profile.coins + target.rewardCoins,
      xp: profile.xp + target.rewardXp,
      level: Math.floor((profile.xp + target.rewardXp) / 200) + 1
    };
    setProfile(updatedProfile);

    setToastMessage({
      title: 'HADIAH MISI DIKLAIM! 🪙',
      desc: `+${target.rewardCoins} Koin & +${target.rewardXp} XP telah ditambahkan!`,
      icon: '🎁'
    });
  };

  // Filtered Games
  const filteredGames = useMemo(() => {
    return GAMES_DATA.filter(game => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!profile.favorites.includes(game.id)) return false;
      } else if (activeCategory !== 'all') {
        if (game.category !== activeCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        const matchesCategory = game.categoryName.toLowerCase().includes(q);
        const matchesTags = game.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesTags) return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, profile.favorites]);

  const activeGame = GAMES_DATA.find(g => g.id === activeGameId);

  // If a game is active, render full game wrapper
  if (activeGame) {
    return (
      <GameWrapper
        game={activeGame}
        profile={profile}
        onBack={() => setActiveGameId(null)}
        onGameOver={handleGameOver}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B10] text-slate-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Glow Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <Header
        profile={profile}
        quests={quests}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenQuests={() => setShowQuestsModal(true)}
        onOpenRandom={() => setShowRandomModal(true)}
      />

      {/* Main Hub Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Featured Hero Banner */}
        {!searchQuery && activeCategory === 'all' && (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/90 via-[#0E101A] to-slate-900/90 border border-slate-800/80 p-6 md:p-10 shadow-2xl shadow-indigo-950/40">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>NEXUS ARCADE COLLECTION</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Mainkan Game Seru <br />
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-white bg-clip-text text-transparent">
                  Tanpa Lag & Bebas Iklan
                </span>
              </h2>

              <p className="text-sm md:text-base text-slate-400 mt-3 leading-relaxed">
                Nikmati 8+ game arkade seru mulai dari Cyber Runner, Galaxy Strike, Breakout, hingga
                2048 dengan efek audio retro 8-bit, sistem level & papan skor!
              </p>

              {/* Quick Actions in Hero */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  id="btn-hero-play-featured"
                  onClick={() => handlePlayGame('cyber-runner')}
                  className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-sm rounded-full shadow-lg shadow-indigo-500/25 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Main Cyber Dash Neon</span>
                </button>

                <button
                  id="btn-hero-spin"
                  onClick={() => setShowRandomModal(true)}
                  className="px-5 py-3.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-200 font-semibold text-sm rounded-full flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Dices className="w-4 h-4 text-indigo-400" />
                  <span>Pilih Acak</span>
                </button>
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className="relative z-10 grid grid-cols-3 gap-3 max-w-md mt-8 pt-6 border-t border-slate-800/80 text-center">
              <div className="bg-slate-900/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-800/60">
                <div className="text-lg md:text-xl font-extrabold text-cyan-400 font-mono">8+</div>
                <div className="text-[11px] text-slate-400">Game Siap Main</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-800/60">
                <div className="text-lg md:text-xl font-extrabold text-amber-400 font-mono">{profile.coins}</div>
                <div className="text-[11px] text-slate-400">Koin Arkade</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-800/60">
                <div className="text-lg md:text-xl font-extrabold text-indigo-400 font-mono">Lv.{profile.level}</div>
                <div className="text-[11px] text-slate-400">Level Pemain</div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`btn-cat-${cat.id}`}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105'
                    : 'bg-slate-800/40 hover:bg-slate-800/70 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.id === 'favorites' && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-900/80 text-[10px] text-rose-300">
                    {profile.favorites.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <span>
                {activeCategory === 'favorites'
                  ? 'Game Favorit Kamu'
                  : activeCategory === 'all'
                  ? 'Daftar Semua Game'
                  : CATEGORIES.find(c => c.id === activeCategory)?.label}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Menampilkan {filteredGames.length} game interaktif
            </p>
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                highScore={profile.highScores[game.id] || 0}
                isFavorite={profile.favorites.includes(game.id)}
                onPlay={handlePlayGame}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-slate-900/20 rounded-3xl border border-slate-800/60 p-6">
            <span className="text-4xl mb-2">🔍</span>
            <h4 className="text-base font-bold text-white mb-1">Tidak ada game yang cocok</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              {activeCategory === 'favorites'
                ? 'Kamu belum menandai game apa pun sebagai favorit. Klik ikon hati pada game untuk menambahkannya!'
                : `Tidak ditemukan game dengan kata kunci "${searchQuery}".`}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs rounded-full shadow-md shadow-indigo-500/20 cursor-pointer transition-colors"
            >
              Tampilkan Semua Game
            </button>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl shadow-indigo-950/80 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <span className="text-2xl">{toastMessage.icon}</span>
          <div>
            <div className="text-xs font-bold text-white">{toastMessage.title}</div>
            <div className="text-[11px] text-slate-300 mt-0.5">{toastMessage.desc}</div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={setProfile}
        />
      )}

      {showQuestsModal && (
        <QuestsModal
          quests={quests}
          profile={profile}
          onClose={() => setShowQuestsModal(false)}
          onClaimQuest={handleClaimQuest}
        />
      )}

      {showRandomModal && (
        <RandomGameModal
          onClose={() => setShowRandomModal(false)}
          onSelectGame={(gameId) => {
            setShowRandomModal(false);
            handlePlayGame(gameId);
          }}
        />
      )}

      {/* Sleek Footer Status Bar */}
      <footer className="w-full bg-slate-900/40 backdrop-blur-md border-t border-slate-800/50 py-4 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">Nova Arcade Hub</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Sleek Web Game Center</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>⚡ Audio Web Synth</span>
            <span>🎮 Kontrol Papan Ketik & Sentuh</span>
            <span>💾 Skor Tersimpan Lokal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
