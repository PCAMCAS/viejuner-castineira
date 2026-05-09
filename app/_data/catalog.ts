export const gameSystems = [
  {
    id: "all",
    name: "Todos",
    slug: "all",
  },
  {
    id: "warhammer-40k",
    name: "Warhammer 40,000",
    slug: "warhammer-40k",
  },
  {
    id: "age-of-sigmar",
    name: "Age of Sigmar",
    slug: "age-of-sigmar",
  },
  {
    id: "warhammer-fantasy",
    name: "Warhammer Fantasy",
    slug: "warhammer-fantasy",
  },
  {
    id: "the-old-world",
    name: "The Old World",
    slug: "the-old-world",
  },
  {
    id: "otros-juegos",
    name: "Otros juegos",
    slug: "otros-juegos",
  },
];

export const databaseGameSystemByCatalogSlug: Record<string, string> = {
  "warhammer-40k": "40k",
  "age-of-sigmar": "aos",
  "warhammer-fantasy": "fantasy",
  "the-old-world": "fantasy",
  "otros-juegos": "otros",
};

export const catalogSlugByDatabaseGameSystem: Record<string, string> = {
  "40k": "warhammer-40k",
  aos: "age-of-sigmar",
  fantasy: "warhammer-fantasy",
  otros: "otros-juegos",
};

export function toDatabaseGameSystem(system: string) {
  return databaseGameSystemByCatalogSlug[system] ?? system;
}

export function toCatalogGameSystemSlug(system: string) {
  return catalogSlugByDatabaseGameSystem[system] ?? system;
}

export function getCatalogGameSystemName(system: string) {
  const catalogSlug = toCatalogGameSystemSlug(system);

  return (
    gameSystems.find((gameSystem) => gameSystem.slug === catalogSlug)?.name ??
    system
  );
}

