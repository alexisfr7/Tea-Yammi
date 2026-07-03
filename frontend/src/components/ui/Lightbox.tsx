"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/site-data";

type Props = {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export function Lightbox({ items, index, onClose, onIndexChange }: Props) {
  const item = items[index];
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [dir, setDir] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      const next = (index + delta + items.length) % items.length;
      onIndexChange(next);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  if (!item) return null;

  const variants = {
    enter: (d: number) => ({ 
      x: d > 0 ? 150 : -150, 
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)"
    }),
    center: { 
      x: 0, 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: (d: number) => ({ 
      x: d > 0 ? -150 : 150, 
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)"
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid grid-rows-[1fr_auto] bg-black/90 backdrop-blur-2xl"
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      onClick={onClose}
    >
      {/* Bouton de fermeture premium */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 md:top-10 md:right-10 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-md border border-white/10 transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
        aria-label="Fermer"
      >
        <X className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {/* ZONE DE L'IMAGE - Sécurisée avec CSS Grid et overflow-hidden */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-8 md:p-24 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          if (!touchStart.current) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - touchStart.current.x;
          const dy = t.clientY - touchStart.current.y;
          touchStart.current = null;
          if (Math.abs(dy) > 100 && Math.abs(dy) > Math.abs(dx)) {
            onClose();
            return;
          }
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center max-w-7xl mx-auto">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* L'image est contrainte par max-h-full et max-w-full de manière absolue */}
              <img
                src={item.src}
                alt={item.title}
                draggable={false}
                className="max-h-[100%] max-w-[100%] object-contain rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                style={{ 
                  maxHeight: 'min(100%, 80vh)', // Ne dépassera jamais 80% de l'écran en hauteur
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Boutons de navigation Flottants */}
        <button
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-[110] flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-xl border border-white/10 transition-all hover:bg-white/20 hover:scale-110 active:scale-90 shadow-2xl"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); go(1); }}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-[110] flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-xl border border-white/10 transition-all hover:bg-white/20 hover:scale-110 active:scale-90 shadow-2xl"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
        </button>
      </div>

      {/* ZONE DE LÉGENDE - Toujours en bas */}
      <div 
        className="w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-8 md:pb-12 px-6 flex justify-center z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-3xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            >
              {item.tag && (
                <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm">
                  {item.tag}
                </span>
              )}
              <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white drop-shadow-md">
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="mt-3 font-serif text-base md:text-xl italic text-white/70 drop-shadow">
                  {item.subtitle}
                </p>
              )}
              <p className="mt-4 text-sm md:text-lg leading-relaxed text-white/80 max-w-2xl mx-auto font-light">
                {item.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
