import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Accès — TeaYammi",
  description: "Contactez le salon de thé taïwanais TeaYammi à Paris 1er. Accès, téléphone (09 50 22 57 30) et formulaire de contact.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[520px] md:max-w-4xl lg:max-w-5xl px-5 pt-28 pb-20">
      <p className="text-[11px] uppercase tracking-[0.28em] text-tea font-bold">Nous trouver</p>
      <h1 className="mt-2 font-serif text-[40px] md:text-[52px] leading-[1.02] tracking-tight">
        Contact & Accès
      </h1>

      <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <a
            href="https://maps.google.com/?q=10+Rue+des+Moulins+75001+Paris"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-3xl bg-cream/50 p-5 transition-colors hover:bg-cream/70 border border-cream"
          >
            <MapPin className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <span className="block font-serif text-lg text-cocoa">10 Rue des Moulins</span>
              <span className="text-sm text-muted-foreground">75001 Paris · Voir l'itinéraire</span>
            </div>
          </a>

          <a
            href="tel:+33950225730"
            className="flex items-start gap-4 rounded-3xl bg-cream/50 p-5 transition-colors hover:bg-cream/70 border border-cream"
          >
            <Phone className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <span className="block font-serif text-lg text-cocoa">09 50 22 57 30</span>
              <span className="text-sm text-muted-foreground">Appeler le salon de thé</span>
            </div>
          </a>

          <div className="flex items-start gap-4 rounded-3xl bg-cream/50 p-5 border border-cream">
            <Mail className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <span className="block font-serif text-lg text-cocoa">contact@teayammi.fr</span>
              <span className="text-sm text-muted-foreground">Nous écrire par email</span>
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div className="overflow-hidden rounded-3xl shadow-soft h-[320px] md:h-[350px] w-full border border-border/40">
          <iframe
            title="Carte Tea Yammi"
            src="https://www.google.com/maps?q=10+Rue+des+Moulins+75001+Paris&output=embed"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-[13px] font-medium text-primary-foreground transition active:scale-[0.98]"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
