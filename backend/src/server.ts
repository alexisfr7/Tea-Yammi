import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

interface GalleryItem {
  src: string;
  title: string;
  subtitle?: string;
  description: string;
  tag?: string;
}

const gallery: GalleryItem[] = [
  {
    src: "/images/image-5.png",
    title: "Tartelette à l'ananas",
    subtitle: "椰香鳳梨塔",
    description: "Édition limitée — disponible les vendredis, samedis et dimanches d'été.",
    tag: "Signature",
  },
  {
    src: "/images/image-2.png",
    title: "Millefeuille passion",
    subtitle: "Duo gourmand",
    description: "Feuilletage caramélisé, crème vanille et fruit de la passion, servi avec notre thé glacé maison.",
    tag: "Duo",
  },
  {
    src: "/images/image-7.png",
    title: "Rouleau à la mangue",
    subtitle: "芒果卷",
    description: "Biscuit génoise, mangue et crème chantilly. Disponible pour 4, 6 ou 8 personnes.",
    tag: "À partager",
  },
  {
    src: "/images/image-10.png",
    title: "Millefeuille au fruit de la passion",
    subtitle: "Uniquement le week-end",
    description: "Pâte feuilletée dorée, crémeux passion et perles de chantilly légère.",
    tag: "Week-end",
  },
  {
    src: "/images/image-9.png",
    title: "Mont Blanc matcha",
    subtitle: "抹茶モンブラン",
    description: "Vermicelles de crème matcha, cœur chantilly et sablé breton, sous une neige de sucre glace.",
    tag: "Nouveauté",
  },
  {
    src: "/images/image-6.png",
    title: "Slush fraise",
    subtitle: "草莓冰沙",
    description: "Fraises fraîches mixées minute, glace pilée et éventail de fraises en garniture.",
    tag: "Rafraîchissant",
  },
  {
    src: "/images/image-8.png",
    title: "Passion & millefeuille",
    subtitle: "Le rituel du salon",
    description: "Notre thé glacé au fruit de la passion accompagné du millefeuille signature.",
    tag: "Classique",
  },
  {
    src: "/images/image.png",
    title: "Le comptoir",
    subtitle: "10 Rue des Moulins, Paris 1er",
    description: "Un coin de Taïwan à deux pas du Palais Royal : thé préparé à la commande, ambiance douce et lumière chaude.",
    tag: "Boutique",
  },
  {
    src: "/images/image-3.png",
    title: "Ambiance atelier",
    subtitle: "Fait maison, sur place",
    description: "Perles de tapioca de Taïwan, sucre de canne et lait de France. Chaque boisson est préparée devant vous.",
    tag: "Savoir-faire",
  },
  {
    src: "/images/image-4.png",
    title: "Salon de thé",
    subtitle: "Depuis 2018",
    description: "Une adresse discrète, pensée comme un salon parisien où le thé taïwanais rencontre la pâtisserie française.",
    tag: "Adresse",
  },
];

const openingHours = [
  { d: "Lundi – Dimanche", h: "12:00 – 22:00" },
];

const schedule: Record<number, { open: number; close: number }> = {
  0: { open: 12 * 60, close: 22 * 60 }, // Dimanche
  1: { open: 12 * 60, close: 22 * 60 }, // Lundi
  2: { open: 12 * 60, close: 22 * 60 }, // Mardi
  3: { open: 12 * 60, close: 22 * 60 }, // Mercredi
  4: { open: 12 * 60, close: 22 * 60 }, // Jeudi
  5: { open: 12 * 60, close: 22 * 60 }, // Vendredi
  6: { open: 12 * 60, close: 22 * 60 }, // Samedi
};

const fmt = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

function getOpenStatus(now: Date = new Date()) {
  const paris = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const day = paris.getDay();
  const mins = paris.getHours() * 60 + paris.getMinutes();
  const today = schedule[day];
  const open = mins >= today.open && mins < today.close;

  if (open) {
    return { open: true, label: `Ouvert · Ferme à ${fmt(today.close)}` };
  }
  if (mins < today.open) {
    return { open: false, label: `Fermé · Ouvre à ${fmt(today.open)}` };
  }
  const nextDay = schedule[(day + 1) % 7];
  return { open: false, label: `Fermé · Ouvre demain à ${fmt(nextDay.open)}` };
}

app.get("/api/gallery", (req, res) => {
  res.json(gallery);
});

app.get("/api/status", (req, res) => {
  res.json({
    status: getOpenStatus(),
    openingHours,
  });
});

app.listen(PORT, () => {
  console.log(`[backend] Server running on http://localhost:${PORT}`);
});
