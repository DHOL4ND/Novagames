import { Achievement, DailyQuest, GameMetadata, ShopCharacter } from '../types';

export const GAMES_DATA: GameMetadata[] = [
  {
    id: 'cyber-runner',
    title: 'Cyber Dash Neon',
    category: 'action',
    categoryName: 'Aksi & Runner',
    description: 'Lari melintasi kota neon cyberpunk! Lompat ganda, hindari rintangan laser, dan kumpulkan energi koin.',
    tagline: 'Refleks cepat di jalanan masa depan',
    rating: 4.9,
    plays: 14200,
    tags: ['Runner', 'Double Jump', 'Fast-Paced', 'Neon'],
    bannerGradient: 'from-cyan-500 via-blue-600 to-indigo-900',
    accentColor: '#06b6d4',
    iconName: 'Zap',
    thumbnailBadge: 'POPULER 🔥',
    controls: {
      keyboard: ['Spasi / W / Panah Atas (Lompat / Lompat Ganda)', 'S / Panah Bawah (Menunduk/Slide)'],
      touch: 'Ketuk layar untuk lompat, geser ke bawah untuk slide'
    }
  },
  {
    id: 'space-strike',
    title: 'Galaxy Strike 3000',
    category: 'action',
    categoryName: 'Aksi & Menembak',
    description: 'Tembak armada alien ruang angkasa, kalahkan kapal induk bos, dan kumpulkan senjata tembakan ganda & laser.',
    tagline: 'Pertahankan galaksi dari invasi alien',
    rating: 4.8,
    plays: 18500,
    tags: ['Shooter', 'Boss Fight', 'Upgrades', 'Space'],
    bannerGradient: 'from-purple-600 via-pink-600 to-rose-900',
    accentColor: '#ec4899',
    iconName: 'Rocket',
    thumbnailBadge: 'FAVORIT ⭐',
    controls: {
      keyboard: ['Panah Kiri/Kanan atau A/D (Gerak)', 'Spasi (Tembak Laser)', 'B (Bom Plasma)'],
      touch: 'Tahan dan geser pesawat untuk membidik otomatis'
    }
  },
  {
    id: 'block-breaker',
    title: 'Hyper Block Neo',
    category: 'arcade',
    categoryName: 'Arkade Klasik',
    description: 'Hancurkan balok-balok neon dengan bola pantul berkecepatan tinggi! Dapatkan powerup multi-ball, laser paddle, dan bola api.',
    tagline: 'Sensasi breakout modern dengan ledakan partikel memukau',
    rating: 4.7,
    plays: 9800,
    tags: ['Breakout', 'Multi-ball', 'Physics', 'Explosive'],
    bannerGradient: 'from-amber-500 via-orange-600 to-red-800',
    accentColor: '#f59e0b',
    iconName: 'Layers',
    thumbnailBadge: 'SERU 💥',
    controls: {
      keyboard: ['Panah Kiri/Kanan atau Mouse (Gerakkan Paddle)', 'Spasi (Luncurkan Bola / Tembak Laser)'],
      touch: 'Geser jari ke kiri dan kanan untuk memantulkan bola'
    }
  },
  {
    id: 'neon-snake',
    title: 'Neon Snake Evolution',
    category: 'arcade',
    categoryName: 'Arkade Klasik',
    description: 'Ular neon legendaris dengan portal teleportasi warna-warni, makanan buah berkilau, dan mode kecepatan turbo!',
    tagline: 'Ular klasik dengan visual cahaya bercahaya tinggi',
    rating: 4.9,
    plays: 22400,
    tags: ['Snake', 'Retro', 'Portals', 'Glow'],
    bannerGradient: 'from-emerald-500 via-teal-600 to-green-900',
    accentColor: '#10b981',
    iconName: 'Flame',
    thumbnailBadge: 'TERATAS 👑',
    controls: {
      keyboard: ['Tombol Panah / WASD (Ubah Arah)', 'Shift (Kecepatan Turbo)'],
      touch: 'Swipe / Tombol D-Pad di layar sentuh'
    }
  },
  {
    id: 'cyber-2048',
    title: '2048 Cyber Fusion',
    category: 'puzzle',
    categoryName: 'Puzzle & Asah Otak',
    description: 'Gabungkan angka-angka bercahaya hingga mencapai inti 2048! Fitur animasi licin, undo move, dan multiplier combo skor.',
    tagline: 'Teka-teki angka minimalis yang membuat ketagihan',
    rating: 4.8,
    plays: 11300,
    tags: ['2048', 'Numbers', 'Strategy', 'Relaxing'],
    bannerGradient: 'from-blue-600 via-indigo-600 to-violet-950',
    accentColor: '#6366f1',
    iconName: 'Grid',
    thumbnailBadge: 'ASAH OTAK 🧠',
    controls: {
      keyboard: ['Tombol Panah / WASD (Geser Blok Angka)', 'U (Undo Gerakan)'],
      touch: 'Geser jari (swipe) ke 4 arah pada papan angka'
    }
  },
  {
    id: 'flappy-cyber',
    title: 'Flappy Cyber Wings',
    category: 'reflex',
    categoryName: 'Refleks & Casual',
    description: 'Kendalikan drone bersayap neon melewati pilar-pilar laser! Fisika gravitasi yang presisi dengan sistem medali.',
    tagline: 'Uji kesabaran dan ketepatan ritme terbangmu',
    rating: 4.6,
    plays: 16900,
    tags: ['Flappy', 'Physics', 'Hardcore', 'Addictive'],
    bannerGradient: 'from-lime-500 via-emerald-600 to-teal-900',
    accentColor: '#84cc16',
    iconName: 'Feather',
    thumbnailBadge: 'MENANTANG 🎯',
    controls: {
      keyboard: ['Spasi / Klik Mouse / Panah Atas (Kepakkan Sayap)'],
      touch: 'Ketuk layar untuk melompat di udara'
    }
  },
  {
    id: 'monster-strike',
    title: 'Pixel Strike Arena',
    category: 'reflex',
    categoryName: 'Refleks & Casual',
    description: 'Pukul monster alien nakal sebelum mereka menghilang! Hati-hati jangan memukul bom waktu, dan tangkap monster emas bernilai tinggi!',
    tagline: 'Kecepatan tangan dan ketajaman mata',
    rating: 4.7,
    plays: 8700,
    tags: ['Whack-a-Mole', 'Fast Click', 'Combos', 'Party'],
    bannerGradient: 'from-fuchsia-600 via-pink-600 to-rose-900',
    accentColor: '#d946ef',
    iconName: 'Target',
    thumbnailBadge: 'REFLEKS ⚡',
    controls: {
      keyboard: ['Tombol Angka 1-9 (Sesuai Posisi Lubang)'],
      touch: 'Ketuk langsung monster yang muncul secepat mungkin'
    }
  },
  {
    id: 'memory-matrix',
    title: 'Memory Matrix Cyber',
    category: 'puzzle',
    categoryName: 'Puzzle & Asah Otak',
    description: 'Cocokkan pasangan kartu cyber futuristik! Lengkap dengan streak bonus, mode waktu mundur, dan pilihan tingkat kesulitan.',
    tagline: 'Asah daya ingat visual otak dengan visual keren',
    rating: 4.8,
    plays: 7400,
    tags: ['Memory Match', 'Cards', 'Brain Training', 'Focus'],
    bannerGradient: 'from-violet-600 via-purple-700 to-indigo-950',
    accentColor: '#8b5cf6',
    iconName: 'Cpu',
    thumbnailBadge: 'MEMORI 💡',
    controls: {
      keyboard: ['Klik Mouse / Navigasi'],
      touch: 'Ketuk 2 kartu untuk membuka dan mencocokkan'
    }
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    title: 'Langkah Pertama',
    description: 'Mainkan game pertamamu di Nova Game Center',
    icon: 'Gamepad2',
    rewardCoins: 50,
    rewardXp: 100,
    reqType: 'games_played',
    reqTarget: 1
  },
  {
    id: 'arcade-veteran',
    title: 'Penjelajah Arkade',
    description: 'Mainkan total 10 sesi game',
    icon: 'Trophy',
    rewardCoins: 150,
    rewardXp: 300,
    reqType: 'games_played',
    reqTarget: 10
  },
  {
    id: 'score-hunter',
    title: 'Pemburu Skor Tinggi',
    description: 'Capai skor minimal 500 di game apa pun',
    icon: 'Award',
    rewardCoins: 200,
    rewardXp: 400,
    reqType: 'score',
    reqTarget: 500
  },
  {
    id: 'rich-gamer',
    title: 'Sultan Koin Arkade',
    description: 'Kumpulkan total 300 koin di dompetmu',
    icon: 'Coins',
    rewardCoins: 100,
    rewardXp: 250,
    reqType: 'coins',
    reqTarget: 300
  },
  {
    id: 'curator',
    title: 'Kolektor Favorit',
    description: 'Tandai minimal 3 game sebagai favoritmu',
    icon: 'Heart',
    rewardCoins: 80,
    rewardXp: 150,
    reqType: 'favorites',
    reqTarget: 3
  }
];

