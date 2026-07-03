"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "li" | "article";
  once?: boolean;
  amount?: number;
};

/**
 * Reveal — subtle fade + translate on scroll-in.
 * GPU-friendly (opacity + transform only), respects prefers-reduced-motion,
 * and stays mounted so state (carousel, lightbox) is never lost on scroll.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
  once = true,
  amount = 0.25,
}: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      variants={variants}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </MotionTag>
  );
}
