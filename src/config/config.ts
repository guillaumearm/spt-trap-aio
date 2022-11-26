import type { AirdropChancePercent } from "@spt-aki/models/spt/config/IAirdropConfig";

// Verbose mode (in server console)
export const DEBUG = true;

// Airdrops chance percentage by map
export const AIRDROP_CHANCE: AirdropChancePercent = {
  reserve: 75,
  bigmap: 75,
  interchange: 75,
  lighthouse: 75,
  shoreline: 75,
  woods: 75,
};

// Boss enabled in raid menu
export const BOSS_ENABLED_BY_DEFAULT = true;

export const ITEMS_WEIGHT_MULTIPLIER = 0.21;

export const ITEMS_FIXED_WEIGHTS = {
  "5c127c4486f7745625356c13": 1, // magazine case
  "5b6d9ce188a4501afc1b2b25": 2, // THICC weapon case
  "5c0a840b86f7742ffa4f2482": 4, // THICC item case
};

// Times and cooldowns
export const RAID_TIME = 60 * 8; // in minutes
export const INSURANCE_TIME = 1; // in hours
export const SAVAGE_COOLDOWN = 600; // in seconds
export const MAGDRILL_SPEED_MULTIPLIER = 0.42; // lower this number to increase load/unload magdrill speed

// Gameplay
export const GLOBAL_CHANCE_MODIFIER = 2; // loots multiplier
export const STIMULANT_USES = 3;
export const CASES_IN_BACKPACKS = true;
export const HOLSTER_ADDITIONAL_ITEMS = [
  "5ba26383d4351e00334c93d9", // mp7a1
  "5bd70322209c4d00d7167b8f", // mp7a2
  "5e00903ae9dc277128008b87", // mp9
  "5de7bd7bfd6b4e6e2276dc25", // mp9n
];

export const MIN_DURABILITY_FOR_SALE = 20; // default is 60

// Hideout
export const CONSTRUCTION_TIME = 0; // in seconds
export const PRODUCTION_TIME = 0; // in seconds

export const KEYTOOL_HEIGHT = 14;
export const KEYTOOL_WIDTH = 14;

/** ************************************************************************************ */
/* * Warning: the following options are ignored when using Trap's Progressive Stash mod. */
/** ************************************************************************************ */

export const KAPPA_EXTRA_SIZE = 4; // vertical size added to SECURE_CONTAINER_HEIGHT
export const SECURE_CONTAINER_HEIGHT = 6;
export const SECURE_CONTAINER_WIDTH = 6;

// Container sizes (vertical sizes)
export const STASH_SIZE = 256;
// export const STASH_SIZE = undefined; // `undefined` means no stash size override