export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'quest-1',
    title: 'Pemanasan Harian',
    desc: 'Mainkan 2 game berbeda hari ini',
    rewardCoins: 40,
    rewardXp: 80,
    progress: 0,
    maxProgress: 2,
    completed: false,
    claimed: false
  },
  {
    id: 'quest-2',
    title: 'Juara Cyber Dash',
    desc: 'Capai skor minimal 200 di Cyber Dash Neon',
    rewardCoins: 60,
    rewardXp: 120,
    progress: 0,
    maxProgress: 200,
    completed: false,
    claimed: false,
    gameId: 'cyber-runner'
  },
  {
    id: 'quest-3',
    title: 'Penjelajah Galaksi',
    desc: 'Mainkan Galaxy Strike 3000 dan kalahkan alien',
    rewardCoins: 50,
    rewardXp: 100,
    progress: 0,
    maxProgress: 1,
    completed: false,
    claimed: false,
    gameId: 'space-strike'
  }
];

export const SHOP_CHARACTERS: ShopCharacter[] = [
  {
    id: 'cyber-samurai',
    name: 'Cyber Samurai',
    title: 'Pendekar Pedang Neon',
    icon: '⚔️',
    color: 'from-cyan-500 to-blue-600',
    price: 0,
    minLevel: 1,
    rarity: 'common',
    description: 'Karakter starter standar bersenjata katana energi laser.',
    perkText: 'Karakter Starter Gratis'
  },
  {
    id: 'pixel-wizard',
    name: 'Pixel Wizard',
    title: 'Penyihir Dimensi Retro',
    icon: '🧙‍♂️',
    color: 'from-purple-500 to-pink-600',
    price: 0,
    minLevel: 1,
    rarity: 'common',
    description: 'Menguasai sihir partikel 8-bit kuno dari era arcade 1980-an.',
    perkText: 'Karakter Starter Gratis'
  },
  {
    id: 'neon-ninja',
    name: 'Neon Ninja',
    title: 'Bayangan Berkecepatan Cahaya',
    icon: '🥷',
    color: 'from-emerald-500 to-teal-600',
    price: 0,
    minLevel: 3,
    isLimitedLevelReward: true,
    levelRewardTitle: 'Hadiah Spesial Level 3',
    rarity: 'rare',
    description: 'Pakar infiltrasi grid rahasia dengan kecepatan manuver tinggi.',
    perkText: '★ HADIAH LIMITED: Terbuka Otomatis Saat Capai Level 3'
  },
  {
    id: 'mecha-robot',
    name: 'Mecha Bot Titan',
    title: 'Unit Tempur Baja Cyber',
    icon: '🤖',
    color: 'from-amber-500 to-orange-600',
    price: 80,
    rarity: 'rare',
    description: 'Robot bersenjatakan inti tenaga plasma dan baju zirah titanium.',
    perkText: 'Aura perisai emas berenergi'
  },
  {
    id: 'space-pilot',
    name: 'Astro Commander',
    title: 'Kapten Armada Antariksa',
    icon: '👨‍🚀',
    color: 'from-blue-500 to-indigo-600',
    price: 120,
    rarity: 'rare',
    description: 'Penjelajah gugusan bintang dengan helm augmented reality holografis.',
    perkText: 'Membuka tema visual kosmik'
  },
  {
    id: 'cyber-cat',
    name: 'Neko Cyberpunk',
    title: 'Kucing Agen Rahasia',
    icon: '🐱',
    color: 'from-rose-500 to-fuchsia-600',
    price: 150,
    rarity: 'rare',
    description: 'Kucing lincah ber-implan cybernetic dengan refleks 9 nyawa.',
    perkText: 'Aura pesona fuchsia futuristik'
  },
  {
    id: 'arcade-ghost',
    name: 'Phantom Glitch',
    title: 'Hantu Pemakan Skor',
    icon: '👻',
    color: 'from-yellow-400 to-amber-600',
    price: 0,
    minLevel: 6,
    isLimitedLevelReward: true,
    levelRewardTitle: 'Hadiah Spesial Level 6',
    rarity: 'epic',
    description: 'Makhluk glitch digital langka yang mampu menembus tembok matriks data.',
    perkText: '★ HADIAH LIMITED: Terbuka Otomatis Saat Capai Level 6'
  },
  {
    id: 'alien-boss',
    name: 'Xenon Overlord',
    title: 'Penguasa Dimensi Luar',
    icon: '👾',
    color: 'from-violet-500 to-purple-800',
    price: 250,
    rarity: 'epic',
    description: 'Bos penjaga gerbang arkade dengan kekuatan telekinesis kosmik.',
    perkText: 'Mahkota hologram ungu raja arkade'
  },
  {
    id: 'cyber-dragon',
    name: 'Ryu Matrix Dragon',
    title: 'Naga Purba Cybernetic',
    icon: '🐉',
    color: 'from-red-500 via-amber-500 to-yellow-400',
    price: 0,
    minLevel: 10,
    isLimitedLevelReward: true,
    levelRewardTitle: 'Hadiah Legendaris Level 10',
    rarity: 'epic',
    description: 'Naga purba pemuntah laser berkekuatan mega-gigawatt khusus master arkade.',
    perkText: '★ HADIAH LIMITED: Terbuka Otomatis Saat Capai Level 10'
  },
  {
    id: 'super-valkyrie',
    name: 'Cyber Valkyrie',
    title: 'Pelindung Singgasana Cyber',
    icon: '🧝‍♀️',
    color: 'from-cyan-400 via-teal-400 to-emerald-500',
    price: 0,
    minLevel: 15,
    isLimitedLevelReward: true,
    levelRewardTitle: 'Hadiah Mitos Level 15',
    rarity: 'legendary',
    description: 'Prajurit abadi beroda sayap kuantum dan pedang spektrum pelangi kehormatan.',
    perkText: '★ HADIAH LIMITED: Terbuka Otomatis Saat Capai Level 15'
  },
  {
    id: 'dark-lord',
    name: 'Shadow Overclock',
    title: 'Hacker Gelap Super-AI',
    icon: '👑',
    color: 'from-zinc-800 via-slate-900 to-amber-400',
    price: 0,
    minLevel: 20,
    isLimitedLevelReward: true,
    levelRewardTitle: 'Hadiah Penguasa Level 20',
    rarity: 'legendary',
    description: 'Entitas kecerdasan buatan tertinggi yang menguasai seluruh dunia Nova Arcade.',
    perkText: '★ HADIAH LIMITED: Terbuka Otomatis Saat Capai Level 20'
  },
  {
    id: 'cosmic-djinn',
    name: 'Genesis Chrono',
    title: 'Dewa Ruang & Waktu',
    icon: '⚡',
    color: 'from-yellow-300 via-orange-500 to-purple-600',
    price: 0,
    minLevel: 30,
    isLimitedLevelReward: true,
    levelRewardTitle: 'Hadiah Supreme Nova Level 30',
    rarity: 'legendary',
    description: 'Avatar limited tertinggi tak tertandingi bagi para legenda sejati Nova Arcade.',
    perkText: '★ HADIAH LIMITED SUPREME: Terbuka Otomatis Saat Capai Level 30'
  }
];

export const AVATAR_LIST = SHOP_CHARACTERS.map(c => ({
  id: c.id,
  label: c.name,
  icon: c.icon,
  color: c.color
}));
