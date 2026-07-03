export type CreatureType =
  | "clownfish"    // cá hề
  | "turtle"       // rùa biển
  | "jellyfish"    // sứa
  | "seahorse"     // cá ngựa
  | "crab"         // cua
  | "octopus"      // bạch tuộc
  | "dolphin"      // cá heo
  | "starfish"     // sao biển
  | "pufferfish"   // cá nóc
  | "whale"        // cá voi
  | "shrimp"       // tôm
  | "ray";         // cá đuối

export interface Guest {
  key: string;
  display: string;
  pronoun: "bạn" | "anh" | "chị" | "em";
  msg: string | null;
  music: string | null;
  creature: CreatureType;
  creatureMsg: string | null;
  avatar: string | null;
}

export const CREATURE_EMOJI: Record<CreatureType, string> = {
  clownfish: "🐟",
  turtle: "🐢",
  jellyfish: "🪼",
  seahorse: "🐴",
  crab: "🦀",
  octopus: "🐙",
  dolphin: "🐬",
  starfish: "⭐",
  pufferfish: "🐡",
  whale: "🐋",
  shrimp: "🦐",
  ray: "🦈",
};

export const CREATURE_NAME_VI: Record<CreatureType, string> = {
  clownfish: "Cá hề",
  turtle: "Rùa biển",
  jellyfish: "Sứa",
  seahorse: "Cá ngựa",
  crab: "Cua",
  octopus: "Bạch tuộc",
  dolphin: "Cá heo",
  starfish: "Sao biển",
  pufferfish: "Cá nóc",
  whale: "Cá voi",
  shrimp: "Tôm",
  ray: "Cá đuối",
};