export const factions = [
  {
    id: "all",
    gameSystemId: "all",
    name: "Todas",
    slug: "all",
  },

  // Warhammer 40,000
  {
    id: "40k-space-marines",
    gameSystemId: "warhammer-40k",
    name: "Space Marines",
    slug: "space-marines",
  },
  {
    id: "40k-black-templars",
    gameSystemId: "warhammer-40k",
    name: "Black Templars",
    slug: "black-templars",
  },
  {
    id: "40k-blood-angels",
    gameSystemId: "warhammer-40k",
    name: "Blood Angels",
    slug: "blood-angels",
  },
  {
    id: "40k-dark-angels",
    gameSystemId: "warhammer-40k",
    name: "Dark Angels",
    slug: "dark-angels",
  },
  {
    id: "40k-deathwatch",
    gameSystemId: "warhammer-40k",
    name: "Deathwatch",
    slug: "deathwatch",
  },
  {
    id: "40k-grey-knights",
    gameSystemId: "warhammer-40k",
    name: "Grey Knights",
    slug: "grey-knights",
  },
  {
    id: "40k-space-wolves",
    gameSystemId: "warhammer-40k",
    name: "Space Wolves",
    slug: "space-wolves",
  },
  {
    id: "40k-adepta-sororitas",
    gameSystemId: "warhammer-40k",
    name: "Adepta Sororitas",
    slug: "adepta-sororitas",
  },
  {
    id: "40k-adeptus-custodes",
    gameSystemId: "warhammer-40k",
    name: "Adeptus Custodes",
    slug: "adeptus-custodes",
  },
  {
    id: "40k-adeptus-mechanicus",
    gameSystemId: "warhammer-40k",
    name: "Adeptus Mechanicus",
    slug: "adeptus-mechanicus",
  },
  {
    id: "40k-astra-militarum",
    gameSystemId: "warhammer-40k",
    name: "Astra Militarum",
    slug: "astra-militarum",
  },
  {
    id: "40k-imperial-agents",
    gameSystemId: "warhammer-40k",
    name: "Imperial Agents",
    slug: "imperial-agents",
  },
  {
    id: "40k-imperial-knights",
    gameSystemId: "warhammer-40k",
    name: "Imperial Knights",
    slug: "imperial-knights",
  },
  {
    id: "40k-chaos-space-marines",
    gameSystemId: "warhammer-40k",
    name: "Chaos Space Marines",
    slug: "chaos-space-marines",
  },
  {
    id: "40k-death-guard",
    gameSystemId: "warhammer-40k",
    name: "Death Guard",
    slug: "death-guard",
  },
  {
    id: "40k-thousand-sons",
    gameSystemId: "warhammer-40k",
    name: "Thousand Sons",
    slug: "thousand-sons",
  },
  {
    id: "40k-world-eaters",
    gameSystemId: "warhammer-40k",
    name: "World Eaters",
    slug: "world-eaters",
  },
  {
    id: "40k-chaos-daemons",
    gameSystemId: "warhammer-40k",
    name: "Chaos Daemons",
    slug: "chaos-daemons",
  },
  {
    id: "40k-chaos-knights",
    gameSystemId: "warhammer-40k",
    name: "Chaos Knights",
    slug: "chaos-knights",
  },
  {
    id: "40k-aeldari",
    gameSystemId: "warhammer-40k",
    name: "Aeldari",
    slug: "aeldari",
  },
  {
    id: "40k-drukhari",
    gameSystemId: "warhammer-40k",
    name: "Drukhari",
    slug: "drukhari",
  },
  {
    id: "40k-tyranids",
    gameSystemId: "warhammer-40k",
    name: "Tyranids",
    slug: "tyranids",
  },
  {
    id: "40k-genestealer-cults",
    gameSystemId: "warhammer-40k",
    name: "Genestealer Cults",
    slug: "genestealer-cults",
  },
  {
    id: "40k-leagues-of-votann",
    gameSystemId: "warhammer-40k",
    name: "Leagues of Votann",
    slug: "leagues-of-votann",
  },
  {
    id: "40k-necrons",
    gameSystemId: "warhammer-40k",
    name: "Necrons",
    slug: "necrons",
  },
  {
    id: "40k-orks",
    gameSystemId: "warhammer-40k",
    name: "Orks",
    slug: "orks",
  },
  {
    id: "40k-tau-empire",
    gameSystemId: "warhammer-40k",
    name: "T'au Empire",
    slug: "tau-empire",
  },
  {
    id: "40k-otros",
    gameSystemId: "warhammer-40k",
    name: "Otros / Sin identificar",
    slug: "otros-40k",
  },

  // Age of Sigmar
  {
    id: "aos-stormcast-eternals",
    gameSystemId: "age-of-sigmar",
    name: "Stormcast Eternals",
    slug: "stormcast-eternals",
  },
  {
    id: "aos-cities-of-sigmar",
    gameSystemId: "age-of-sigmar",
    name: "Cities of Sigmar",
    slug: "cities-of-sigmar",
  },
  {
    id: "aos-daughters-of-khaine",
    gameSystemId: "age-of-sigmar",
    name: "Daughters of Khaine",
    slug: "daughters-of-khaine",
  },
  {
    id: "aos-fyreslayers",
    gameSystemId: "age-of-sigmar",
    name: "Fyreslayers",
    slug: "fyreslayers",
  },
  {
    id: "aos-idoneth-deepkin",
    gameSystemId: "age-of-sigmar",
    name: "Idoneth Deepkin",
    slug: "idoneth-deepkin",
  },
  {
    id: "aos-kharadron-overlords",
    gameSystemId: "age-of-sigmar",
    name: "Kharadron Overlords",
    slug: "kharadron-overlords",
  },
  {
    id: "aos-lumineth-realm-lords",
    gameSystemId: "age-of-sigmar",
    name: "Lumineth Realm-lords",
    slug: "lumineth-realm-lords",
  },
  {
    id: "aos-seraphon",
    gameSystemId: "age-of-sigmar",
    name: "Seraphon",
    slug: "seraphon",
  },
  {
    id: "aos-sylvaneth",
    gameSystemId: "age-of-sigmar",
    name: "Sylvaneth",
    slug: "sylvaneth",
  },
  {
    id: "aos-slaves-to-darkness",
    gameSystemId: "age-of-sigmar",
    name: "Slaves to Darkness",
    slug: "slaves-to-darkness",
  },
  {
    id: "aos-blades-of-khorne",
    gameSystemId: "age-of-sigmar",
    name: "Blades of Khorne",
    slug: "blades-of-khorne",
  },
  {
    id: "aos-disciples-of-tzeentch",
    gameSystemId: "age-of-sigmar",
    name: "Disciples of Tzeentch",
    slug: "disciples-of-tzeentch",
  },
  {
    id: "aos-maggotkin-of-nurgle",
    gameSystemId: "age-of-sigmar",
    name: "Maggotkin of Nurgle",
    slug: "maggotkin-of-nurgle",
  },
  {
    id: "aos-hedonites-of-slaanesh",
    gameSystemId: "age-of-sigmar",
    name: "Hedonites of Slaanesh",
    slug: "hedonites-of-slaanesh",
  },
  {
    id: "aos-skaven",
    gameSystemId: "age-of-sigmar",
    name: "Skaven",
    slug: "skaven",
  },
  {
    id: "aos-flesh-eater-courts",
    gameSystemId: "age-of-sigmar",
    name: "Flesh-eater Courts",
    slug: "flesh-eater-courts",
  },
  {
    id: "aos-nighthaunt",
    gameSystemId: "age-of-sigmar",
    name: "Nighthaunt",
    slug: "nighthaunt",
  },
  {
    id: "aos-ossiarch-bonereapers",
    gameSystemId: "age-of-sigmar",
    name: "Ossiarch Bonereapers",
    slug: "ossiarch-bonereapers",
  },
  {
    id: "aos-soulblight-gravelords",
    gameSystemId: "age-of-sigmar",
    name: "Soulblight Gravelords",
    slug: "soulblight-gravelords",
  },
  {
    id: "aos-gloomspite-gitz",
    gameSystemId: "age-of-sigmar",
    name: "Gloomspite Gitz",
    slug: "gloomspite-gitz",
  },
  {
    id: "aos-ogor-mawtribes",
    gameSystemId: "age-of-sigmar",
    name: "Ogor Mawtribes",
    slug: "ogor-mawtribes",
  },
  {
    id: "aos-orruk-warclans",
    gameSystemId: "age-of-sigmar",
    name: "Orruk Warclans",
    slug: "orruk-warclans",
  },
  {
    id: "aos-sons-of-behemat",
    gameSystemId: "age-of-sigmar",
    name: "Sons of Behemat",
    slug: "sons-of-behemat",
  },
  {
    id: "aos-helsmiths-of-hashut",
    gameSystemId: "age-of-sigmar",
    name: "Helsmiths of Hashut",
    slug: "helsmiths-of-hashut",
  },
  {
    id: "aos-otros",
    gameSystemId: "age-of-sigmar",
    name: "Otros / Sin identificar",
    slug: "otros-aos",
  },

  // Warhammer Fantasy
  {
    id: "fantasy-the-empire",
    gameSystemId: "warhammer-fantasy",
    name: "El Imperio",
    slug: "the-empire",
  },
  {
    id: "fantasy-bretonnia",
    gameSystemId: "warhammer-fantasy",
    name: "Bretonnia",
    slug: "bretonnia",
  },
  {
    id: "fantasy-dwarfs",
    gameSystemId: "warhammer-fantasy",
    name: "Enanos",
    slug: "dwarfs",
  },
  {
    id: "fantasy-high-elves",
    gameSystemId: "warhammer-fantasy",
    name: "Altos Elfos",
    slug: "high-elves",
  },
  {
    id: "fantasy-wood-elves",
    gameSystemId: "warhammer-fantasy",
    name: "Elfos Silvanos",
    slug: "wood-elves",
  },
  {
    id: "fantasy-dark-elves",
    gameSystemId: "warhammer-fantasy",
    name: "Elfos Oscuros",
    slug: "dark-elves",
  },
  {
    id: "fantasy-orcs-and-goblins",
    gameSystemId: "warhammer-fantasy",
    name: "Orcos y Goblins",
    slug: "orcs-and-goblins",
  },
  {
    id: "fantasy-vampire-counts",
    gameSystemId: "warhammer-fantasy",
    name: "Condes Vampiro",
    slug: "vampire-counts",
  },
  {
    id: "fantasy-tomb-kings",
    gameSystemId: "warhammer-fantasy",
    name: "Reyes Funerarios",
    slug: "tomb-kings",
  },
  {
    id: "fantasy-warriors-of-chaos",
    gameSystemId: "warhammer-fantasy",
    name: "Guerreros del Caos",
    slug: "warriors-of-chaos",
  },
  {
    id: "fantasy-daemons-of-chaos",
    gameSystemId: "warhammer-fantasy",
    name: "Demonios del Caos",
    slug: "daemons-of-chaos",
  },
  {
    id: "fantasy-beastmen",
    gameSystemId: "warhammer-fantasy",
    name: "Hombres Bestia",
    slug: "beastmen",
  },
  {
    id: "fantasy-skaven",
    gameSystemId: "warhammer-fantasy",
    name: "Skaven",
    slug: "skaven",
  },
  {
    id: "fantasy-lizardmen",
    gameSystemId: "warhammer-fantasy",
    name: "Hombres Lagarto",
    slug: "lizardmen",
  },
  {
    id: "fantasy-ogre-kingdoms",
    gameSystemId: "warhammer-fantasy",
    name: "Reinos Ogros",
    slug: "ogre-kingdoms",
  },
  {
    id: "fantasy-chaos-dwarfs",
    gameSystemId: "warhammer-fantasy",
    name: "Enanos del Caos",
    slug: "chaos-dwarfs",
  },
  {
    id: "fantasy-dogs-of-war",
    gameSystemId: "warhammer-fantasy",
    name: "Perros de la Guerra / Mercenarios",
    slug: "dogs-of-war",
  },
  {
    id: "fantasy-otros",
    gameSystemId: "warhammer-fantasy",
    name: "Otros / Sin identificar",
    slug: "otros-fantasy",
  },

  // The Old World
  {
    id: "tow-empire-of-man",
    gameSystemId: "the-old-world",
    name: "Empire of Man",
    slug: "empire-of-man",
  },
  {
    id: "tow-kingdom-of-bretonnia",
    gameSystemId: "the-old-world",
    name: "Kingdom of Bretonnia",
    slug: "kingdom-of-bretonnia",
  },
  {
    id: "tow-dwarfen-mountain-holds",
    gameSystemId: "the-old-world",
    name: "Dwarfen Mountain Holds",
    slug: "dwarfen-mountain-holds",
  },
  {
    id: "tow-high-elf-realms",
    gameSystemId: "the-old-world",
    name: "High Elf Realms",
    slug: "high-elf-realms",
  },
  {
    id: "tow-wood-elf-realms",
    gameSystemId: "the-old-world",
    name: "Wood Elf Realms",
    slug: "wood-elf-realms",
  },
  {
    id: "tow-orc-and-goblin-tribes",
    gameSystemId: "the-old-world",
    name: "Orc & Goblin Tribes",
    slug: "orc-and-goblin-tribes",
  },
  {
    id: "tow-warriors-of-chaos",
    gameSystemId: "the-old-world",
    name: "Warriors of Chaos",
    slug: "warriors-of-chaos",
  },
  {
    id: "tow-beastmen-brayherds",
    gameSystemId: "the-old-world",
    name: "Beastmen Brayherds",
    slug: "beastmen-brayherds",
  },
  {
    id: "tow-tomb-kings-of-khemri",
    gameSystemId: "the-old-world",
    name: "Tomb Kings of Khemri",
    slug: "tomb-kings-of-khemri",
  },
  {
    id: "tow-dark-elves",
    gameSystemId: "the-old-world",
    name: "Dark Elves",
    slug: "dark-elves",
  },
  {
    id: "tow-skaven",
    gameSystemId: "the-old-world",
    name: "Skaven",
    slug: "skaven",
  },
  {
    id: "tow-vampire-counts",
    gameSystemId: "the-old-world",
    name: "Vampire Counts",
    slug: "vampire-counts",
  },
  {
    id: "tow-daemons-of-chaos",
    gameSystemId: "the-old-world",
    name: "Daemons of Chaos",
    slug: "daemons-of-chaos",
  },
  {
    id: "tow-ogre-kingdoms",
    gameSystemId: "the-old-world",
    name: "Ogre Kingdoms",
    slug: "ogre-kingdoms",
  },
  {
    id: "tow-lizardmen",
    gameSystemId: "the-old-world",
    name: "Lizardmen",
    slug: "lizardmen",
  },
  {
    id: "tow-chaos-dwarfs",
    gameSystemId: "the-old-world",
    name: "Chaos Dwarfs",
    slug: "chaos-dwarfs",
  },
  {
    id: "tow-otros",
    gameSystemId: "the-old-world",
    name: "Otros / Sin identificar",
    slug: "otros-the-old-world",
  },

  // Otros juegos
  {
    id: "otros-kill-team",
    gameSystemId: "otros-juegos",
    name: "Kill Team",
    slug: "kill-team",
  },
  {
    id: "otros-warcry",
    gameSystemId: "otros-juegos",
    name: "Warcry",
    slug: "warcry",
  },
  {
    id: "otros-underworlds",
    gameSystemId: "otros-juegos",
    name: "Warhammer Underworlds",
    slug: "warhammer-underworlds",
  },
  {
    id: "otros-necromunda",
    gameSystemId: "otros-juegos",
    name: "Necromunda",
    slug: "necromunda",
  },
  {
    id: "otros-blood-bowl",
    gameSystemId: "otros-juegos",
    name: "Blood Bowl",
    slug: "blood-bowl",
  },
  {
    id: "otros-horus-heresy",
    gameSystemId: "otros-juegos",
    name: "The Horus Heresy",
    slug: "the-horus-heresy",
  },
  {
    id: "otros-legions-imperialis",
    gameSystemId: "otros-juegos",
    name: "Legions Imperialis",
    slug: "legions-imperialis",
  },
  {
    id: "otros-middle-earth",
    gameSystemId: "otros-juegos",
    name: "Middle-earth Strategy Battle Game",
    slug: "middle-earth-strategy-battle-game",
  },
  {
    id: "otros-warhammer-quest",
    gameSystemId: "otros-juegos",
    name: "Warhammer Quest",
    slug: "warhammer-quest",
  },
  {
    id: "otros-no-warhammer",
    gameSystemId: "otros-juegos",
    name: "Otros juegos no Warhammer",
    slug: "otros-juegos-no-warhammer",
  },
];

