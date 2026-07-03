import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nos Créations & Services — TeaYammi",
  description: "Découvrez notre carte de Bubble Tea artisanaux préparés à la commande, nos pâtisseries maison et spécialités taïwanaises à Paris 1er.",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-[520px] md:max-w-4xl lg:max-w-5xl px-5 pt-28 pb-20">
      <p className="text-[11px] uppercase tracking-[0.28em] text-tea font-bold">Notre carte</p>
      <h1 className="mt-2 font-serif text-[40px] md:text-[52px] leading-[1.02] tracking-tight">
        Nos Spécialités
      </h1>
      
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="border border-border/40 rounded-3xl p-6 bg-cream/20 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-2xl text-cocoa">Bubble Teas Traditionnels</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Préparés avec des feuilles de thé rigoureusement sélectionnées à Taïwan, du lait frais de qualité et nos perles de tapioca cuites maison au sucre de canne roux.
            </p>
          </div>
        </div>

        <div className="border border-border/40 rounded-3xl p-6 bg-cream/20 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-2xl text-cocoa">Pâtisseries Maison</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Une rencontre subtile entre la tradition pâtissière française et les douceurs taïwanaises : tartelettes ananas, millefeuilles gourmands et rouleaux aux fruits.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-cream/40 rounded-3xl p-6 border border-cream">
        <p className="font-serif text-lg text-cocoa">Une commande spéciale ?</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          Pour vos événements ou commandes de pâtisseries entières, n'hésitez pas à nous appeler directement ou à venir nous voir au salon.
        </p>
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
