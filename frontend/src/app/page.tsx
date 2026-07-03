"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { gallery as fallbackGallery, getOpenStatus, openingHours as fallbackHours } from "@/lib/site-data";
import { getGallery, getStatus } from "@/lib/api";

export default function HomePage() {
  const [gallery, setGallery] = useState(fallbackGallery);
  const [status, setStatus] = useState({ open: false, label: "Calcul en cours..." });
  const [hours, setHours] = useState(fallbackHours);

  const mainRef = useRef<HTMLElement | null>(null);
  const { scrollY } = useScroll();
  const headerBlur = useTransform(scrollY, [0, 120], [6, 18]);
  const heroY = useTransform(scrollY, [0, 400], [0, -30]);

  // Fetch gallery and status from Express API backend
  useEffect(() => {
    // Initial static calculations
    setStatus(getOpenStatus());

    const fetchData = async () => {
      try {
        const items = await getGallery();
        if (items && items.length > 0) {
          setGallery(items);
        }
      } catch (err) {
        console.warn("[frontend] Node.js backend offline, using local gallery fallback");
      }

      try {
        const data = await getStatus();
        setStatus(data.status);
        if (data.openingHours) {
          setHours(data.openingHours);
        }
      } catch (err) {
        console.warn("[frontend] Node.js backend offline, using local status fallback");
        setStatus(getOpenStatus());
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main ref={mainRef} className="relative min-h-screen bg-background text-foreground pb-12">
      {/* Hero */}
      <motion.section
        style={{ y: heroY }}
        className="mx-auto max-w-[520px] md:max-w-3xl lg:max-w-4xl px-5 pb-8 pt-20 md:pt-28 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground"
        >
          Bubble tea · Pâtisseries · Depuis Taïwan
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-3 font-serif text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] md:leading-[1.02] tracking-tight"
        >
          Une pause douce,<br />préparée à la commande.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-4 max-w-[36ch] md:max-w-[48ch] text-[14px] md:text-[16px] leading-relaxed text-muted-foreground"
        >
          Perles de tapioca de Taïwan, sucre de canne et lait de France.
          Chaque boisson et chaque pâtisserie est composée devant vous.
        </motion.p>
      </motion.section>

      {/* Carousel */}
      <Reveal amount={0.15}>
        <Carousel items={gallery} onOpen={() => {}} />
      </Reveal>

      {/* Thumbnails / mosaïque */}
      <section className="mx-auto mt-14 max-w-[520px] md:max-w-4xl lg:max-w-6xl px-5">
        <Reveal className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl md:text-3xl">La carte en images</h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {gallery.length} créations
          </span>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {gallery.map((g, i) => (
            <motion.div
              key={g.src + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
              transition={{
                duration: 0.6,
                delay: (i % 2) * 0.05 + Math.floor(i / 2) * 0.03,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              style={{ willChange: "transform, opacity" }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={g.src}
                alt={g.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/85 via-cocoa/20 to-transparent p-3">
                <p className="line-clamp-1 text-left font-serif text-[13px] text-cream">
                  {g.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info */}
      <section id="salon" className="mx-auto mt-16 max-w-[520px] md:max-w-4xl lg:max-w-5xl px-5">
        <Reveal className="rounded-3xl bg-cream/70 p-6 md:p-10 shadow-warm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl">Le salon</h2>
              <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-muted-foreground">
                Un coin de Taïwan à deux pas du Palais Royal. Lumière chaude,
                comptoir en bois clair et thé infusé à la minute.
              </p>
              <ul className="mt-5 space-y-3 text-[14px] md:text-[15px]">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
                  <span>10 Rue des Moulins, 75001 Paris</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
                  <a href="tel:+33950225730" className="underline-offset-4 hover:underline">09 50 22 57 30</a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
                  <span className="flex flex-col">
                    <span>{status.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Horaires : {hours[0]?.h || "12:00 – 22:00"}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center h-full">
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9] w-full hidden md:block mb-6 bg-muted shadow-sm border border-border/10">
                <img 
                  src="/images/image.png" 
                  alt="Le comptoir TeaYammi" 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                <a
                  href="https://maps.google.com/?q=10+Rue+des+Moulins+75001+Paris"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center justify-center rounded-full bg-primary text-[13px] font-medium text-primary-foreground transition active:scale-[0.98] hover:bg-primary/95 shadow-sm"
                >
                  Itinéraire
                </a>
                <a
                  href="tel:+33950225730"
                  className="flex h-11 items-center justify-center rounded-full border border-primary/20 bg-transparent text-[13px] font-medium text-primary transition active:scale-[0.98] hover:bg-primary/5"
                >
                  Appeler
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
