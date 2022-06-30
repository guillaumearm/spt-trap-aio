import type { AirdropChancePercent } from "@spt-aki/models/spt/config/IAirdropConfig";

/**
 *******************************************************************************
 * Configuration
 *******************************************************************************
 */

// Verbose mode (in server console)
export const DEBUG = true;

// Bots settings
export const EASY_BOTS = true; // All bots are easy
export const DUMB_AI = true; // Make ai dumb
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
export const SCAV_TO_PMC_PERCENTAGE = 60; // 40% scan and 60% usec
export const ROGUE_TO_PMC_PERCENTAGE = 100; // all rogues converted to usec

// More bots
export const WAVES_ADDITIONAL_BOTS = 2;

// Boss enabled in raid menu
export const BOSS_ENABLED_BY_DEFAULT = false;

export const ITEMS_WEIGHT_MULTIPLIER = 0.5;

// Times and cooldowns
export const RAID_TIME = 60 * 8; // in minutes
export const INSURANCE_TIME = 1; // in hours
export const SAVAGE_COOLDOWN = 600; // in seconds
export const MAGDRILL_SPEED_MULTIPLIER = 0.28; // lower this number to increase load/unload magdrill speed

// Gameplay
export const GLOBAL_CHANCE_MODIFIER = 4.2; // loots multiplier
export const STIMULANT_USES = 3;

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
