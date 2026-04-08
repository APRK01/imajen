"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useFilter } from "@/context/FilterContext";
import { motion } from "framer-motion";

const topics = [
  "All Art", 
  "Oceanic Abyssal", 
  "Ancient Monumental", 
  "Industrial Brutalism", 
  "Aether Landscapes", 
  "Deep Space", 
  "Neon Cyberpunk", 
  "Aesthetic Liminal", 
  "Ethereal Void",
  "Abstract Art"
];

export function TopicChips() {
  const { activeTopic, setActiveTopic } = useFilter();

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-4">
      {topics.map((topic) => (
        <motion.button
          key={topic}
          onClick={() => setActiveTopic(topic)}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex-none h-10 px-6 rounded-full text-xs font-black tracking-tight transition-all duration-300 border-[1.5px] relative overflow-hidden group/chip",
            activeTopic === topic 
              ? "border-primary text-white bg-primary shadow-soft-xl" 
              : "border-white/20 bg-white/40 backdrop-blur-xl text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-white/80"
          )}
        >
          <span className="relative z-10 uppercase">{topic}</span>
          {activeTopic === topic && (
            <motion.div 
               layoutId="chip-active-glow"
               className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
               initial={false}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {/* Subtle Hover Lens Effect */}
          <div className="absolute inset-0 opacity-0 group-hover/chip:opacity-100 bg-gradient-to-tr from-white/20 to-transparent transition-opacity duration-300 pointer-events-none" />
        </motion.button>
      ))}
    </div>
  );
}