export const products = [
  {
    id: 1,
    name: "Bibliotecario Blood Angels de metal",
    system: "Warhammer 40K",
    systemSlug: "40k",
    faction: "Blood Angels",
    factionSlug: "blood-angels",
    condition: "Metal · Pintado",
    price: 18,
    status: "Disponible",
  },
  {
    id: 2,
    name: "Pack Eldars clásicos",
    system: "Warhammer 40K",
    systemSlug: "40k",
    faction: "Eldars",
    factionSlug: "eldars",
    condition: "Plástico · Montado",
    price: 42,
    status: "Reservado",
  },
  {
    id: 3,
    name: "Orkos antiguos lote x10",
    system: "Warhammer 40K",
    systemSlug: "40k",
    faction: "Orkos",
    factionSlug: "orkos",
    condition: "Plástico · Sin pintar",
    price: 35,
    status: "Disponible",
  },
  {
    id: 4,
    name: "Necrones clásicos lote inicial",
    system: "Warhammer 40K",
    systemSlug: "40k",
    faction: "Necrones",
    factionSlug: "necrones",
    condition: "Plástico · Imprimado",
    price: 28,
    status: "Disponible",
  },
  {
    id: 5,
    name: "Stormcast Eternals pack héroes",
    system: "Age of Sigmar",
    systemSlug: "aos",
    faction: "Stormcast Eternals",
    factionSlug: "stormcast-eternals",
    condition: "Plástico · Montado",
    price: 30,
    status: "Disponible",
  },
  {
    id: 6,
    name: "Skaven antiguos lote ratas de clan",
    system: "Age of Sigmar",
    systemSlug: "aos",
    faction: "Skaven",
    factionSlug: "skaven",
    condition: "Plástico · Sin pintar",
    price: 25,
    status: "Reservado",
  },
  {
    id: 7,
    name: "Altos Elfos lanceros clásicos",
    system: "Warhammer Fantasy",
    systemSlug: "fantasy",
    faction: "Altos Elfos",
    factionSlug: "altos-elfos",
    condition: "Plástico · Pintado",
    price: 32,
    status: "Disponible",
  },
  {
    id: 8,
    name: "Condes Vampiro esqueletos antiguos",
    system: "Warhammer Fantasy",
    systemSlug: "fantasy",
    faction: "Condes Vampiro",
    factionSlug: "condes-vampiro",
    condition: "Plástico · Montado",
    price: 22,
    status: "Disponible",
  },
];