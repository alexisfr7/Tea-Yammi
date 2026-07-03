"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-ivory/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[520px] md:max-w-4xl lg:max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-serif text-xl tracking-tight text-cocoa">
          TeaYammi
        </Link>
        <nav className="flex gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs uppercase tracking-[0.15em] transition-colors py-1 ${
                  isActive ? "text-cocoa font-semibold" : "text-muted-foreground hover:text-cocoa"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
