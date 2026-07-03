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
      className="fixed inset-0 z-50 flex flex-col bg-cocoa/95 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
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
      <div className="relative z-10 flex items-center justify-between px-5 pt-4">
        <span className="font-serif text-sm text-cream/70">
          {String(index + 1).padStart(2, "0")}
          <span className="mx-1 text-cream/30">/</span>
          {String(items.length).padStart(2, "0")}
        </span>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur-md transition active:scale-90"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Image */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence custom={dir} mode="popLayout" initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={reduce ? undefined : variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex items-center justify-center px-5"
          >
            <img
              src={item.src}
              alt={item.title}
              draggable={false}
              className="max-h-full max-w-full select-none rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons (hidden on smallest screens, swipe still works) */}
        <button
          onClick={() => go(-1)}
          aria-label="Image précédente"
          className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur-md transition active:scale-90 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Image suivante"
          className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur-md transition active:scale-90 sm:flex"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Caption */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="px-6 pb-6 pt-4 text-cream"
        >
          {item.tag && (
            <span className="mb-2 inline-block rounded-full border border-cream/25 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-cream/70">
              {item.tag}
            </span>
          )}
          <h2 className="font-serif text-2xl leading-tight">{item.title}</h2>
          {item.subtitle && (
            <p className="mt-0.5 font-serif text-base italic text-cream/70">{item.subtitle}</p>
          )}
          <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/80">{item.description}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
