import type { IBotType } from "@spt-aki/models/eft/common/tables/IBotType";
import type { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import type { ConfigServer } from "@spt-aki/servers/ConfigServer";
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import type {
  ILocations,
  ILocationData,
} from "@spt-aki/models/spt/server/ILocations";
import {
  DUMB_AI,
  EASY_BOTS,
  PERCENTAGE_USEC,
  RAIDERS_TO_PMC_PERCENTAGE,
  ROGUE_TO_PMC_PERCENTAGE,
  SCAV_TO_PMC_PERCENTAGE,
} from "../config/config";
import type { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

const copyEasyDifficulty = (bot: IBotType): void => {
  const { easy, normal, hard, impossible } = bot.difficulty;

  normal.Core = easy.Core;
  normal.Hearing = easy.Hearing;
  normal.Shoot = easy.Shoot;
  normal.Aiming = easy.Aiming;
  normal.Mind = easy.Mind;

  hard.Core = easy.Core;
  hard.Hearing = easy.Hearing;
  hard.Shoot = easy.Shoot;
  hard.Aiming = easy.Aiming;
  hard.Mind = easy.Mind;

  impossible.Core = easy.Core;
  impossible.Hearing = easy.Hearing;
  impossible.Shoot = easy.Shoot;
  impossible.Aiming = easy.Aiming;
  impossible.Mind = easy.Mind;
};

const setBotDifficulty = (bot: IBotType, isGrenadeAllowed: boolean): void => {
  const core = bot.difficulty.easy.Core;
  const hearing = bot.difficulty.easy.Hearing;
  const shoot = bot.difficulty.easy.Shoot;
  const aiming = bot.difficulty.easy.Aiming;
  const mind = bot.difficulty.easy.Mind;

  mind.CAN_TALK = true;
  core.canGrenade = isGrenadeAllowed;

  if (DUMB_AI) {
    // core.AccuratySpeed = 0.3; // >;
    core.AccuratySpeed = 0.6; // >;

    core.HearingSense = 1.05; // <
    core.VisibleAngle = 130; // <
    core.VisibleDistance = 60; // <
    core.WaitInCoverBetweenShotsSec = 1.5; // >

    //// shoot.MAX_RECOIL_PER_METER = 0.2; // >
    //// shoot.RECOIL_PER_METER = 0.1; // >
    //// shoot.RECOIL_TIME_NORMALIZE = 2; // >
    shoot.MAX_RECOIL_PER_METER = 0.3; // >
    shoot.RECOIL_PER_METER = 0.15; // >
    shoot.RECOIL_TIME_NORMALIZE = 3; // >

    hearing.CLOSE_DIST = 25; // <
    hearing.FAR_DIST = 50; // <

    // aiming.AIMING_TYPE = 5; // =
    //// aiming.ANY_PART_SHOOT_TIME = 30; // >
    aiming.ANY_PART_SHOOT_TIME = 35; // >
    aiming.BASE_HIT_AFFECTION_DELAY_SEC = 1.77; // >
    aiming.BASE_HIT_AFFECTION_MAX_ANG = 28; // >
    aiming.BASE_HIT_AFFECTION_MIN_ANG = 14; // >

    aiming.BETTER_PRECICING_COEF = 0.7; // <

    //// aiming.PANIC_TIME = 2; // >
    aiming.PANIC_TIME = 3; // >
    aiming.DAMAGE_PANIC_TIME = 3; // >
    // aiming.MAX_AIMING_UPGRADE_BY_TIME = 0.85; // >
    //// aiming.MAX_AIM_TIME = 1.5; // >
    // aiming.MAX_AIM_TIME = 2.0; // >
    // aiming.MAX_TIME_DISCARD_AIM_SEC = 3.2; // >
    // aiming.MIN_TIME_DISCARD_AIM_SEC = 2.9; // >
    //// aiming.MAX_TIME_DISCARD_AIM_SEC = 4.2; // >
    //// aiming.MIN_TIME_DISCARD_AIM_SEC = 3.9; // >
    // aiming.NEXT_SHOT_MISS_CHANCE_100 = 100; // >
    //// aiming.NEXT_SHOT_MISS_Y_OFFSET = 1; // >
    //// aiming.PANIC_TIME = 2; // >
    // aiming.NEXT_SHOT_MISS_Y_OFFSET = 1; // >
  }

  if (EASY_BOTS) {
    copyEasyDifficulty(bot);
  }
};

const BOT_TYPES = [
  "assault",
  "bear",
  "usec",
  "exusec",
  "pmcbot",
  "sectantwarrior",
  "sectantpriest",
  "gifter",
  "cursedassault",
  "bossbully",
  "bossgluhar",
  "bosskilla",
  "bosskojaniy",
  "bosssanitar",
  "bosstagilla",
  "followergluharassault",
  "followergluharscout",
  "followergluharsecurity",
  "followergluharsnipe",
  "followerkojaniy",
  "followersanitar",
  "followertagilla",
  "bosstest",
  "followertest",
  "marksman",
] as const;

export const setPMCBotConfig = (botConfig: IBotConfig): void => {
  botConfig.pmc.isUsec = PERCENTAGE_USEC;
  botConfig.pmc.chanceSameSideIsHostilePercent = 100;

  if (botConfig.pmc.convertIntoPmcChance) {
    // aki >= 3.2.0
    botConfig.pmc.convertIntoPmcChance.assault = {
      min: SCAV_TO_PMC_PERCENTAGE,
      max: SCAV_TO_PMC_PERCENTAGE,
    };

    botConfig.pmc.convertIntoPmcChance.exUsec = {
      min: ROGUE_TO_PMC_PERCENTAGE,
      max: ROGUE_TO_PMC_PERCENTAGE,
    };

    botConfig.pmc.convertIntoPmcChance.cursedAssault = {
      min: RAIDERS_TO_PMC_PERCENTAGE,
      max: RAIDERS_TO_PMC_PERCENTAGE,
    };

    botConfig.pmc.convertIntoPmcChance.pmcBot = {
      min: 100,
      max: 100,
    };
  } else if (botConfig.pmc.types) {
    // aki 3.1.x
    botConfig.pmc.types.assault = SCAV_TO_PMC_PERCENTAGE;
    botConfig.pmc.types.exUsec = ROGUE_TO_PMC_PERCENTAGE;
    botConfig.pmc.types.cursedAssault = RAIDERS_TO_PMC_PERCENTAGE;
    botConfig.pmc.types.pmcBot = 100;
  }
};

export const tweakBots = (
  database: DatabaseServer,
  configServer: ConfigServer,
  isGrenadeAllowed: boolean
): void => {
  const botConfig = configServer.getConfig<IBotConfig>(
    "aki-bot" as ConfigTypes.BOT
  );
  botConfig.pmc.difficulty = "easy";

  const tables = database.getTables();

  BOT_TYPES.forEach((type) => {
    const bot = tables.bots.types[type];

    if (bot) {
      setBotDifficulty(bot, isGrenadeAllowed);
    }
  });
};

const getAllLocationsData = (locations: ILocations): ILocationData[] => {
  return [
    locations.bigmap,
    locations.factory4_day,
    locations.factory4_night,
    locations.interchange,
    locations.laboratory,
    locations.lighthouse,
    locations.rezervbase,
    locations.shoreline,
    locations.woods,
    locations.town,
    locations.terminal,
    locations.tarkovstreets,
    locations.suburbs,
  ];
};

// increase waves intensity
export const tweakWaves = (
  db: DatabaseServer,
  additionalBotsPerMap: Record<string, number> = {},
  spawnAllBotsAtStart = false
): string[] => {
  const messages = [];
  const allValidLocations = getAllLocationsData(db.getTables().locations);

  allValidLocations.forEach((location) => {
    const mapId = location.base.Id.toLowerCase();
    const nbAdditionalBots = additionalBotsPerMap[mapId];

    location.base.MaxBotPerZone = 7;
    location.base.BotMax = 40;
    location.base.BotMaxPlayer = 40;

    if (nbAdditionalBots > 0) {
      location.base.waves.forEach((wave) => {
        wave.slots_min = wave.slots_min + nbAdditionalBots;
        wave.slots_max = wave.slots_max + nbAdditionalBots;
      });

      messages.push(
        `${nbAdditionalBots} additional bots added on map '${mapId}'`
      );
    }
  });

  if (spawnAllBotsAtStart) {
    allValidLocations.forEach((location) => {
      let spawnTime = 20;
      const spawnInterval = 8;

      location.base.waves.forEach((wave) => {
        wave.time_min = spawnTime;
        spawnTime = spawnTime + spawnInterval;
        wave.time_max = spawnTime;
      });

      const mapId = location.base.Id.toLowerCase();
      messages.push(
        `${location.base.waves.length} waves will spawn in ${
          Math.round((spawnTime / 60) * 100) / 100
        } minutes on map '${mapId}'`
      );
    });
  }
  return messages;
};
