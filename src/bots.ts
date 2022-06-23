import { IBotType } from "@spt-aki/models/eft/common/tables/IBotType";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

const GRENADE_ALLOWED = false;

const setPMCDifficultyConfigToEasy = (configServer: ConfigServer): void => {
  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);

  botConfig.pmc.difficulty = 'easy';
};

const copyEasyDifficulty = (bot: IBotType): void => {
  const { easy, normal, hard, impossible } = bot.difficulty;

  normal.Core = easy.Core;
  normal.Hearing = easy.Hearing;
  normal.Shoot = easy.Shoot;
  normal.Aiming = easy.Aiming;

  hard.Core = easy.Core;
  hard.Hearing = easy.Hearing;
  hard.Shoot = easy.Shoot;
  hard.Aiming = easy.Aiming;

  impossible.Core = easy.Core;
  impossible.Hearing = easy.Hearing;
  impossible.Shoot = easy.Shoot;
  impossible.Aiming = easy.Aiming;
};

const setBotDifficulty = (bot: IBotType): void => {
  const core = bot.difficulty.easy.Core;
  const hearing = bot.difficulty.easy.Hearing;
  const shoot = bot.difficulty.easy.Shoot;
  const aiming = bot.difficulty.easy.Aiming;

  core.AccuratySpeed = 0.3; // >;
  core.canGrenade = GRENADE_ALLOWED;
  core.HearingSense = 1.05; // <
  core.VisibleAngle = 130; // <
  core.VisibleDistance = 110; // <
  core.WaitInCoverBetweenShotsSec = 1.5; // >

  shoot.MAX_RECOIL_PER_METER = 0.2; // >
  shoot.RECOIL_PER_METER = 0.1; // >
  shoot.RECOIL_TIME_NORMALIZE = 2; // >

  hearing.CLOSE_DIST = 10; // <
  hearing.FAR_DIST = 30; // <

  aiming.AIMING_TYPE = 5; // =
  aiming.ANY_PART_SHOOT_TIME = 30; // >
  aiming.BASE_HIT_AFFECTION_DELAY_SEC = 1.77 // >
  aiming.BASE_HIT_AFFECTION_MAX_ANG = 28 // >
  aiming.BASE_HIT_AFFECTION_MIN_ANG = 14 // >
  aiming.BETTER_PRECICING_COEF = 0.7 // <
  aiming.DAMAGE_PANIC_TIME = 15; // >
  aiming.MAX_AIMING_UPGRADE_BY_TIME = 0.85; // >
  aiming.MAX_AIM_TIME = 1.5; // >
  aiming.MAX_TIME_DISCARD_AIM_SEC = 3.2; // >
  aiming.MIN_TIME_DISCARD_AIM_SEC = 2.9; // >
  aiming.NEXT_SHOT_MISS_CHANCE_100 = 100; // >
  aiming.NEXT_SHOT_MISS_Y_OFFSET = 1; // >
  aiming.PANIC_TIME = 2; // >


  copyEasyDifficulty(bot);
}


const BOT_TYPES = [
  'assault',
  'bear',
  'usec',
  'exusec',
  'pmcbot',
  'sectantwarrior',
  'sectantpriest',
  'gifter',
  'cursedassault',
  'bossbully',
  'bossgluhar',
  'bosskilla',
  'bosskojaniy',
  'bosssanitar',
  'bosstagilla',
  'followergluharassault',
  'followergluharscout',
  'followergluharsecurity',
  'followergluharsnipe',
  'followerkojaniy',
  'followersanitar',
  'followertagilla',
  'bosstest',
  'followertest',
  'marksman'
] as const;

export const tweakBots = (database: DatabaseServer, configServer: ConfigServer): void => {
  setPMCDifficultyConfigToEasy(configServer);

  const tables = database.getTables();

  BOT_TYPES.forEach(type => {
    const bot = tables.bots.types[type];

    if (bot) {
      setBotDifficulty(bot);
    }
  })
}