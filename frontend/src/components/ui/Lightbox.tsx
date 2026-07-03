"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/site-data";

type Props = {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export function Lightbox({ items, index, onClose, onIndexChange }: Props) {
  const reduce = useReducedMotion();
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
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/80 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Backdrop close area */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Modal card */}
      <div
        className="relative w-full max-w-[500px] bg-ivory rounded-[32px] overflow-hidden shadow-warm flex flex-col p-6 text-cocoa z-10 animate-in fade-in zoom-in-95 duration-200"
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
          if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) {
            onClose();
            return;
          }
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-serif text-sm text-cocoa/70">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-1 text-cocoa/30">/</span>
            {String(items.length).padStart(2, "0")}
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cocoa/10 text-cocoa transition hover:bg-cocoa/20 active:scale-90"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Image wrapper */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cocoa/5 shadow-inner">
          <AnimatePresence custom={dir} mode="popLayout" initial={false}>
            <motion.div
              key={index}
              custom={dir}
              variants={reduce ? undefined : variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={item.src}
                alt={item.title}
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <button
            onClick={() => go(-1)}
            aria-label="Image précédente"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 text-cocoa backdrop-blur-sm transition hover:bg-cream/90 active:scale-90 shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Image suivante"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 text-cocoa backdrop-blur-sm transition hover:bg-cream/90 active:scale-90 shadow-sm"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Caption */}
        <div className="mt-4 min-h-[90px] flex flex-col justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="text-left"
            >
              {item.tag && (
                <span className="mb-2 inline-block rounded-full border border-cocoa/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-cocoa/70">
                  {item.tag}
                </span>
              )}
              <h2 className="font-serif text-lg font-medium leading-tight text-cocoa">{item.title}</h2>
              {item.subtitle && (
                <p className="mt-0.5 font-serif text-xs italic text-cocoa/60">{item.subtitle}</p>
              )}
              <p className="mt-2 text-xs leading-relaxed text-cocoa/80">{item.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
