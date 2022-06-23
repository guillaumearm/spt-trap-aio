import { DependencyContainer } from "tsyringe";

import { IMod } from "@spt-aki/models/external/mod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IAirdropConfig } from "@spt-aki/models/spt/config/IAirdropConfig";
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import { IInRaidConfig } from "@spt-aki/models/spt/config/IInRaidConfig";
import { ILocationData } from "@spt-aki/models/spt/server/ILocations";

import {
  AIRDROP_CHANCE,
  BLACKLIST_MAPS,
  BOTS_GRENADE_ALLOWED,
  CONSTRUCTION_TIME,
  GLOBAL_CHANCE_MODIFIER,
  INSURANCE_TIME,
  KAPPA_EXTRA_SIZE,
  KEYTOOL_HEIGHT,
  KEYTOOL_ID,
  KEYTOOL_WIDTH,
  MAGDRILL_SPEED_MULTIPLIER,
  PHYSICAL_BITCOIN_ID,
  PRAPOR_ID,
  PRODUCTION_TIME,
  RAID_TIME,
  SAVAGE_COOLDOWN,
  SECURE_CONTAINER_HEIGHT,
  SECURE_CONTAINER_WIDTH,
  STASH_SIZE,
  STIMULANT_ID,
  STIMULANT_USES,
  THERAPIST_ID,
} from "./config";

import { forEachItems, getItemTemplate, getModDisplayName, getTrader } from "./utils";
import { tweakBots } from "./bots/ai";
import { tweakAmmoItemColors } from "./ammo-item-colors";
import { tweakStashSize } from "./stash";
import { isKeyId, tweakItemInfiniteDurability } from "./keys";
import { tweakSecureContainers } from "./secure-containers";
import { tweakBotWaves } from "./bots/waves";

class Mod implements IMod {
  private logger: ILogger;

  private tweakAmmoItemColors(database: DatabaseServer) {
    const tables = database.getTables();
    tweakAmmoItemColors(tables);

    this.logger.success(`=> Tweaked ammo item colors`);
  }

  private increaseAirdropChances(configServer: ConfigServer) {
    const airdropConfig = configServer.getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);
    airdropConfig.airdropChancePercent = AIRDROP_CHANCE;

