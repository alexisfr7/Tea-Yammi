import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto mt-14 max-w-[520px] md:max-w-4xl lg:max-w-6xl px-5 pb-10 text-center">
      <div className="flex justify-center">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition active:scale-90 hover:text-cocoa hover:border-cocoa"
        >
          <Instagram className="h-4 w-4" strokeWidth={1.5} />
        </a>
      </div>
      <p className="mt-4 font-serif text-lg text-cocoa">TeaYammi</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Salon de thé · Paris
      </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground/70 border-t border-border/20 pt-4">
        <p>© {new Date().getFullYear()} TeaYammi. Tous droits réservés.</p>
        <p>
          Fait par{" "}
          <a
            href="https://aureon-digital.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-cocoa transition-colors"
          >
            Aureon digital
          </a>
        </p>
      </div>
    </footer>
  );
}

