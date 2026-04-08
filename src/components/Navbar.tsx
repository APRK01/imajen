"use client";

import React from "react";
import { Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilter } from "@/context/FilterContext";

export function Navbar() {
  const { searchQuery, setSearchQuery } = useFilter();

  return (
    <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 sm:px-10 flex items-center gap-8 group transition-all duration-500">
      {/* Brand Anchor - Migrated from Sidebar */}
      <div
        className="flex items-center cursor-pointer group/logo active:scale-95 transition-transform"
        onClick={() => {
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <div className="h-10 w-10 relative mr-3 transition-all duration-500 group-hover/logo:scale-110">
          <img src="/logo.png" alt="Neonaut" className="h-full w-full object-contain invert" />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black tracking-[0.3em] text-[#0a0a0a]/40 leading-none mb-1 uppercase">NEONAUT STUDIO'S</span>
          <span className="text-xl font-black tracking-tighter text-[#0a0a0a] leading-none uppercase">IMAJEN</span>
        </div>
      </div>

      {/* Pinterest-style Search Bar - Maximum Horizon */}
      <div className="flex-1 max-w-6xl ml-8">
        <div className="relative group/search">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#0a0a0a]/40 group-focus-within/search:text-[#0a0a0a] transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI Art, Prompts, or Styles..."
            className="w-full h-12 bg-secondary/80 rounded-full pl-12 pr-4 text-sm font-medium text-[#0a0a0a] placeholder:text-[#0a0a0a]/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 soft-shadow group-focus-within/search:soft-shadow-hover"
          />
        </div>
      </div>
    </header>
  );
}
