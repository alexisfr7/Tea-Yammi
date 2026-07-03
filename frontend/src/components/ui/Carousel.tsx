"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GalleryItem } from "@/lib/site-data";

type Props = {
  items: GalleryItem[];
  onOpen: (i: number) => void;
  intervalMs?: number;
};

export function Carousel({ items, onOpen, intervalMs = 4000 }: Props) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const goTo = useCallback((i: number, d: number = 1) => {
    setDir(d);
    setIndex((prev) => {
      const next = (i + items.length) % items.length;
      return next === prev ? prev : next;
    });
  }, [items.length]);

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Auto-advance
  useEffect(() => {
    if (paused || reduce) return;
    timerRef.current = window.setTimeout(() => {
      setDir(1);
      setIndex((p) => (p + 1) % items.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, paused, reduce, intervalMs, items.length]);

  // Pause when tab hidden
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const item = items[index];

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "8%" : "-8%", opacity: 0 }),
    center: { x: "0%", opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-8%" : "8%", opacity: 0 }),
  };

  if (!item) return null;

  return (
    <section aria-label="Nos créations" className="relative">
      <div
        className="relative mx-auto w-full max-w-[520px] md:max-w-[580px] lg:max-w-[640px] px-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Image stage */}
        <div
          className="cursor-pointer group relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-cocoa/5 shadow-warm"
          onTouchStart={(e) => {
            setPaused(true);
            const t = e.touches[0];
            touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
          }}
          onTouchEnd={(e) => {
            const start = touchRef.current;
            touchRef.current = null;
            setTimeout(() => setPaused(false), 1500);
            if (!start) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
              dx < 0 ? next() : prev();
            }
          }}
          onClick={() => {
            onOpen(index);
          }}
          role="button"
          aria-label={`Ouvrir ${item.title}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(index); }
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
        >
          <AnimatePresence custom={dir} mode="popLayout" initial={false}>
            <motion.img
              key={index}
              src={item.src}
              alt={item.title}
              draggable={false}
              custom={dir}
              variants={reduce ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </AnimatePresence>

          {/* Corner tag */}
          {item.tag && (
            <div className="pointer-events-none absolute left-4 top-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={item.tag + index}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-full bg-cream/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-cocoa backdrop-blur"
                >
                  {item.tag}
                </motion.span>
              </AnimatePresence>
            </div>
          )}

          {/* Progress bar */}
          <div className="absolute inset-x-4 bottom-4 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i, i > index ? 1 : -1); }}
                aria-label={`Aller à l'image ${i + 1}`}
                className="group relative h-1 flex-1 overflow-hidden rounded-full bg-cream/30"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-cream"
                  style={{
                    width: i < index ? "100%" : i === index ? undefined : "0%",
                    animation:
                      i === index && !paused && !reduce
                        ? `progress ${intervalMs}ms linear forwards`
                        : undefined,
                    ...(i === index && (paused || reduce) ? { width: "0%" } : {}),
                  }}
                  key={`${i}-${index}-${paused}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div className="mt-6 min-h-[132px] text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <h3 className="font-serif text-[26px] leading-tight text-foreground">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="mt-1 font-serif text-base italic text-muted-foreground">
                  {item.subtitle}
                </p>
              )}
              <p className="mx-auto mt-3 max-w-[38ch] text-[14px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  );
}
