"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/lib/site-data";

type Props = {
  items: GalleryItem[];
  onOpen: (i: number) => void;
  intervalMs?: number;
};

export function Carousel({ items, onOpen, intervalMs = 4000 }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const goTo = (i: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const itemWidth = el.clientWidth;
    el.scrollTo({ left: i * itemWidth, behavior: "smooth" });
    setIndex(i);
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setTimeout(() => {
      const nextIndex = (index + 1) % items.length;
      goTo(nextIndex);
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, paused, intervalMs, items.length]);

  return (
    <section aria-label="Nos créations" className="relative mx-auto w-full max-w-[520px] px-5">
      {/* Carousel container */}
      <div 
        className="relative group rounded-[28px] overflow-hidden bg-cocoa/5 shadow-warm"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setTimeout(() => setPaused(false), 1500)}
      >
        <div 
          ref={scrollRef}
          onScroll={onScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, i) => (
            <div 
              key={i} 
              className="w-full shrink-0 snap-center relative aspect-[4/5]"
              onClick={() => onOpen(i)}
              role="button"
            >
              <img
                src={item.src}
                alt={item.title}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {item.tag && (
                <div className="absolute left-4 top-4 rounded-full bg-cream/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-cocoa backdrop-blur">
                  {item.tag}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar overlay */}
        <div className="absolute inset-x-4 bottom-4 flex gap-1.5 z-10 pointer-events-none">
          {items.map((_, i) => (
            <div
              key={i}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-cream/30 pointer-events-auto cursor-pointer"
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
            >
              <span
                className="absolute inset-y-0 left-0 bg-cream transition-all duration-300"
                style={{
                  width: i === index ? "100%" : i < index ? "100%" : "0%"
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div className="mt-6 min-h-[132px] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="font-serif text-[26px] leading-tight text-foreground">
              {items[index]?.title}
            </h3>
            {items[index]?.subtitle && (
              <p className="mt-1 font-serif text-base italic text-muted-foreground">
                {items[index]?.subtitle}
              </p>
            )}
            <p className="mx-auto mt-3 max-w-[38ch] text-[14px] leading-relaxed text-muted-foreground">
              {items[index]?.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
