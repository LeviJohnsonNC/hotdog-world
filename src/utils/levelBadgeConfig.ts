import emptyBunImg from "@/assets/badges/levels/empty-bun.png";
import backyardNibblerImg from "@/assets/badges/levels/backyard-nibbler.png";
import condimentCadetImg from "@/assets/badges/levels/condiment-cadet.png";
import sausageScoutImg from "@/assets/badges/levels/sausage-scout.png";
import regionalRoamerImg from "@/assets/badges/levels/regional-roamer.png";
import casedMeatCrusaderImg from "@/assets/badges/levels/cased-meat-crusader.png";
import globalGastronomeImg from "@/assets/badges/levels/global-gastronome.png";
import frankfurterAficionadoImg from "@/assets/badges/levels/frankfurter-aficionado.png";
import viceroyViennaBeefImg from "@/assets/badges/levels/viceroy-vienna-beef.png";
import hotdogSultanImg from "@/assets/badges/levels/hotdog-sultan.png";

export interface LevelBadge {
  id: string;
  name: string;
  dogsTried: number;
  description: string;
  image: string;
}

export const LEVEL_BADGES: LevelBadge[] = [
  {
    id: "empty-bun",
    name: "The Empty Bun",
    dogsTried: 0,
    description: "The road starts here — an untouched bun and a wide, hungry world waiting to break you in.",
    image: emptyBunImg,
  },
  {
    id: "backyard-nibbler",
    name: "Backyard Nibbler",
    dogsTried: 1,
    description: "First dog down. A small bite, sure, but it opens the door to bigger, stranger things.",
    image: backyardNibblerImg,
  },
  {
    id: "condiment-cadet",
    name: "Condiment Cadet",
    dogsTried: 3,
    description: "Fingers stained, bottles rattling — the beginner's mess that every true eater survives.",
    image: condimentCadetImg,
  },
  {
    id: "sausage-scout",
    name: "Sausage Scout",
    dogsTried: 5,
    description: "Time to roam. Street smoke, cheap buns, and the first hints of adventure on the tongue.",
    image: sausageScoutImg,
  },
  {
    id: "regional-roamer",
    name: "Regional Roamer",
    dogsTried: 10,
    description: "Borders blur. A dog changes shape and attitude depending on where it's found, and that truth hits hard.",
    image: regionalRoamerImg,
  },
  {
    id: "cased-meat-crusader",
    name: "Cased-Meat Crusader",
    dogsTried: 15,
    description: "The hunt gets serious. Markets, side streets, carts held together by hope — all fair game.",
    image: casedMeatCrusaderImg,
  },
  {
    id: "global-gastronome",
    name: "Global Gastronome",
    dogsTried: 25,
    description: "Stamps fill the passport. Each city teaches a new lesson in heat, crunch, and local pride.",
    image: globalGastronomeImg,
  },
  {
    id: "frankfurter-aficionado",
    name: "Frankfurter Aficionado",
    dogsTried: 35,
    description: "Craft becomes clear. The snap of a good casing, the balance of toppings, the quiet confidence of a seasoned traveler.",
    image: frankfurterAficionadoImg,
  },
  {
    id: "viceroy-vienna-beef",
    name: "Viceroy of Vienna Beef",
    dogsTried: 45,
    description: "Prestige earned the long way: one dog, one city, one late night at a time.",
    image: viceroyViennaBeefImg,
  },
  {
    id: "hotdog-sultan",
    name: "The Hot Dog Sultan",
    dogsTried: 50,
    description: "The top of the mountain. A throne built from charcoal, spice, and a lifetime of wandering hunger.",
    image: hotdogSultanImg,
  },
];
