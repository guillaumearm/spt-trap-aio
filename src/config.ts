import { AirdropChancePercent } from "@spt-aki/models/spt/config/IAirdropConfig";

/**
 *******************************************************************************
 * Configuration
 *******************************************************************************
 */

export const RAID_TIME = 60 * 8; // in minutes
export const INSURANCE_TIME = 1; // TODO: in minutes or seconds ?
export const SAVAGE_COOLDOWN = 60; // TODO: in minutes or seconds ?
export const MAGDRILL_SPEED_MULTIPLIER = 0.30; // lower this number to increase load/unload magdrill speed
export const GLOBAL_CHANCE_MODIFIER = 6.0;
export const STIMULANT_USES = 2;

export const CONSTRUCTION_TIME = 1; // in seconds
export const PRODUCTION_TIME = 1; // in seconds

export const BOTS_GRENADE_ALLOWED = false;

export const STASH_SIZE = 256; // vertical size

export const KEYTOOL_HEIGHT = 14;
export const KEYTOOL_WIDTH = 14;

export const KAPPA_EXTRA_SIZE = 4;
export const SECURE_CONTAINER_HEIGHT = 6;
export const SECURE_CONTAINER_WIDTH = 6;

export const AIRDROP_CHANCE: AirdropChancePercent = {
  reserve: 100,
  bigmap: 75,
  interchange: 75,
  lighthouse: 50,
  shoreline: 50,
  woods: 50
};

export const SCAV_TO_PMC_PERCENTAGE = 50;
export const ROGUE_TO_PMC_PERCENTAGE = 100;


/**
 *******************************************************************************
 * Ids
 *******************************************************************************
 */

export const BLACKLIST_MAPS = ['base', 'hideout', 'private area', 'privatearea'];

export const KEYTOOL_ID = '59fafd4b86f7745ca07e1232';
export const PRAPOR_ID = '54cb50c76803fa8b248b4571';
export const THERAPIST_ID = '54cb57776803fa99248b456e';
export const STIMULANT_ID = '5448f3a64bdc2d60728b456a';
export const PHYSICAL_BITCOIN_ID = '59faff1d86f7746c51718c9c';