    this.logger.success(`=> Changed airdrop chance`);
  }

  private tweakBots(database: DatabaseServer, configServer: ConfigServer) {
    tweakBots(database, configServer, BOTS_GRENADE_ALLOWED);

    this.logger.success(`=> Tweaked bot difficulty to 'easy'`);
  }

  private tweakSavageCooldown(database: DatabaseServer, value: number) {
    const tables = database.getTables();
    tables.globals.config.SavagePlayCooldown = value;

    this.logger.success(`=> Tweaked savage cooldown to '${value}'`);
  }

  private tweakStashSize(database: DatabaseServer, value: number) {
    tweakStashSize(database, value);

    this.logger.success(`=> Tweaked stash size to '${value}'`);
  }

  private tweakGlobalLootChanceModifier(database: DatabaseServer, globalLootChanceModifier: number) {
    const tables = database.getTables();
    tables.globals.config.GlobalLootChanceModifier = globalLootChanceModifier;

    const locations = tables.locations;

    for (const mapName in locations) {
      if (!BLACKLIST_MAPS.includes(mapName)) {
        const location: ILocationData = locations[mapName];

        location.base.GlobalLootChanceModifier = globalLootChanceModifier;
        location.base.escape_time_limit = globalLootChanceModifier;
      }
    }

    this.logger.success(`=> GlobalLootChanceModifier changed to '${globalLootChanceModifier}'`);
  }

  private tweakMagdrillSpeed(database: DatabaseServer, speedMultiplier: number): void {
    const tables = database.getTables();
    const config = tables.globals.config;

    config.BaseLoadTime = config.BaseLoadTime * speedMultiplier;
    config.BaseUnloadTime = config.BaseUnloadTime * speedMultiplier;
    // const magdrills = tables.globals.config.SkillsSettings.MagDrills;

    // magdrills.MagazineCheckAction = magdrills.MagazineCheckAction * speedMultiplier;
    // magdrills.RaidLoadedAmmoAction = magdrills.RaidLoadedAmmoAction * speedMultiplier;
    // magdrills.RaidUnloadedAmmoAction = magdrills.RaidUnloadedAmmoAction * speedMultiplier;

    this.logger.success(`=> Mag drills speed multiplied by '${speedMultiplier}'`);
  }

  private tweakKeytoolSize(database: DatabaseServer, horizontalValue: number, verticalValue: number): void {
    const tables = database.getTables()
    const item = getItemTemplate(tables, KEYTOOL_ID);
    const props = item._props.Grids[0]._props;

    props.cellsH = horizontalValue;
    props.cellsV = verticalValue;

    this.logger.success(`=> Keytool size changed to '${horizontalValue}x${verticalValue}`);
  }

  private tweakSecureContainers(database: DatabaseServer) {
    tweakSecureContainers(database, SECURE_CONTAINER_WIDTH, SECURE_CONTAINER_HEIGHT, KAPPA_EXTRA_SIZE);

    this.logger.success(`=> Tweaked gamma container to ${SECURE_CONTAINER_WIDTH}x${SECURE_CONTAINER_HEIGHT}`);
    this.logger.success(`=> Tweaked kappa container to ${SECURE_CONTAINER_WIDTH}x${SECURE_CONTAINER_HEIGHT + KAPPA_EXTRA_SIZE}`);
  }

  private tweakItem(item: ITemplateItem) {
    const isKeyItem = isKeyId(item._id);
    const isStimulant = item._id === STIMULANT_ID;

    if (isKeyItem) {
      tweakItemInfiniteDurability(item);
    } else {
      item._props.ExaminedByDefault = true;
    }

    if (isStimulant) {
      item._props.MaxHpResource = STIMULANT_USES;
    }
  }

  // raidTime is in minutes
  private tweakRaidTime(database: DatabaseServer, raidTime: number): void {
    const locations = database.getTables().locations;
    let nMaps = 0;

    for (const mapName in locations) {
      if (!BLACKLIST_MAPS.includes(mapName)) {
        const location: ILocationData = locations[mapName];

        location.base.exit_access_time = raidTime;
        location.base.escape_time_limit = raidTime;

        nMaps = nMaps + 1;
      }
    }

    this.logger.success(`=> Extended raid time (${raidTime / 60} hours) for ${nMaps} maps`);
  }

  private tweakInsuranceTime(database: DatabaseServer, insuranceTime: number): void {
    const tables = database.getTables();

    const prapor = getTrader(tables, PRAPOR_ID);
    prapor.base.insurance.min_return_hour = insuranceTime;
    prapor.base.insurance.max_return_hour = insuranceTime;

    const therapist = getTrader(tables, THERAPIST_ID);
    therapist.base.insurance.min_return_hour = insuranceTime;
    therapist.base.insurance.max_return_hour = insuranceTime;

    this.logger.success(`=> Insurance time updated to ${insuranceTime} minute(s) for prapor and therapist`);
  }

  private tweakHideoutConstructions(database: DatabaseServer, constructionTime: number): void {
    const areas = database.getTables().hideout.areas;


    areas.forEach(area => {
      for (const stageId in area.stages) {
        const stage = area.stages[stageId];
        // 1 tweak construction time
        stage.constructionTime = constructionTime;

        // 2. fix loyalty level to 1
        stage.requirements.forEach(req => {
          req.loyaltyLevel = 1;
        })

      }
    })

    this.logger.success(`=> Changed construction time to ${constructionTime} minutes`);
    this.logger.success(`=> Fixed royalty level requirement to 1 for all constructions`);
  }

  private tweakHideoutProductions(database: DatabaseServer, productionTime: number): void {
    const hideout = database.getTables().hideout;

    hideout.production.forEach(production => {
      if (production.endProduct !== PHYSICAL_BITCOIN_ID) {
        production.productionTime = productionTime;
      }
    });

    this.logger.success(`=> Changed production time to ${productionTime} minutes`);
  }

  private tweakFleaMarket(database: DatabaseServer, configServer: ConfigServer): void {
    const config = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

    // 1. disable bsg blacklist
    config.dynamic.blacklist.enableBsgList = false;

    // 2. add items sellable on the flea
    forEachItems(item => {
      if (item._type === 'Item' && !item._props.CanSellOnRagfair) {
        item._props.CanSellOnRagfair = true;
      }
    }, database);

    // 3. no durabuility required to sell an item
    config.dynamic.condition.min = 0.01;
    config.dynamic.condition.max = 1.00;

    // 4. instant sell offers
    config.sell.chance.base = 100
    config.sell.time.min = 0
    config.sell.time.max = 0

    // 5. disable fees
    config.sell.fees = false;

    this.logger.success(`=> Tweaked flea market (disable bsg blacklist + instant sell + all items sellable without fees)`);
  }

  private tweakInRaidMenuSettings(configServer: ConfigServer): void {
    const config = configServer.getConfig<IInRaidConfig>(ConfigTypes.IN_RAID);
    const menu = config.raidMenuSettings;

    menu.aiDifficulty = 'Easy';
    menu.bossEnabled = false;
    menu.aiAmount = "Medium";

    this.logger.success(`=> Tweaked InRaid menu settings (aiDifficulty=${menu.aiDifficulty}, bossEnabled=${menu.bossEnabled}, aiAmount=${menu.aiAmount})`);
  }

  private tweakBotWaves(db: DatabaseServer): void {
    const tweakedMaps = tweakBotWaves(db);
    this.logger.success(`=> Tweaked bot waves on maps '${tweakedMaps.join(', ')}'`);
  }

  public load(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>("WinstonLogger");
    this.logger.info(`===> Loading ${getModDisplayName(true)} ...`);
  }

  public delayedLoad(container: DependencyContainer): void {
    const database = container.resolve<DatabaseServer>("DatabaseServer");
    const configServer = container.resolve<ConfigServer>("ConfigServer");

    forEachItems(item => this.tweakItem(item), database);

    this.tweakAmmoItemColors(database);
    this.increaseAirdropChances(configServer);
    this.tweakBots(database, configServer);
    this.tweakBotWaves(database);
    this.tweakGlobalLootChanceModifier(database, GLOBAL_CHANCE_MODIFIER);
    this.tweakSavageCooldown(database, SAVAGE_COOLDOWN);
    this.tweakStashSize(database, STASH_SIZE);
    this.tweakMagdrillSpeed(database, MAGDRILL_SPEED_MULTIPLIER);
    this.tweakKeytoolSize(database, KEYTOOL_WIDTH, KEYTOOL_HEIGHT);
    this.tweakSecureContainers(database);
    this.tweakRaidTime(database, RAID_TIME);
    this.tweakInsuranceTime(database, INSURANCE_TIME);
    this.tweakHideoutProductions(database, PRODUCTION_TIME);
    this.tweakHideoutConstructions(database, CONSTRUCTION_TIME);
    this.tweakFleaMarket(database, configServer);
    this.tweakInRaidMenuSettings(configServer);

    this.logger.success(`===> Successfully loaded ${getModDisplayName(true)}`);
  }
}

module.exports = { mod: new Mod() }
