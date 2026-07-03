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
    enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -100 : 100, opacity: 0 }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close button - always clearly visible */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30 active:scale-90"
        aria-label="Fermer"
      >
        <X className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
      </button>

      {/* Main Image Container */}
      <div 
        className="relative flex-1 w-full max-w-[1400px] overflow-hidden"
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
        <AnimatePresence custom={dir} mode="popLayout" initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex items-center justify-center p-4 md:p-16"
          >
            <img
              src={item.src}
              alt={item.title}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav Buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110] flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30 active:scale-90"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); go(1); }}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110] flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30 active:scale-90"
          aria-label="Suivant"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
        </button>
      </div>

      {/* Caption Bottom */}
      <div 
        className="relative z-[110] w-full p-6 text-center text-white shrink-0 bg-gradient-to-t from-black/40 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[800px]"
          >
            {item.tag && (
              <span className="mb-3 inline-block rounded-full border border-white/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                {item.tag}
              </span>
            )}
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-wide">{item.title}</h2>
            {item.subtitle && <p className="mt-2 font-serif text-sm md:text-base italic text-white/80">{item.subtitle}</p>}
            <p className="mt-3 text-sm md:text-base leading-relaxed text-white/90">{item.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
