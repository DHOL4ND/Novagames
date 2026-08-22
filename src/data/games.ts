import { Achievement, DailyQuest, GameMetadata, ShopCharacter } from '../types';

export const GAMES_DATA: GameMetadata[] = [
  {
    id: 'neon-pong-duel',
    title: 'Neon Pong Duel PvP',
    category: 'multiplayer',
    categoryName: '🎮 Mabar Online 1v1',
    description: 'Duel tenis meja neon real-time antar pemain! Buat Room atau gabung kode mabar, kalahkan lawan dengan fireball & split shots!',
    tagline: 'Duel 1 vs 1 real-time online dengan teman',
    rating: 5.0,
    plays: 28900,
    tags: ['Mabar', 'Multiplayer', '1v1 Online', 'PvP', 'Neon Duel'],
    bannerGradient: 'from-fuchsia-600 via-rose-600 to-amber-600',
    accentColor: '#f43f5e',
    iconName: 'Swords',
    thumbnailBadge: '🎮 MABAR ONLINE 1V1',
    isMultiplayerSupported: true,
    controls: {
      keyboard: ['W / S atau Panah Atas / Bawah (Gerakkan Paddle)', 'Spasi (Smash / Power Shot)'],
      touch: 'Geser jari ke atas dan ke bawah pada paddle layarmu'
    }
  },
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
  },
  {
    id: 'mabar-champion',
    title: 'Gladiator Duel Mabar',
    description: 'Menangkan duel di Neon Pong PvP Online',
    icon: 'Swords',
    rewardCoins: 120,
    rewardXp: 300,
    reqType: 'games_played',
    reqTarget: 1,
    gameId: 'neon-pong-duel'
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
    id: 'quest-mabar',
    title: 'Tantangan Duel Mabar',
    desc: 'Mainkan 1 ronde di Neon Pong Duel PvP',
    rewardCoins: 75,
    rewardXp: 150,
    progress: 0,
    maxProgress: 1,
    completed: false,
    claimed: false,
    gameId: 'neon-pong-duel'
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
  // --- STARTER AVATARS (GRATIS) ---
  {
    id: 'cyber-samurai',
    name: 'Cyber Samurai',
    title: 'Pendekar Pedang Neon',
    icon: '⚔️',
    color: 'from-cyan-500 to-blue-600',
    price: 0,
    minLevel: 1,
    rarity: 'common',
    description: 'Karakter starter standar bersenjata katana energi laser neon.',
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
    id: 'retro-gamer',
    name: 'Arcade Kid 84',
    title: 'Gamer Sejati Retro',
    icon: '🕹️',
    color: 'from-emerald-500 to-teal-600',
    price: 0,
    minLevel: 1,
    rarity: 'common',
    description: 'Juara turnamen mesin dingdong era 80-an dengan refleks kilat.',
    perkText: 'Karakter Starter Gratis'
  },

  // --- REGULAR SHOP AVATARS (BELI DENGAN KOIN) ---
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
    id: 'cyber-wolf',
    name: 'Neon Shadow Wolf',
    title: 'Serigala Malam Berburu',
    icon: '🐺',
    color: 'from-indigo-500 via-purple-600 to-pink-500',
    price: 180,
    rarity: 'rare',
    description: 'Pemangsa tangkas berkecepatan sonik dengan insting tajam.',
    perkText: 'Efek lolongan sonik neon'
  },
  {
    id: 'alien-boss',
    name: 'Xenon Overlord',
    title: 'Penguasa Dimensi Luar',
    icon: '👾',
    color: 'from-violet-500 to-purple-800',
    price: 220,
    rarity: 'epic',
    description: 'Bos penjaga gerbang arkade dengan kekuatan telekinesis kosmik.',
    perkText: 'Mahkota hologram ungu raja arkade'
  },
  {
    id: 'cyber-ninja-girl',
    name: 'Kunoichi Laser',
    title: 'Agen Siluman Matrix',
    icon: '🥷',
    color: 'from-pink-500 to-rose-600',
    price: 260,
    rarity: 'epic',
    description: 'Ahli menyusup sistem dengan belati laser dan shuriken plasma.',
    perkText: 'Jejak langkah bayangan laser'
  },
  {
    id: 'cyber-dj',
    name: 'Soundwave DJ',
    title: 'Master Beat Synthwave',
    icon: '🎧',
    color: 'from-cyan-400 via-fuchsia-500 to-indigo-600',
    price: 300,
    rarity: 'epic',
    description: 'Pencipta harmoni frekuensi bass yang memanipulasi ruang suara.',
    perkText: 'Visualizer audio equalizer aktif'
  },
  {
    id: 'cyber-dino',
    name: 'Rex Cyber Mech',
    title: 'T-Rex Cyborg Kuno',
    icon: '🦖',
    color: 'from-lime-500 to-emerald-700',
    price: 350,
    rarity: 'epic',
    description: 'Dinosaurus purba yang dibangkitkan dengan pelindung nano-alloy.',
    perkText: 'Aura gempa raungan mecha'
  },
  {
    id: 'pixel-paladin',
    name: 'Holy Pixel Paladin',
    title: 'Ksatria Cahaya Suci',
    icon: '🛡️',
    color: 'from-yellow-400 to-amber-600',
    price: 420,
    rarity: 'legendary',
    description: 'Ksatria suci penjaga keadilan arkade dengan perisai bercahaya.',
    perkText: 'Perlindungan berkah cahaya suci'
  },
  {
    id: 'mecha-phoenix',
    name: 'Solar Phoenix Mech',
    title: 'Burung Abadi Api Surya',
    icon: '🦅',
    color: 'from-amber-400 via-orange-500 to-red-600',
    price: 500,
    rarity: 'legendary',
    description: 'Burung mekanik legendaris yang bangkit dari abu bintang supernova.',
    perkText: 'Kepakan sayap kobaran surya'
  },
  {
    id: 'cyber-vampire',
    name: 'Blood Moon Count',
    title: 'Bangsawan AI Kuno',
    icon: '🧛‍♂️',
    color: 'from-rose-600 via-red-800 to-slate-950',
    price: 650,
    rarity: 'legendary',
    description: 'Bangsawan cyber abadi penghisap glitch data di malam bulan merah.',
    perkText: 'Aura kelelawar hologram darah'
  },
  {
    id: 'time-traveler',
    name: 'Chrono Nomad',
    title: 'Penjelajah Garis Waktu',
    icon: '⏳',
    color: 'from-teal-400 via-cyan-500 to-blue-700',
    price: 800,
    rarity: 'legendary',
    description: 'Penjaga kronologi multiverse yang dapat melompati dimensi abad.',
    perkText: 'Putaran jam kuantum misterius'
  },

  // --- EARLY STARTER LEVEL REWARD AVATARS ---
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
    minLevel: 20,
    isLimitedLevelReward: true,
    levelRewardTitle: 'Hadiah Mitos Level 20',
    rarity: 'legendary',
    description: 'Prajurit abadi beroda sayap kuantum dan pedang spektrum pelangi kehormatan.',
    perkText: '★ HADIAH LIMITED: Terbuka Otomatis Saat Capai Level 20'
  },
  {
    id: 'dark-lord',
    name: 'Shadow Overclock',
    title: 'Hacker Gelap Super-AI',
    icon: '👑',
    color: 'from-zinc-800 via-slate-900 to-amber-400',
    price: 0,
    minLevel: 50,
    isLimitedLevelReward: true,
    levelRewardTitle: 'Hadiah Penguasa Level 50',
    rarity: 'legendary',
    description: 'Entitas kecerdasan buatan tertinggi yang menguasai seluruh dunia Nova Arcade.',
    perkText: '★ HADIAH LIMITED: Terbuka Otomatis Saat Capai Level 50'
  },

  // --- KELIPATAN 100 LEVEL MILESTONE AVATARS (LIMITED EXCLUSIVE) ---
  {
    id: 'infernal-titan',
    name: 'Infernal Nova Warlord',
    title: 'Panglima Api Abadi (Kelipatan 100)',
    icon: '🔥',
    color: 'from-red-600 via-orange-500 to-yellow-400',
    price: 0,
    minLevel: 100,
    isLimitedLevelReward: true,
    levelRewardTitle: '🔥 Hadiah Eksklusif Milestone Level 100',
    rarity: 'legendary',
    description: 'Panglima penguasa magma inti bintang berapi yang dianugerahkan kepada gamer yang menembus Level 100.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 100'
  },
  {
    id: 'quantum-overlord',
    name: 'Quantum Singularity Lord',
    title: 'Penguasa Lubang Hitam (Kelipatan 200)',
    icon: '⚡',
    color: 'from-violet-600 via-indigo-500 to-cyan-400',
    price: 0,
    minLevel: 200,
    isLimitedLevelReward: true,
    levelRewardTitle: '⚡ Hadiah Eksklusif Milestone Level 200',
    rarity: 'legendary',
    description: 'Mengendalikan gravitasi kuantum dan partikel tak terbatas bagi para veteran Level 200.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 200'
  },
  {
    id: 'celestial-emperor',
    name: 'Celestial Nebula Emperor',
    title: 'Kaisar Galaksi Bima Sakti (Kelipatan 300)',
    icon: '🪐',
    color: 'from-purple-500 via-pink-500 to-amber-300',
    price: 0,
    minLevel: 300,
    isLimitedLevelReward: true,
    levelRewardTitle: '🪐 Hadiah Eksklusif Milestone Level 300',
    rarity: 'legendary',
    description: 'Kaisar penjaga konstelasi bintang terjauh dengan mahkota debu kosmik Level 300.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 300'
  },
  {
    id: 'cosmic-leviathan',
    name: 'Cosmic Abyss Leviathan',
    title: 'Naga Ruang Hampa (Kelipatan 400)',
    icon: '🐲',
    color: 'from-emerald-400 via-teal-500 to-blue-600',
    price: 0,
    minLevel: 400,
    isLimitedLevelReward: true,
    levelRewardTitle: '🐲 Hadiah Eksklusif Milestone Level 400',
    rarity: 'legendary',
    description: 'Makhluk kolosal penelan materi gelap yang berenang di samudra antariksa Level 400.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 400'
  },
  {
    id: 'omnipotent-deity',
    name: 'Omnipotent Matrix Deity',
    title: 'Dewa Pencipta Realitas (Kelipatan 500)',
    icon: '✨',
    color: 'from-yellow-300 via-amber-400 to-rose-500',
    price: 0,
    minLevel: 500,
    isLimitedLevelReward: true,
    levelRewardTitle: '✨ Hadiah Eksklusif Milestone Level 500',
    rarity: 'legendary',
    description: 'Entitas suci tak kasat mata yang mampu menulis ulang kode matriks semesta Level 500.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 500'
  },
  {
    id: 'hyper-genesis',
    name: 'Hyper Genesis Architect',
    title: 'Arsitek Multiverse (Kelipatan 600)',
    icon: '🧬',
    color: 'from-cyan-300 via-blue-500 to-indigo-700',
    price: 0,
    minLevel: 600,
    isLimitedLevelReward: true,
    levelRewardTitle: '🧬 Hadiah Eksklusif Milestone Level 600',
    rarity: 'legendary',
    description: 'Perancang untaian DNA kosmik dan galaksi baru bagi penguasa Level 600.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 600'
  },
  {
    id: 'astral-dominator',
    name: 'Astral Supernova Dominator',
    title: 'Penakluk Ledakan Surya (Kelipatan 700)',
    icon: '🌠',
    color: 'from-fuchsia-500 via-rose-500 to-orange-400',
    price: 0,
    minLevel: 700,
    isLimitedLevelReward: true,
    levelRewardTitle: '🌠 Hadiah Eksklusif Milestone Level 700',
    rarity: 'legendary',
    description: 'Menyerap energi ledakan supernova untuk menciptakan senjata plasma Level 700.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 700'
  },
  {
    id: 'void-oracle',
    name: 'Void Sovereign Oracle',
    title: 'Peramal Dimensi Kosong (Kelipatan 800)',
    icon: '🔮',
    color: 'from-slate-900 via-purple-900 to-cyan-400',
    price: 0,
    minLevel: 800,
    isLimitedLevelReward: true,
    levelRewardTitle: '🔮 Hadiah Eksklusif Milestone Level 800',
    rarity: 'legendary',
    description: 'Melihat masa depan dan masa lalu seluruh arkade dari dalam bola kristal hampa Level 800.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 800'
  },
  {
    id: 'abyssal-titan',
    name: 'Abyssal Primordial Titan',
    title: 'Raksasa Awal Mula Waktu (Kelipatan 900)',
    icon: '🔱',
    color: 'from-blue-700 via-indigo-900 to-amber-400',
    price: 0,
    minLevel: 900,
    isLimitedLevelReward: true,
    levelRewardTitle: '🔱 Hadiah Eksklusif Milestone Level 900',
    rarity: 'legendary',
    description: 'Pegang trisula gravitasi purba yang telah ada sebelum penciptaan arkade Level 900.',
    perkText: '★ HADIAH LIMITED KELIPATAN 100: Terbuka Otomatis Saat Capai Level 900'
  },
  {
    id: 'infinite-nova-god',
    name: 'Infinite Chrono God 1000',
    title: 'Dewa Tertinggi Nova Arcade (Kelipatan 1000)',
    icon: '🌟',
    color: 'from-yellow-200 via-amber-400 to-purple-700',
    price: 0,
    minLevel: 1000,
    isLimitedLevelReward: true,
    levelRewardTitle: '🌟 HADIAH MAHA MAHKOTA PUNCAK LEVEL 1000',
    rarity: 'legendary',
    description: 'Kasta teringgi mutlak para dewa arkade legendaris sepanjang masa di Level 1000.',
    perkText: '★ HADIAH LIMITED MAHA PUNCAK: Terbuka Otomatis Saat Capai Level 1000'
  }
];

export const AVATAR_LIST = SHOP_CHARACTERS.map(c => ({
  id: c.id,
  label: c.name,
  icon: c.icon,
  color: c.color
}));
