import React from 'react';

interface GamePreviewProps {
  gameId: string;
  className?: string;
  isHovered?: boolean;
}

export const GamePreview: React.FC<GamePreviewProps> = ({ gameId, className = '', isHovered = false }) => {
  switch (gameId) {
    case 'neon-pong-duel':
      return (
        <div className={`relative w-full h-full bg-[#0b0f19] overflow-hidden select-none ${className}`}>
          {/* Neon Court Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_14px] opacity-40" />

          {/* Center Court Net Dotted Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 border-r-2 border-dashed border-slate-600/70 z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-700/60 pointer-events-none" />

          {/* Score Header inside Preview */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-3 px-2.5 py-0.5 rounded-md bg-black/60 border border-slate-700/60 text-[10px] font-mono font-bold z-10">
            <span className="text-cyan-400">P1 <span className="text-white text-xs">4</span></span>
            <span className="text-slate-500">:</span>
            <span className="text-rose-400"><span className="text-white text-xs">2</span> P2</span>
          </div>

          {/* Left Paddle (Cyan Player 1) */}
          <div className={`absolute left-3 w-2 h-11 bg-cyan-400 rounded-full shadow-[0_0_12px_#06b6d4,0_0_4px_#ffffff] transition-all duration-700 ease-in-out ${isHovered ? 'top-[28%]' : 'top-[36%]'}`}>
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-cyan-200 rounded-full" />
          </div>

          {/* Right Paddle (Rose Player 2) */}
          <div className={`absolute right-3 w-2 h-11 bg-rose-500 rounded-full shadow-[0_0_12px_#f43f5e,0_0_4px_#ffffff] transition-all duration-700 ease-in-out ${isHovered ? 'top-[48%]' : 'top-[42%]'}`}>
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-rose-200 rounded-full" />
          </div>

          {/* Neon Glowing Ball with Speed Trail */}
          <div className={`absolute transition-all duration-500 ease-out ${isHovered ? 'left-[65%] top-[45%]' : 'left-[42%] top-[38%]'}`}>
            {/* Trail */}
            <div className="absolute -left-4 top-0.5 w-4 h-2 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-300 rounded-full blur-[1px]" />
            {/* Core Ball */}
            <div className="w-3.5 h-3.5 bg-yellow-200 rounded-full shadow-[0_0_14px_#fbbf24,0_0_6px_#f59e0b,0_0_2px_#ffffff] animate-pulse" />
          </div>

          {/* Hit Particle Sparks */}
          <div className="absolute left-5 top-[39%] flex gap-1 pointer-events-none">
            <div className="w-1 h-1 rounded-full bg-cyan-300 animate-ping opacity-75" />
            <div className="w-1 h-1 rounded-full bg-yellow-300 blur-[0.5px]" />
          </div>

          {/* Bottom Badge */}
          <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[9px] font-bold text-rose-300 font-mono tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <span>REAL-TIME 1v1</span>
          </div>
        </div>
      );

    case 'cyber-runner':
      return (
        <div className={`relative w-full h-full bg-[#080d1a] overflow-hidden select-none ${className}`}>
          {/* Cyberpunk Sunset / Skyline */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-indigo-950 via-purple-950/60 to-transparent" />
          
          {/* Neon Sun / Moon */}
          <div className="absolute top-2 right-6 w-10 h-10 rounded-full bg-gradient-to-b from-rose-500 via-pink-600 to-amber-500 shadow-[0_0_20px_#f43f5e] opacity-70" />

          {/* Distant City Skyline Silhouette */}
          <div className="absolute bottom-8 inset-x-0 flex items-end justify-between px-2 opacity-30 gap-1">
            <div className="w-4 h-10 bg-indigo-900 rounded-t-sm" />
            <div className="w-6 h-14 bg-indigo-900 rounded-t-sm flex flex-col gap-1 p-0.5">
              <div className="w-1 h-1 bg-cyan-400/80 rounded-full" />
              <div className="w-1 h-1 bg-amber-400/80 rounded-full ml-auto" />
            </div>
            <div className="w-5 h-8 bg-indigo-900 rounded-t-sm" />
            <div className="w-7 h-16 bg-indigo-900 rounded-t-sm flex flex-col gap-1 p-0.5">
              <div className="w-1 h-1 bg-pink-400/80 rounded-full" />
            </div>
            <div className="w-4 h-11 bg-indigo-900 rounded-t-sm" />
          </div>

          {/* 3D Perspective Road Grid */}
          <div className="absolute bottom-0 inset-x-0 h-9 bg-gradient-to-t from-cyan-950/80 to-slate-900 border-t border-cyan-500/60">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px)] bg-[size:18px_100%] opacity-30" />
            <div className="absolute inset-x-0 top-2 h-0.5 bg-cyan-400/40 shadow-[0_0_8px_#06b6d4]" />
          </div>

          {/* Cyber Runner Character (Running & Leaping) */}
          <div className={`absolute transition-all duration-300 ${isHovered ? 'left-10 bottom-8' : 'left-8 bottom-7'}`}>
            {/* Speed Echo Ghost */}
            <div className="absolute -left-3 top-0 opacity-40 blur-[1px] text-cyan-400 text-lg">🏃</div>
            {/* Main Character */}
            <div className="relative text-xl filter drop-shadow-[0_0_8px_#06b6d4]">
              🏃
            </div>
            {/* Running dust spark */}
            <div className="absolute -left-1 bottom-0 w-3 h-1 bg-cyan-400/60 rounded-full blur-[1px]" />
          </div>

          {/* Laser Hurdle Barrier */}
          <div className="absolute right-12 bottom-5 w-2 h-7 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t shadow-[0_0_12px_#f43f5e] flex flex-col items-center">
            <div className="w-4 h-0.5 bg-white shadow-[0_0_6px_#ffffff] -mt-0.5 rounded-full" />
          </div>

          {/* Floating Energy Coin */}
          <div className="absolute right-24 bottom-11 w-4 h-4 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center text-[8px] font-black text-amber-950 shadow-[0_0_10px_#f59e0b] animate-bounce">
            ₵
          </div>

          {/* Dash Meter HUD */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
            <span>DIST:</span>
            <span className="font-bold text-white">480m</span>
          </div>
        </div>
      );

    case 'space-strike':
      return (
        <div className={`relative w-full h-full bg-[#050614] overflow-hidden select-none ${className}`}>
          {/* Deep Space Stars */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className="absolute top-3 left-10 w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_6px_#22d3ee] animate-ping" />
          <div className="absolute top-8 right-14 w-1 h-1 bg-pink-300 rounded-full shadow-[0_0_6px_#f472b6]" />
          <div className="absolute top-12 left-24 w-1.5 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_8px_#fde047]" />

          {/* Cosmic Nebula Cloud */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-purple-600/20 blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-pink-600/20 blur-xl pointer-events-none" />

          {/* Alien Invader Fleet (Top) */}
          <div className="absolute top-3 inset-x-0 flex justify-center gap-4">
            <div className="flex flex-col items-center filter drop-shadow-[0_0_8px_#ec4899] animate-pulse">
              <span className="text-base">👾</span>
              <div className="w-4 h-0.5 bg-rose-500 rounded-full mt-0.5" />
            </div>
            <div className={`flex flex-col items-center filter drop-shadow-[0_0_12px_#f43f5e] transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
              <span className="text-xl">🛸</span>
              <div className="w-6 h-0.5 bg-amber-400 rounded-full mt-0.5" />
            </div>
            <div className="flex flex-col items-center filter drop-shadow-[0_0_8px_#ec4899] animate-pulse">
              <span className="text-base">👾</span>
              <div className="w-4 h-0.5 bg-rose-500 rounded-full mt-0.5" />
            </div>
          </div>

          {/* Twin Plasma Lasers Firing Upwards */}
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="w-1 h-8 bg-gradient-to-t from-cyan-400 to-white rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse" />
            <div className="w-1 h-8 bg-gradient-to-t from-cyan-400 to-white rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse" />
          </div>

          {/* Player Spaceship (Bottom) */}
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ${isHovered ? 'scale-110 -translate-y-1' : ''}`}>
            <span className="text-2xl filter drop-shadow-[0_0_10px_#06b6d4]">🚀</span>
            {/* Thruster flame */}
            <div className="w-2 h-2.5 bg-gradient-to-b from-cyan-300 via-blue-500 to-transparent rounded-b-full shadow-[0_0_10px_#06b6d4] -mt-1 animate-ping" />
          </div>

          {/* Combo HUD */}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 border border-pink-500/40 text-[9px] font-mono font-bold text-pink-300">
            COMBO x4 🔥
          </div>
        </div>
      );

    case 'block-breaker':
      return (
        <div className={`relative w-full h-full bg-[#0d0914] overflow-hidden select-none ${className}`}>
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#261833_1px,transparent_1px),linear-gradient(to_bottom,#261833_1px,transparent_1px)] bg-[size:10px_10px] opacity-50" />

          {/* Multi-Colored Breakout Bricks Rows */}
          <div className="absolute top-2 inset-x-3 flex flex-col gap-1">
            {/* Row 1: Rose / Red */}
            <div className="grid grid-cols-6 gap-1">
              <div className="h-2.5 rounded-xs bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              <div className="h-2.5 rounded-xs bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              <div className="h-2.5 rounded-xs bg-rose-500 opacity-20 border border-dashed border-rose-500" />
              <div className="h-2.5 rounded-xs bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              <div className="h-2.5 rounded-xs bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              <div className="h-2.5 rounded-xs bg-rose-500 opacity-30" />
            </div>
            {/* Row 2: Amber / Orange */}
            <div className="grid grid-cols-6 gap-1">
              <div className="h-2.5 rounded-xs bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
              <div className="h-2.5 rounded-xs bg-amber-500 opacity-20" />
              <div className="h-2.5 rounded-xs bg-amber-400 shadow-[0_0_8px_#f59e0b] border border-white/50 animate-pulse" />
              <div className="h-2.5 rounded-xs bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
              <div className="h-2.5 rounded-xs bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
              <div className="h-2.5 rounded-xs bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
            </div>
            {/* Row 3: Cyan / Emerald */}
            <div className="grid grid-cols-6 gap-1">
              <div className="h-2.5 rounded-xs bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <div className="h-2.5 rounded-xs bg-cyan-500 shadow-[0_0_6px_#06b6d4]" />
              <div className="h-2.5 rounded-xs bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <div className="h-2.5 rounded-xs bg-cyan-500 opacity-20" />
              <div className="h-2.5 rounded-xs bg-cyan-500 shadow-[0_0_6px_#06b6d4]" />
              <div className="h-2.5 rounded-xs bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            </div>
          </div>

          {/* Shattering Spark Particles */}
          <div className="absolute top-7 left-[45%] flex gap-1 pointer-events-none">
            <div className="w-1 h-1 bg-amber-300 rounded-full animate-ping" />
            <div className="w-1 h-1 bg-rose-400 rounded-full blur-[0.5px]" />
            <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full" />
          </div>

          {/* Falling Powerup Pill (Multi-ball) */}
          <div className="absolute top-10 left-[35%] w-3.5 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 border border-white shadow-[0_0_8px_#06b6d4] flex items-center justify-center text-[6px] font-black text-slate-950 animate-bounce">
            +3
          </div>

          {/* Bouncing High Speed Ball */}
          <div className={`absolute transition-all duration-500 ${isHovered ? 'left-[46%] bottom-10' : 'left-[44%] bottom-9'}`}>
            <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_12px_#38bdf8,0_0_4px_#ffffff]" />
          </div>

          {/* Bottom Player Paddle */}
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full shadow-[0_0_14px_#f59e0b,0_0_3px_#ffffff] border border-amber-200 transition-all duration-300 ${isHovered ? 'w-20' : ''}`}>
            <div className="absolute inset-x-2 top-0.5 h-0.5 bg-white/80 rounded-full" />
          </div>
        </div>
      );

    case 'neon-snake':
      return (
        <div className={`relative w-full h-full bg-[#05130e] overflow-hidden select-none ${className}`}>
          {/* Cyberpunk Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b_1px,transparent_1px),linear-gradient(to_bottom,#064e3b_1px,transparent_1px)] bg-[size:12px_12px] opacity-40" />

          {/* Dimension Portal (Top Right) */}
          <div className="absolute top-2 right-3 w-7 h-7 rounded-full border-2 border-dashed border-purple-400 shadow-[0_0_12px_#c084fc] flex items-center justify-center animate-spin">
            <div className="w-3 h-3 rounded-full bg-purple-500 blur-[1px]" />
          </div>

          {/* Slithering Snake Body Segments */}
          <div className="absolute inset-0">
            {/* Snake Head */}
            <div className={`absolute left-[54%] top-[34%] w-3.5 h-3.5 bg-emerald-300 rounded-md shadow-[0_0_12px_#34d399,0_0_3px_#ffffff] border border-white flex items-center justify-around px-0.5 z-10 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
              <div className="w-0.5 h-1 bg-slate-950 rounded-full" />
              <div className="w-0.5 h-1 bg-slate-950 rounded-full" />
            </div>

            {/* Snake Body Segments (S-Curve) */}
            <div className="absolute left-[46%] top-[34%] w-3 h-3 bg-emerald-400 rounded-md shadow-[0_0_8px_#10b981]" />
            <div className="absolute left-[38%] top-[34%] w-3 h-3 bg-emerald-400 rounded-md shadow-[0_0_8px_#10b981]" />
            <div className="absolute left-[38%] top-[46%] w-3 h-3 bg-emerald-500 rounded-md shadow-[0_0_8px_#10b981]" />
            <div className="absolute left-[38%] top-[58%] w-3 h-3 bg-teal-500 rounded-md shadow-[0_0_8px_#14b8a6]" />
            <div className="absolute left-[30%] top-[58%] w-2.5 h-2.5 bg-teal-600 rounded-md shadow-[0_0_6px_#0d9488]" />
            <div className="absolute left-[22%] top-[58%] w-2 h-2 bg-teal-700 rounded-md shadow-[0_0_4px_#0f766e]" />
          </div>

          {/* Glowing Neon Energy Fruit / Apple */}
          <div className="absolute left-[72%] top-[32%] flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-[0_0_12px_#f43f5e,0_0_4px_#ffffff] animate-ping opacity-75 absolute" />
            <div className="w-3.5 h-3.5 bg-gradient-to-br from-rose-400 to-red-600 rounded-full shadow-[0_0_10px_#f43f5e] border border-rose-200 relative flex items-center justify-center">
              <span className="text-[7px]">🍎</span>
            </div>
          </div>

          {/* HUD Length */}
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 border border-emerald-500/40 text-[9px] font-mono font-bold text-emerald-400">
            LENGTH: 24 🐍
          </div>
        </div>
      );

    case 'cyber-2048':
      return (
        <div className={`relative w-full h-full bg-[#0b0c1e] overflow-hidden select-none p-2 flex flex-col justify-center ${className}`}>
          {/* 4x4 Mini Number Grid */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 p-1.5 rounded-lg border border-indigo-500/40 shadow-inner max-w-[170px] mx-auto w-full">
            {/* Tile 2048 Golden */}
            <div className="h-6 rounded bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-[0_0_12px_#f59e0b] border border-amber-200 animate-pulse">
              2048
            </div>
            {/* Tile 1024 */}
            <div className="h-6 rounded bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-[9px] font-black text-white shadow-[0_0_8px_#ec4899]">
              1024
            </div>
            {/* Tile 512 */}
            <div className="h-6 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[9px] font-bold text-white shadow-[0_0_6px_#a855f7]">
              512
            </div>
            {/* Tile 256 */}
            <div className="h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-[9px] font-bold text-white shadow-[0_0_6px_#06b6d4]">
              256
            </div>

            {/* Row 2 */}
            <div className="h-6 rounded bg-indigo-700/80 flex items-center justify-center text-[9px] font-bold text-white">
              128
            </div>
            <div className="h-6 rounded bg-indigo-800/80 flex items-center justify-center text-[9px] font-semibold text-indigo-200">
              64
            </div>
            <div className="h-6 rounded bg-indigo-900/80 flex items-center justify-center text-[9px] font-semibold text-indigo-300">
              32
            </div>
            <div className="h-6 rounded bg-slate-800/90 flex items-center justify-center text-[9px] font-semibold text-slate-400">
              16
            </div>

            {/* Row 3 */}
            <div className="h-6 rounded bg-slate-800/90 flex items-center justify-center text-[9px] font-semibold text-slate-400">
              8
            </div>
            <div className="h-6 rounded bg-slate-800/90 flex items-center justify-center text-[9px] font-semibold text-slate-400">
              4
            </div>
            <div className="h-6 rounded bg-slate-800/60 flex items-center justify-center text-[9px] font-semibold text-slate-500">
              2
            </div>
            <div className="h-6 rounded bg-slate-900/40 border border-dashed border-slate-700/60" />
          </div>

          {/* Swipe Hint */}
          <div className="absolute bottom-1 right-2 text-[8px] font-mono text-indigo-400 flex items-center gap-1">
            <span>SWIPE ⇄</span>
          </div>
        </div>
      );

    case 'flappy-cyber':
      return (
        <div className={`relative w-full h-full bg-[#071317] overflow-hidden select-none ${className}`}>
          {/* Cyber Skyline Backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#042f2e_0%,#022c22_50%,#0f172a_100%)] opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:14px_14px] opacity-20" />

          {/* Top Laser Pillar Pipe */}
          <div className="absolute top-0 right-14 w-6 h-10 bg-gradient-to-b from-teal-900 to-teal-700 border-x border-b border-teal-400 rounded-b-md shadow-[0_0_10px_#14b8a6] flex flex-col items-center justify-end">
            <div className="w-8 h-2 bg-teal-400 rounded shadow-[0_0_8px_#2dd4bf]" />
            <div className="w-0.5 h-3 bg-red-400 shadow-[0_0_6px_#f87171] animate-pulse" />
          </div>

          {/* Bottom Laser Pillar Pipe */}
          <div className="absolute bottom-0 right-14 w-6 h-12 bg-gradient-to-t from-teal-900 to-teal-700 border-x border-t border-teal-400 rounded-t-md shadow-[0_0_10px_#14b8a6] flex flex-col items-center justify-start">
            <div className="w-0.5 h-3 bg-red-400 shadow-[0_0_6px_#f87171] animate-pulse" />
            <div className="w-8 h-2 bg-teal-400 rounded shadow-[0_0_8px_#2dd4bf]" />
          </div>

          {/* Cyber Flying Drone / Bird */}
          <div className={`absolute transition-all duration-300 ${isHovered ? 'left-9 top-[40%]' : 'left-8 top-[46%]'}`}>
            <div className="relative flex items-center filter drop-shadow-[0_0_10px_#2dd4bf]">
              <span className="text-2xl animate-bounce">🛸</span>
              {/* Jet Propulsion sparks */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-1 bg-teal-300 rounded-full blur-[0.5px] animate-ping" />
            </div>
          </div>

          {/* Passing Target Coin */}
          <div className="absolute right-16 top-[45%] w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] border border-yellow-200" />

          {/* Score Counter */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/70 border border-teal-400/50 text-xs font-mono font-bold text-teal-300">
            SCORE: 18
          </div>
        </div>
      );

    case 'monster-strike':
      return (
        <div className={`relative w-full h-full bg-[#160a1f] overflow-hidden select-none p-2 flex items-center justify-center ${className}`}>
          {/* 3x3 Cyber Holes Matrix */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[160px] w-full">
            {/* Hole 1 */}
            <div className="h-6 rounded-full bg-slate-950 border border-purple-900/60 shadow-inner flex items-center justify-center" />
            
            {/* Hole 2 - Monster Popping Up */}
            <div className="h-6 rounded-full bg-slate-950 border border-fuchsia-500/60 shadow-[0_0_10px_#d946ef] flex items-center justify-center relative">
              <div className={`absolute -top-3 text-xl filter drop-shadow-[0_0_8px_#ec4899] transition-transform duration-200 ${isHovered ? 'scale-125' : 'animate-bounce'}`}>
                👾
              </div>
            </div>

            {/* Hole 3 */}
            <div className="h-6 rounded-full bg-slate-950 border border-purple-900/60 shadow-inner" />

            {/* Hole 4 */}
            <div className="h-6 rounded-full bg-slate-950 border border-purple-900/60 shadow-inner" />

            {/* Hole 5 - Strike Target */}
            <div className="h-6 rounded-full bg-slate-950 border border-rose-500/70 shadow-[0_0_8px_#f43f5e] flex items-center justify-center relative">
              <div className="absolute -top-2 text-base filter drop-shadow-[0_0_6px_#f59e0b]">
                ⭐
              </div>
              <div className="absolute -right-3 -top-3 text-lg filter drop-shadow-[0_0_8px_#fbbf24] rotate-12">
                🔨
              </div>
            </div>

            {/* Hole 6 */}
            <div className="h-6 rounded-full bg-slate-950 border border-purple-900/60 shadow-inner" />
          </div>

          {/* Strike Hit FX */}
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-fuchsia-950/80 border border-fuchsia-500/50 text-[9px] font-mono font-black text-fuchsia-300 animate-pulse">
            +100 PTS! 💥
          </div>
        </div>
      );

    case 'memory-matrix':
      return (
        <div className={`relative w-full h-full bg-[#110924] overflow-hidden select-none p-2 flex items-center justify-center ${className}`}>
          {/* Cyber Card Grid */}
          <div className="grid grid-cols-4 gap-1.5 max-w-[170px] w-full">
            {/* Matched Card 1 */}
            <div className="h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 border border-violet-300 shadow-[0_0_10px_#8b5cf6] flex items-center justify-center text-sm font-bold text-white animate-pulse">
              ⚡
            </div>
            {/* Matched Card 2 */}
            <div className="h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 border border-violet-300 shadow-[0_0_10px_#8b5cf6] flex items-center justify-center text-sm font-bold text-white animate-pulse">
              ⚡
            </div>
            {/* Card 3 (Face Down) */}
            <div className="h-8 rounded-lg bg-slate-900 border border-indigo-900/80 flex items-center justify-center text-[10px] text-indigo-500 font-mono">
              ❖
            </div>
            {/* Card 4 (Face Down) */}
            <div className="h-8 rounded-lg bg-slate-900 border border-indigo-900/80 flex items-center justify-center text-[10px] text-indigo-500 font-mono">
              ❖
            </div>

            {/* Row 2 */}
            <div className="h-8 rounded-lg bg-slate-900 border border-indigo-900/80 flex items-center justify-center text-[10px] text-indigo-500 font-mono">
              ❖
            </div>
            {/* Revealed Card */}
            <div className="h-8 rounded-lg bg-gradient-to-br from-pink-600 to-rose-700 border border-pink-300 shadow-[0_0_8px_#ec4899] flex items-center justify-center text-sm font-bold text-white">
              💎
            </div>
            <div className="h-8 rounded-lg bg-slate-900 border border-indigo-900/80 flex items-center justify-center text-[10px] text-indigo-500 font-mono">
              ❖
            </div>
            <div className="h-8 rounded-lg bg-slate-900 border border-indigo-900/80 flex items-center justify-center text-[10px] text-indigo-500 font-mono">
              ❖
            </div>
          </div>

          {/* HUD Match Banner */}
          <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-black/70 border border-violet-500/40 text-[8px] font-mono font-bold text-violet-300">
            MATCH COMBO! ✨
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative w-full h-full bg-slate-950 flex items-center justify-center ${className}`}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xl">
            🎮
          </div>
        </div>
      );
  }
};
