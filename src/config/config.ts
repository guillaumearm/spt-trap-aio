import type { AirdropChancePercent } from "@spt-aki/models/spt/config/IAirdropConfig";

/**
 *******************************************************************************
 * Configuration
 *******************************************************************************
 */
export type Config = {
  bots: {
    easy_ai?: boolean;
    dumb_ai?: boolean;
    allowed_grenades?: boolean;
    percentage_usec?: number;
    convert_bots_to_pmc?: boolean;
    scav_to_pmc_percentage?: number;
    rogue_to_pmc_percentage?: number;
    nb_additional_bots_per_wave?: number;
  };
  raids: {
    time_in_minutes?: number;
    magdrill_time_multiplier?: number;
    loot_multiplier?: number;
    airdrops?: {
      reserve?: number;
      bigmap?: number;
      interchange?: number;
      lighthouse?: number;
      shoreline?: number;
      woods?: number;
    };
  };
  raidmenu: {
    boss_enabled?: false;
    ai_difficulty?: string; // TODO: bind this value
    ai_amount?: string; // TODO: bind this value
  };
  hideout: {
    insurance_time_in_hours?: number;
    savage_cooldown_in_seconds?: number;
    construction_time_in_seconds?: number;
    production_time_in_seconds?: number;
    stash_vertical_size?: number;
  };
  flea: {
    disable_bsg_blacklist?: boolean; // TODO: bind this value
    all_items_sellable?: boolean; // TODO: bind this value
    no_durability_required?: boolean; // TODO: bind this value
    instant_sell?: boolean; // TODO: bind this value
    disable_fees?: boolean; // TODO: bind this value
  };
  items: {
    // TODO: flea market and raid menu category
    tweak_ammo_item_colors?: boolean; // TODO: bind this value
    cases_in_backpacks?: boolean;
    nb_stimulant_uses?: number;
    keys_infinite_uses?: boolean; // TODO: bind this value
    examine_all_items?: boolean; // TODO: bind this value
    keytool_size?: {
      horizontal: number;
      vertical: number;
    };
    gamma_size?: {
      horizontal: number;
      vertical: number;
    };
    kappa_extra_vertical_size?: number;
  };
};

// Verbose mode (in server console)
export const DEBUG = true;

// Bots settings
export const EASY_BOTS = true; // All bots are easy
export const DUMB_AI = false; // Make ai dumb
export const BOTS_GRENADE_ALLOWED = false;

// Airdrops chance percentage by map
export const AIRDROP_CHANCE: AirdropChancePercent = {
  reserve: 75,
  bigmap: 75,
  interchange: 75,
  lighthouse: 75,
  shoreline: 75,
  woods: 75,
};

// Bear or Usec
export const PERCENTAGE_USEC = 100; // set to 0 if you want to have bear PMCs

// More PMCs
export const CONVERT_BOTS_TO_PMC = true;
export const SCAV_TO_PMC_PERCENTAGE = 60; // 40% scav and 60% usec
export const ROGUE_TO_PMC_PERCENTAGE = 100; // all rogues converted to usec
export const RAIDERS_TO_PMC_PERCENTAGE = 100; // all raiders converted to usec

// More bots
export const WAVES_ADDITIONAL_BOTS_PER_MAP: Record<string, number> = {
  bigmap: 3, // customs
  factory4_day: 1,
  factory4_night: 1,
  interchange: 2,
  laboratory: 2,
  lighthouse: 2,
  rezervbase: 2,
  shoreline: 2,
  woods: 2,
};

export const SPAWN_ALL_BOTS_AT_START = true;

// Boss enabled in raid menu
export const BOSS_ENABLED_BY_DEFAULT = false;

export const ITEMS_WEIGHT_MULTIPLIER = 0.42;

export const ITEMS_FIXED_WEIGHTS = {
  "5c127c4486f7745625356c13": 1, // magazine case
  "5b6d9ce188a4501afc1b2b25": 2, // THICC weapon case
  "5c0a840b86f7742ffa4f2482": 4, // THICC item case
};

// Times and cooldowns
export const RAID_TIME = 60 * 8; // in minutes
export const INSURANCE_TIME = 1; // in hours
export const SAVAGE_COOLDOWN = 600; // in seconds
export const MAGDRILL_SPEED_MULTIPLIER = 0.21; // lower this number to increase load/unload magdrill speed

// Gameplay
export const GLOBAL_CHANCE_MODIFIER = 3; // loots multiplier
export const STIMULANT_USES = 3;
export const CASES_IN_BACKPACKS = true;
export const HOLSTER_ADDITIONAL_ITEMS = [
  "5ba26383d4351e00334c93d9", // mp7a1
  "5bd70322209c4d00d7167b8f", // mp7a2
  "5e00903ae9dc277128008b87", // mp9
  "5de7bd7bfd6b4e6e2276dc25", // mp9n
];

// Hideout
export const CONSTRUCTION_TIME = 0; // in seconds
export const PRODUCTION_TIME = 0; // in seconds

// Container sizes (vertical sizes)
export const STASH_SIZE = 256;
// export const STASH_SIZE = undefined; // `undefined` means no stash size override

export const KEYTOOL_HEIGHT = 14;
export const KEYTOOL_WIDTH = 14;

export const KAPPA_EXTRA_SIZE = 4; // vertical size added to SECURE_CONTAINER_HEIGHT
export const SECURE_CONTAINER_HEIGHT = 6;
export const SECURE_CONTAINER_WIDTH = 6;
