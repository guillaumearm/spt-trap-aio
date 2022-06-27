import { IBotType } from "@spt-aki/models/eft/common/tables/IBotType";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import {
  PERCENTAGE_USEC,
  ROGUE_TO_PMC_PERCENTAGE,
  SCAV_TO_PMC_PERCENTAGE,
} from "../config";

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

  // core.AccuratySpeed = 0.3; // >;
  core.AccuratySpeed = 0.9; // >;
  core.canGrenade = isGrenadeAllowed;
  core.HearingSense = 1.05; // <
  core.VisibleAngle = 130; // <
  core.VisibleDistance = 110; // <
  core.WaitInCoverBetweenShotsSec = 1.5; // >

  // shoot.MAX_RECOIL_PER_METER = 0.2; // >
  // shoot.RECOIL_PER_METER = 0.1; // >
  // shoot.RECOIL_TIME_NORMALIZE = 2; // >
  shoot.MAX_RECOIL_PER_METER = 0.4; // >
  shoot.RECOIL_PER_METER = 0.2; // >
  shoot.RECOIL_TIME_NORMALIZE = 4; // >

  hearing.CLOSE_DIST = 10; // <
  hearing.FAR_DIST = 30; // <

  aiming.AIMING_TYPE = 5; // =
  // aiming.ANY_PART_SHOOT_TIME = 30; // >
  aiming.ANY_PART_SHOOT_TIME = 40; // >
  aiming.BASE_HIT_AFFECTION_DELAY_SEC = 1.77; // >
  aiming.BASE_HIT_AFFECTION_MAX_ANG = 28; // >
  aiming.BASE_HIT_AFFECTION_MIN_ANG = 14; // >
  // aiming.BETTER_PRECICING_COEF = 0.7 // <
  aiming.BETTER_PRECICING_COEF = 0.5; // <
  aiming.DAMAGE_PANIC_TIME = 15; // >
  aiming.MAX_AIMING_UPGRADE_BY_TIME = 0.85; // >
  // aiming.MAX_AIM_TIME = 1.5; // >
  aiming.MAX_AIM_TIME = 3.5; // >
  // aiming.MAX_TIME_DISCARD_AIM_SEC = 3.2; // >
  // aiming.MIN_TIME_DISCARD_AIM_SEC = 2.9; // >
  aiming.MAX_TIME_DISCARD_AIM_SEC = 4.2; // >
  aiming.MIN_TIME_DISCARD_AIM_SEC = 3.9; // >
  aiming.NEXT_SHOT_MISS_CHANCE_100 = 100; // >
  // aiming.NEXT_SHOT_MISS_Y_OFFSET = 1; // >
  // aiming.PANIC_TIME = 2; // >
  aiming.NEXT_SHOT_MISS_Y_OFFSET = 2; // >
  aiming.PANIC_TIME = 4; // >

  copyEasyDifficulty(bot);
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

export const setPMCBotConfig = (configServer: ConfigServer): void => {
  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);

  botConfig.pmc.isUsec = PERCENTAGE_USEC;
  botConfig.pmc.chanceSameSideIsHostilePercent = 100;

  botConfig.pmc.types.assault = SCAV_TO_PMC_PERCENTAGE;
  botConfig.pmc.types.exUsec = ROGUE_TO_PMC_PERCENTAGE;
  botConfig.pmc.types.cursedAssault = 100;
  botConfig.pmc.types.pmcBot = 100;
};

export const tweakBots = (
  database: DatabaseServer,
  configServer: ConfigServer,
  isGrenadeAllowed: boolean
): void => {
  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
  botConfig.pmc.difficulty = "easy";

  const tables = database.getTables();

  BOT_TYPES.forEach((type) => {
    const bot = tables.bots.types[type];

    if (bot) {
      setBotDifficulty(bot, isGrenadeAllowed);
    }
  });
};
