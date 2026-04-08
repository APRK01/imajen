"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Copy, Check, Zap, Hash, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArtPiece } from "./ArtCard";

interface ArtModalProps {
  isOpen: boolean;
  onClose: () => void;
  art: ArtPiece | null;
}

export function ArtModal({ isOpen, onClose, art }: ArtModalProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleCopy = async () => {
    if (!art) return;
    try {
      await navigator.clipboard.writeText(art.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard Error:", err);
    }
  };

  const handleShare = async () => {
    if (!art) return;
    const shareData = {
      title: `IMAJEN // ${art.title}`,
      text: art.prompt,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error("Share Error:", err);
    }
  };

  if (!art) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/80 backdrop-blur-3xl"
          />

          <motion.div 
            layoutId={`art-card-${art.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-6xl max-h-[85vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/40 soft-shadow-hover"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-50 h-12 w-12 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-[#0a0a0a] hover:bg-white hover:scale-110 transition-all active:scale-95 shadow-sm"
            >
              <X size={24} />
            </button>

            <div className="flex-[1.5] bg-secondary/20 relative group/stage overflow-hidden min-h-[40vh] md:min-h-0">
              <motion.div 
                layoutId={isOpen ? `art-image-wrapper-${art.id}` : undefined}
                className="w-full h-full"
              >
                <motion.img 
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover"
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/stage:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="flex-1 flex flex-col min-h-0 md:h-[85vh] overflow-hidden md:bg-white/50 backdrop-blur-sm relative">
              <div className="flex-1 overflow-y-auto p-8 sm:p-10">
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0a0a0a]/40">{art.category}</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-[#0a0a0a] mb-2 leading-none uppercase">{art.title}</h2>
                  <p className="text-[10px] font-bold text-[#0a0a0a]/60 tracking-widest uppercase">By {art.author} — V1 Genesis</p>
                </div>

                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4 text-[#0a0a0a]">
                    <Zap size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Hardware Recipe</span>
                  </div>
                  <div className="bg-black/5 rounded-[32px] p-8 border border-black/5">
                    <p className="text-sm font-medium leading-relaxed italic text-[#0a0a0a]/80">
                       "{art.prompt}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-2xl p-5 border border-black/5 soft-shadow">
                    <div className="flex items-center gap-2 mb-2 text-[#0a0a0a]/40">
                      <Hash size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Archive ID</span>
                    </div>
                    <p className="text-[10px] font-mono font-bold text-[#0a0a0a] truncate">#{art.id.split('-')[1] || art.id}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-black/5 soft-shadow">
                    <div className="flex items-center gap-2 mb-2 text-[#0a0a0a]/40">
                      <Layers size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Model</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#0a0a0a] truncate" title={art.model}>{art.model || "NEON-ENGINE"}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-6 bg-white border-t border-black/5 flex gap-4 z-10">
                 <button 
                   onClick={handleCopy}
                   className={cn(
                     "flex-1 h-14 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 group/action active:scale-[0.96]",
                     copied ? "bg-green-500 text-white" : "bg-[#0a0a0a] text-white hover:bg-black/90"
                   )}
                 >
                    {copied ? "Copied Recipe" : "Copy Prompt"}
                    {copied ? <Check size={16} /> : <Copy size={16} className="group-hover/action:scale-110 transition-transform" />}
                 </button>
                 <button 
                    onClick={handleShare}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center border transition-all active:scale-90",
                      shared 
                        ? "bg-green-500 border-green-500 text-white" 
                        : "bg-black/5 border-black/5 text-[#0a0a0a] hover:bg-white hover:shadow-xl hover:border-black/10"
                    )}
                 >
                    {shared ? <Check size={18} /> : <Share2 size={18} />}
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
