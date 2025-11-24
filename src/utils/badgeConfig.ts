import chiliCowboyImg from "@/assets/badges/chili-cowboy.png";
import firebreatherImg from "@/assets/badges/firebreather.png";
import archivistImg from "@/assets/badges/archivist.png";
import cartographerImg from "@/assets/badges/cartographer.png";
import puristImg from "@/assets/badges/purist.png";
import internationalRebelImg from "@/assets/badges/international-rebel.png";
import photojournalistImg from "@/assets/badges/photojournalist.png";
import flavorDetectiveImg from "@/assets/badges/flavor-detective.png";
import tailgaterImg from "@/assets/badges/tailgater.png";
import globetrotterImg from "@/assets/badges/globetrotter.png";
import passportOpenedImg from "@/assets/badges/passport-opened.png";
import librarianImg from "@/assets/badges/librarian.png";
import worldGourmetImg from "@/assets/badges/world-gourmet.png";

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  requirement: number; // How many needed to unlock
}

export const BADGES: Badge[] = [
  {
    id: "passport-opened",
    name: "Passport Opened",
    description: "Open your first hot dog detail page",
    image: passportOpenedImg,
    requirement: 1,
  },
  {
    id: "librarian",
    name: "The Librarian",
    description: "Explore 10 different hot dog detail pages",
    image: librarianImg,
    requirement: 10,
  },
  {
    id: "world-gourmet",
    name: "World Gourmet",
    description: "Explore all 50 hot dog detail pages",
    image: worldGourmetImg,
    requirement: 50,
  },
  {
    id: "chili-cowboy",
    name: "The Chili Cowboy",
    description: "Try 3 chili-topped hot dogs",
    image: chiliCowboyImg,
    requirement: 3,
  },
  {
    id: "firebreather",
    name: "The Firebreather",
    description: "Try 3 spicy hot dogs",
    image: firebreatherImg,
    requirement: 3,
  },
  {
    id: "archivist",
    name: "The Archivist",
    description: "Write 10 reviews",
    image: archivistImg,
    requirement: 10,
  },
  {
    id: "cartographer",
    name: "The Cartographer",
    description: "Try one dog from every region on the globe",
    image: cartographerImg,
    requirement: 6, // 6 regions
  },
  {
    id: "purist",
    name: "The Purist",
    description: "Try 5 classic/traditional hot dogs",
    image: puristImg,
    requirement: 5,
  },
  {
    id: "international-rebel",
    name: "The International Rebel",
    description: "Try 3 fusion or unconventional hot dogs",
    image: internationalRebelImg,
    requirement: 3,
  },
  {
    id: "photojournalist",
    name: "The Photojournalist",
    description: "Upload 5 photos of dogs you've tried",
    image: photojournalistImg,
    requirement: 5,
  },
  {
    id: "flavor-detective",
    name: "The Flavor Detective",
    description: "Try 4 dogs with uncommon or unusual ingredients",
    image: flavorDetectiveImg,
    requirement: 4,
  },
  {
    id: "tailgater",
    name: "The Tailgater",
    description: "Try 3 dogs with grilled or charred components",
    image: tailgaterImg,
    requirement: 3,
  },
  {
    id: "globetrotter",
    name: "The Globetrotter",
    description: "Try 7 dogs from different countries",
    image: globetrotterImg,
    requirement: 7,
  },
];
