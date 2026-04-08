"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArtCard, ArtPiece } from "./ArtCard";
import { ArtModal } from "./ArtModal";
import { useFilter } from "@/context/FilterContext";
import { AnimatePresence, motion } from "framer-motion";

const CHUNK_SIZE = 24;
const VAULT_MANIFEST_URL = "https://raw.githubusercontent.com/APRK01/imajen-vault/main/manifest.json";

export function MasonryGrid() {
  const { activeTopic, searchQuery } = useFilter();
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);
  const [allArtworks, setAllArtworks] = useState<ArtPiece[]>([]);
  const [visibleArtworks, setVisibleArtworks] = useState<ArtPiece[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchManifest = useCallback(async () => {
    try {
      const response = await fetch(`${VAULT_MANIFEST_URL}?t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data)) {
          const sortedArt = [...data].sort((a, b) => 
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
          );
          setAllArtworks(sortedArt as ArtPiece[]);
        }
      }
    } catch (err) {
      console.error("Industrial Bridge Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManifest();
    const heartbeat = setInterval(fetchManifest, 10000);
    return () => clearInterval(heartbeat);
  }, [fetchManifest]);

  const filteredArt = allArtworks.filter((art) => {
    const artCat = (art.category || "").trim().toLowerCase();
    const activeCat = (activeTopic || "All Art").trim().toLowerCase();
    
    const matchesTopic = activeCat === "all art" || artCat === activeCat;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         art.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  useEffect(() => {
    setPage(1);
    setVisibleArtworks(filteredArt.slice(0, CHUNK_SIZE));
  }, [activeTopic, searchQuery, allArtworks.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && visibleArtworks.length < filteredArt.length) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0, rootMargin: '400px' }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isLoading, visibleArtworks.length, filteredArt.length]);

  useEffect(() => {
    const nextChunk = filteredArt.slice(0, page * CHUNK_SIZE);
    setVisibleArtworks(nextChunk);
  }, [page, filteredArt.length]);

  const [columnCount, setColumnCount] = useState(4);
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumnCount(1);
      else if (window.innerWidth < 1024) setColumnCount(2);
      else if (window.innerWidth < 1280) setColumnCount(3);
      else setColumnCount(4);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const columns: ArtPiece[][] = Array.from({ length: columnCount }, () => []);
  visibleArtworks.forEach((art, index) => {
    columns[index % columnCount].push(art);
  });

  if (isLoading && allArtworks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-[2px] w-40 bg-[#0a0a0a]/[0.1] relative" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[600px] mb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-[#0a0a0a] uppercase mb-1">
          IMAJEN
        </h1>
        <p className="text-[10px] font-black tracking-[0.4em] text-[#0a0a0a]/40 uppercase mb-8">
          BY NEONAUT STUDIO
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          The World's First Truly Autonomous Industrial AI Gallery.
        </p>
      </div>

      <div className="flex flex-row gap-1 -mx-1">
        {columns.map((column, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-1">
              {column.map((art) => (
                <div key={art.id} className="w-full">
                  <ArtCard {...art} onSelect={setSelectedArt} />
                </div>
              ))}
          </div>
        ))}
      </div>

      <div ref={observerTarget} className="h-20 w-full flex items-center justify-center pt-20">
        {visibleArtworks.length < filteredArt.length && (
          <div className="h-1 w-20 bg-black/5 animate-pulse" />
        )}
      </div>

      <ArtModal 
        isOpen={!!selectedArt} 
        onClose={() => setSelectedArt(null)} 
        art={selectedArt} 
      />
      
      {filteredArt.length === 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-40 text-center"
        >
          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <span className="text-4xl text-muted-foreground/30 font-sans">?</span>
          </div>
          <h3 className="text-xl font-bold font-sans text-primary">No Art Found</h3>
          <p className="text-muted-foreground font-sans">Wait for the first Kaggle Pulse to land.</p>
        </motion.div>
      )}
    </div>
  );
}
