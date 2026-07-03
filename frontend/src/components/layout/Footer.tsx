import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto mt-14 max-w-[520px] px-5 pb-10 text-center">
      <div className="flex justify-center">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition active:scale-90"
        >
          <Instagram className="h-4 w-4" strokeWidth={1.5} />
        </a>
      </div>
      <p className="mt-4 font-serif text-lg">TeaYammi</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Salon de thé · Paris
      </p>
      <p className="mt-6 text-[11px] text-muted-foreground/70">
        © {new Date().getFullYear()} TeaYammi. Tous droits réservés.
      </p>
    </footer>
  );
}
