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
    
    // On trouve l'élément enfant correspondant pour avoir sa position exacte
    const itemEl = el.children[i] as HTMLElement;
    if (itemEl) {
      const scrollPos = itemEl.offsetLeft - (el.clientWidth / 2) + (itemEl.clientWidth / 2);
      el.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
    setIndex(i);
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    
    // Pour trouver l'élément le plus au centre
    const centerPosition = el.scrollLeft + el.clientWidth / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    Array.from(el.children).forEach((child, i) => {
      const childEl = child as HTMLElement;
      const childCenter = childEl.offsetLeft + childEl.clientWidth / 2;
      const distance = Math.abs(centerPosition - childCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    if (closestIndex !== index) {
      setIndex(closestIndex);
    }
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
    <section aria-label="Nos créations" className="relative mx-auto w-full max-w-7xl px-5">
      {/* Carousel container */}
      <div 
        className="relative group rounded-[28px] overflow-hidden bg-cocoa/5 shadow-warm py-4 md:py-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setTimeout(() => setPaused(false), 1500)}
      >
        <div 
          ref={scrollRef}
          onScroll={onScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing px-4 md:px-1/2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Les paddings de scroll permettent au premier/dernier élément d'être centré */}
          <div className="w-[10%] md:w-[25%] lg:w-[35%] shrink-0" />
          
          {items.map((item, i) => (
            <div 
              key={i} 
              className="w-[80%] md:w-[50%] lg:w-[30%] shrink-0 snap-center relative aspect-[4/5] px-2 md:px-4 transition-transform duration-500"
              style={{
                transform: index === i ? 'scale(1)' : 'scale(0.9)',
                opacity: index === i ? 1 : 0.6,
              }}
              onClick={() => {
                if (index === i) {
                  onOpen(i);
                } else {
                  goTo(i);
                }
              }}
              role="button"
            >
              <div className="w-full h-full relative rounded-[20px] overflow-hidden shadow-md">
                <img
                  src={item.src}
                  alt={item.title}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                {item.tag && (
                  <div className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-cocoa backdrop-blur shadow-sm">
                    {item.tag}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div className="w-[10%] md:w-[25%] lg:w-[35%] shrink-0" />
        </div>

        {/* Progress bar overlay */}
        <div className="absolute inset-x-8 md:inset-x-32 bottom-2 md:bottom-4 flex gap-1.5 z-10 pointer-events-none">
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
      <div className="mt-8 min-h-[132px] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="font-serif text-[28px] md:text-[32px] leading-tight text-foreground">
              {items[index]?.title}
            </h3>
            {items[index]?.subtitle && (
              <p className="mt-1 font-serif text-base md:text-lg italic text-muted-foreground">
                {items[index]?.subtitle}
              </p>
            )}
            <p className="mx-auto mt-3 max-w-[45ch] text-[14px] md:text-[15px] leading-relaxed text-muted-foreground">
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
