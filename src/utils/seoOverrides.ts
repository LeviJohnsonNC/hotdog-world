// Custom SEO title/description overrides for specific hotdog pages
// These are hand-tuned for CTR optimization based on Search Console data

export interface SeoOverride {
  title: string;
  description: string;
}

export const hotdogSeoOverrides: Record<string, SeoOverride> = {
  "pylsa": {
    title: "Pylsa — Iceland's Famous Hot Dog | Hot Dog World",
    description: "Iceland's beloved hot dog, made from lamb, pork & beef, topped with remoulade, fried onions & Icelandic mustard. The street food that Bill Clinton famously ordered.",
  },
  "tunnbrodsrulle": {
    title: "Tunnbrödsrulle — The Swedish Hot Dog | Hot Dog World",
    description: "Sweden's iconic street food: a hot dog wrapped in soft flatbread with mashed potato & shrimp salad. Anthony Bourdain called it the best thing he'd ever eaten.",
  },
  "aussie-dog": {
    title: "The Aussie Dog — Australia's Hot Dog | Hot Dog World",
    description: "Australia's hot dog: a grilled frankfurt piled with grilled onions, beetroot, tomato sauce & bacon. Meaty, messy, and unmistakably Australian.",
  },
  "montreal-steamie": {
    title: "Montreal Steamie — Quebec's Steamed Hot Dog | Hot Dog World",
    description: "The Montreal steamie: a steamed hot dog in a steamed bun, topped with mustard, relish, coleslaw & onions. Quebec's beloved street food since the 1940s.",
  },
  "atlanta-slaw-dog": {
    title: "Atlanta Slaw Dog — Georgia's Classic Hot Dog | Hot Dog World",
    description: "The Atlanta slaw dog is a Southern classic: a beef frank topped with creamy coleslaw, chili & mustard. Georgia's favourite way to dress a hot dog.",
  },
  "filipino-waffle-dog": {
    title: "Filipino Waffle Dog — Philippine Street Food | Hot Dog World",
    description: "A hot dog baked inside sweet waffle batter — the Filipino waffle dog is a beloved street snack found at kiosks across the Philippines, topped with ketchup or cheese.",
  },
  "alaska-reindeer-dog": {
    title: "Alaska Reindeer Dog — Alaska's Wild Hot Dog | Hot Dog World",
    description: "Alaska's iconic hot dog, made from reindeer meat and served from street carts across Anchorage. A uniquely Alaskan take on a classic American street food.",
  },
};
