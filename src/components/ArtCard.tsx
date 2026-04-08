"use client";

import React, { useState, useEffect, useRef } from "react";

export interface ArtPiece {
  id: string;
  image: string;
  title: string;
  author: string;
  prompt: string;
  votes?: number;
  category: string;
  model?: string;
  date?: string;
}

export interface ArtCardProps extends ArtPiece {
  onSelect?: (art: ArtPiece) => void;
}

export function ArtCard({ id, image, title, author, prompt, votes: initialVotes = 0, category, model, date, onSelect }: ArtCardProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect?.({ id, image, title, author, prompt, votes: initialVotes, category, model, date })}
      style={{ aspectRatio: "4 / 5" }}
      className="relative group rounded-[32px] overflow-hidden bg-[#0a0a0a]/5 cursor-zoom-in min-h-[400px] w-full border border-black/5"
    >
      {(!isInView || !isLoaded) && (
        <div className="absolute inset-0 z-10 glass overflow-hidden">
          <div className="absolute inset-0 shimmer" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-1 w-12 bg-black/[0.03] rounded-full" />
          </div>
        </div>
      )}

      {isInView && (
        <img
          src={image}
          alt={title}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-xl"
          }`}
        />
      )}
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
    </div>
  );
}
