import type { DependencyContainer } from "tsyringe";

import type { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";

import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { ConfigServer } from "@spt-aki/servers/ConfigServer";

import type { IAirdropConfig } from "@spt-aki/models/spt/config/IAirdropConfig";
import type { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import type { IInRaidConfig } from "@spt-aki/models/spt/config/IInRaidConfig";
import type { ILocationData } from "@spt-aki/models/spt/server/ILocations";

import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import type { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import type { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

import {
  AIRDROP_CHANCE,
  BOSS_ENABLED_BY_DEFAULT,
  BOTS_GRENADE_ALLOWED,
  CASES_IN_BACKPACKS,
  CONSTRUCTION_TIME,
  CONVERT_BOTS_TO_PMC,
  DEBUG,
  DUMB_AI,
  EASY_BOTS,
  GLOBAL_CHANCE_MODIFIER,
  HOLSTER_ADDITIONAL_ITEMS,
  INSURANCE_TIME,
  ITEMS_FIXED_WEIGHTS,
  ITEMS_WEIGHT_MULTIPLIER,
  KAPPA_EXTRA_SIZE,
  KEYTOOL_HEIGHT,
  KEYTOOL_WIDTH,
  MAGDRILL_SPEED_MULTIPLIER,
  MIN_DURABILITY_FOR_SALE,
  PRODUCTION_TIME,
  RAID_TIME,
  SAVAGE_COOLDOWN,
  SECURE_CONTAINER_HEIGHT,
  SECURE_CONTAINER_WIDTH,
  SPAWN_ALL_BOTS_AT_START,
  STASH_SIZE,
  STIMULANT_USES,
  WAVES_ADDITIONAL_BOTS_PER_MAP,
} from "./config/config";

import {
  forEachItems,
  getItemTemplate,
  getModDisplayName,
  getTrader,
  isProgressiveStashModLoaded,
  noop,
} from "./utils";
import { setPMCBotConfig, tweakBots, tweakWaves } from "./bots/ai";
import { tweakAmmoItemColors } from "./ammo-item-colors";
import { tweakStashSize } from "./stash";
import { isKeyId, tweakItemInfiniteDurability } from "./keys";
import { tweakSecureContainers } from "./secure-containers";
import {
  BACKPACK_ID,
  BLACKLIST_MAPS,
  CASES,
  DEFAULT_INVENTORY_ID,
  HIDEOUT_AREA_WATER_COLLECTOR,
  KEYTOOL_ID,
  MORPHINE_ID,
  PHYSICAL_BITCOIN_ID,
  POCKET_ID,
  PRAPOR_ID,
  STIMULANT_ID,
  THERAPIST_ID,
  WATER_FILTER_ID,
} from "./constants";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";

class Mod implements IPreAkiLoadMod, IPostAkiLoadMod {
  private logger: ILogger;
  private debug: (data: string) => void;

  private tweakAmmoItemColors(database: DatabaseServer) {
    const tables = database.getTables();
    const nbItemUpdated = tweakAmmoItemColors(tables);

    this.debug(`Tweaked colors for ${nbItemUpdated} ammo items`);
  }

  private increaseAirdropChances(configServer: ConfigServer) {
    const airdropConfig = configServer.getConfig<IAirdropConfig>(
      "aki-airdrop" as ConfigTypes.AIRDROP
    );
    airdropConfig.airdropChancePercent = AIRDROP_CHANCE;

    this.debug(`Changed airdrop chance: ${JSON.stringify(AIRDROP_CHANCE)}`);
  }

  private tweakBots(database: DatabaseServer, configServer: ConfigServer) {
    if (CONVERT_BOTS_TO_PMC) {
      setPMCBotConfig(configServer);
      this.debug(`More PMCs added`);
    }

    tweakBots(database, configServer, BOTS_GRENADE_ALLOWED);

    if (EASY_BOTS) {
      this.debug(`Tweaked bot difficulty to 'easy'`);
    }

    if (DUMB_AI) {
      this.debug(`Tweaked bot logic to make them dumb`);
    }

    const messages = tweakWaves(
      database,
      WAVES_ADDITIONAL_BOTS_PER_MAP,
      SPAWN_ALL_BOTS_AT_START
    );

    messages.forEach((msg) => {
      this.debug(msg);
    });
  }

  private tweakSavageCooldown(database: DatabaseServer, value: number) {
    const tables = database.getTables();
    tables.globals.config.SavagePlayCooldown = value;

    this.debug(
      `Tweaked savage cooldown to ${value} second${value > 1 ? "s" : ""}`
    );

    this.logger.debug("Test");
  }

  private tweakStashSize(
    database: DatabaseServer,
    modLoader: PreAkiModLoader,
    value: number | undefined
  ) {
    if (isProgressiveStashModLoaded(modLoader)) {
      this.debug(`Trap's Progressive Stash found: stash size not tweaked`);
      return;
    }

    if (value) {
      tweakStashSize(database, value);
      this.debug(`Tweaked stash size to 10x${value}`);
    }
  }

  private tweakGlobalLootChanceModifier(
    database: DatabaseServer,
    globalLootChanceModifier: number
  ) {
    const tables = database.getTables();
    tables.globals.config.GlobalLootChanceModifier =
      tables.globals.config.GlobalLootChanceModifier * globalLootChanceModifier;

    const locations = tables.locations;

    for (const mapName in locations) {
      if (!BLACKLIST_MAPS.includes(mapName)) {
        const location: ILocationData = locations[mapName];

        location.base.GlobalLootChanceModifier = globalLootChanceModifier;

        if (location.looseLoot) {
          const spawnCount = location.looseLoot.spawnpointCount;

          spawnCount.mean = spawnCount.mean * globalLootChanceModifier;
          spawnCount.std = spawnCount.std * globalLootChanceModifier;
        }
      }
    }

    this.debug(
      `GlobalLootChanceModifier changed to '${globalLootChanceModifier}'`
    );
  }

  private tweakMagdrillSpeed(
    database: DatabaseServer,
    speedMultiplier: number
  ): void {
    const tables = database.getTables();
    const config = tables.globals.config;

    config.BaseLoadTime = config.BaseLoadTime * speedMultiplier;
    config.BaseUnloadTime = config.BaseUnloadTime * speedMultiplier;

    this.debug(`Mag drills speed divised by '${1 / speedMultiplier}'`);
  }

  private tweakKeytoolSize(
    database: DatabaseServer,
    horizontalValue: number,
    verticalValue: number
  ): void {
    const tables = database.getTables();
    const item = getItemTemplate(tables, KEYTOOL_ID);
    const props = item._props.Grids[0]._props;

    props.cellsH = horizontalValue;
    props.cellsV = verticalValue;

    this.debug(`Keytool size changed to '${horizontalValue}x${verticalValue}'`);
  }

  private tweakSecureContainers(
    database: DatabaseServer,
    modLoader: PreAkiModLoader
  ) {
    if (isProgressiveStashModLoaded(modLoader)) {
      this.debug(
        `Trap's Progressive Stash found: secure containers not tweaked`
      );
      return;
    }

    tweakSecureContainers(
      database,
      SECURE_CONTAINER_WIDTH,
      SECURE_CONTAINER_HEIGHT,
      KAPPA_EXTRA_SIZE
    );

    this.debug(
      `Tweaked gamma container to ${SECURE_CONTAINER_WIDTH}x${SECURE_CONTAINER_HEIGHT}`
    );
    this.debug(
      `Tweaked kappa container to ${SECURE_CONTAINER_WIDTH}x${
        SECURE_CONTAINER_HEIGHT + KAPPA_EXTRA_SIZE
      }`
    );
  }

  private tweakItems(database: DatabaseServer) {
    let keysCounter = 0;
    let examinedCounter = 0;
    let stimulantCounter = 0;

    forEachItems((item) => {
      const isKeyItem = isKeyId(item);
      const isStimulant =
        item._parent === STIMULANT_ID || item._id === MORPHINE_ID;

      if (isKeyItem) {
        tweakItemInfiniteDurability(item);
        keysCounter = keysCounter + 1;
      } else {
        item._props.ExaminedByDefault = true;
        examinedCounter = examinedCounter + 1;
      }

      if (isStimulant) {
        item._props.MaxHpResource = STIMULANT_USES;
        stimulantCounter = stimulantCounter + 1;
      }
    }, database);

    this.debug(`Set infinite durability for ${keysCounter} keys`);
    this.debug(`Set examined by default for ${examinedCounter} items`);
    this.debug(
      `Set ${STIMULANT_USES} uses for ${stimulantCounter} stimulant items`
    );
  }

  // raidTime is in minutes
  private tweakRaidTime(database: DatabaseServer, raidTime: number): void {
    const locations = database.getTables().locations;
    let nMaps = 0;

    for (const mapName in locations) {
      if (!BLACKLIST_MAPS.includes(mapName)) {
        const location: ILocationData = locations[mapName];

        location.base.exit_access_time = raidTime;
        location.base.EscapeTimeLimit = raidTime;

        nMaps = nMaps + 1;
      }
    }

    this.debug(`Extended raid time (${raidTime / 60} hours) for ${nMaps} maps`);
  }

  private tweakInsuranceTime(
    database: DatabaseServer,
    insuranceTime: number
  ): void {
    const tables = database.getTables();

    const prapor = getTrader(tables, PRAPOR_ID);
    prapor.base.insurance.min_return_hour = insuranceTime;
    prapor.base.insurance.max_return_hour = insuranceTime;

    const therapist = getTrader(tables, THERAPIST_ID);
    therapist.base.insurance.min_return_hour = insuranceTime;
    therapist.base.insurance.max_return_hour = insuranceTime;

    this.debug(
      `Insurance time updated to ${insuranceTime} hour${
        insuranceTime > 1 ? "s" : ""
      } for prapor and therapist`
    );
  }

  private tweakHideoutConstructions(
    database: DatabaseServer,
    constructionTime: number
  ): void {
    const areas = database.getTables().hideout.areas;

    areas.forEach((area) => {
      const isWaterCollector = area.type === HIDEOUT_AREA_WATER_COLLECTOR;

      for (const stageId in area.stages) {
        const stage = area.stages[stageId];
        // 1 tweak construction time
        stage.constructionTime = constructionTime;

        // workaround for water collector t3 issue (https://hub.sp-tarkov.com/files/file/619-trap-s-aio/#comments/comment9238)
        if (isWaterCollector && constructionTime < 1) {
          stage.constructionTime = 1;
        }

        // 2. fix loyalty level to 1
        stage.requirements.forEach((req) => {
          req.loyaltyLevel = 1;
        });
      }
    });

    this.debug(
      `Changed construction time to ${constructionTime} second${
        constructionTime > 1 ? "s" : ""
      }`
    );
    this.debug(`Fixed royalty level requirement to 1 for all constructions`);
  }

  private tweakHideoutProductions(
    database: DatabaseServer,
    productionTime: number
  ): void {
    const hideout = database.getTables().hideout;

    hideout.production.forEach((production) => {
      if (production.endProduct !== PHYSICAL_BITCOIN_ID) {
        production.productionTime = productionTime;
      }

      // workaround for water collector t3 issue (https://hub.sp-tarkov.com/files/file/619-trap-s-aio/#comments/comment9238)
      if (production.endProduct === WATER_FILTER_ID && productionTime < 0) {
        production.productionTime = 1;
      }
    });

    this.debug(
      `Changed production time to ${productionTime} second${
        productionTime > 1 ? "s" : ""
      }`
    );
  }

  private tweakFleaMarket(
    database: DatabaseServer,
    configServer: ConfigServer
  ): void {
    const config = configServer.getConfig<IRagfairConfig>(
      "aki-ragfair" as ConfigTypes.RAGFAIR
    );

    // 1. disable bsg blacklist
    config.dynamic.blacklist.enableBsgList = false;

    // 2. add items sellable on the flea
    forEachItems((item) => {
      if (item._type === "Item" && !item._props.CanSellOnRagfair) {
        item._props.CanSellOnRagfair = true;
      }
    }, database);

    // 3. no durability required to sell an item
    config.dynamic.condition.min = 0.01;
    config.dynamic.condition.max = 1.0;

    // 4. instant sell offers
    config.sell.chance.base = 100;
    config.sell.time.min = 0;
    config.sell.time.max = 0;

    // 5. disable fees
    config.sell.fees = false;

    this.debug(
      `Tweaked flea market (disable bsg blacklist + instant sell + all items sellable without fees)`
    );
  }

  private tweakInRaidMenuSettings(configServer: ConfigServer): void {
    const config = configServer.getConfig<IInRaidConfig>(
      "aki-inraid" as ConfigTypes.IN_RAID
    );
    const menu = config.raidMenuSettings;

    menu.aiDifficulty = "Easy";
    menu.bossEnabled = BOSS_ENABLED_BY_DEFAULT;
    menu.aiAmount = "Medium";

    this.debug(
      `Tweaked InRaid menu settings (aiDifficulty=${menu.aiDifficulty}, bossEnabled=${menu.bossEnabled}, aiAmount=${menu.aiAmount})`
    );
  }

  private tweakItemsWeight(db: DatabaseServer, weightMultiplier: number): void {
    let itemCounter = 0;

    forEachItems((item) => {
      if (
        item._type !== "Node" &&
        item._type !== undefined &&
        item._parent !== POCKET_ID &&
        item._id !== POCKET_ID
      ) {
        if (item._props.Weight !== undefined) {
          item._props.Weight = item._props.Weight * weightMultiplier;
          itemCounter = itemCounter + 1;
        }
      }
    }, db);

    this.debug(
      `${itemCounter} items weight divised by ${1 / weightMultiplier}`
    );
  }

  private tweakItemsFixedWeight(
    db: DatabaseServer,
    itemsFixedWeights: Record<string, number>
  ) {
    const items = db.getTables().templates.items;

    Object.keys(itemsFixedWeights).forEach((itemId) => {
      const item = items[itemId];
      if (item) {
        const weight = itemsFixedWeights[itemId];
        item._props.Weight = weight;

        this.debug(`changed '${item._name}' weight to ${weight}`);
      }
    });
  }

  private tweakBackpacksFilters(db: DatabaseServer): void {
    if (CASES_IN_BACKPACKS) {
      let itemCounter = 0;

      const items = db.getTables().templates.items;

      Object.keys(items).forEach((itemId) => {
        const item = items[itemId];

        if (item && item._parent === BACKPACK_ID) {
          item._props.Grids[0]._props.filters.forEach((filter) => {
            filter.ExcludedFilter = filter.ExcludedFilter.filter(
              (id) => !CASES[id]
            );
          });
          itemCounter = itemCounter + 1;
        }
      });

      this.debug(`${itemCounter} backpack items removed filters`);
    }
  }

  private tweakHolster(db: DatabaseServer): void {
    if (HOLSTER_ADDITIONAL_ITEMS && HOLSTER_ADDITIONAL_ITEMS.length > 0) {
      const tables = db.getTables();
      const defaultInventory = tables.templates.items[DEFAULT_INVENTORY_ID];

      const holsterSlot = defaultInventory._props.Slots.find(
        (slot) => slot._name === "Holster"
      );

      HOLSTER_ADDITIONAL_ITEMS.forEach((itemId) => {
        holsterSlot._props.filters[0].Filter.push(itemId);
      });

      this.debug(`${HOLSTER_ADDITIONAL_ITEMS.length} items allowed in Holster`);
    }
  }

  private tweakDurability(
    configServer: ConfigServer,
    MIN_DURABILITY_FOR_SALE: number
  ): void {
    const config = configServer.getConfig<ITraderConfig>(
      "aki-trader" as ConfigTypes.TRADER
    );

    if (config.minDurabilityForSale !== MIN_DURABILITY_FOR_SALE) {
      config.minDurabilityForSale = MIN_DURABILITY_FOR_SALE;
      this.debug(
        `traders config 'minDurabilityForScale' set to ${MIN_DURABILITY_FOR_SALE}`
      );
    }
  }

  public preAkiLoad(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>("WinstonLogger");
    this.debug = DEBUG
      ? (data: string) => this.logger.debug(`Trap's AIO: ${data}`, true)
      : noop;

    if (DEBUG) {
      this.debug("debug mode enabled");
    }

    this.logger.info(`===> Loading ${getModDisplayName(true)}`);
  }

  public postAkiLoad(container: DependencyContainer): void {
    const database = container.resolve<DatabaseServer>("DatabaseServer");
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const modLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");

    this.tweakItems(database);
    this.tweakAmmoItemColors(database);
    this.increaseAirdropChances(configServer);
    this.tweakBots(database, configServer);
    this.tweakGlobalLootChanceModifier(database, GLOBAL_CHANCE_MODIFIER);
    this.tweakSavageCooldown(database, SAVAGE_COOLDOWN);
    this.tweakStashSize(database, modLoader, STASH_SIZE);
    this.tweakMagdrillSpeed(database, MAGDRILL_SPEED_MULTIPLIER);
    this.tweakKeytoolSize(database, KEYTOOL_WIDTH, KEYTOOL_HEIGHT);
    this.tweakSecureContainers(database, modLoader);
    this.tweakRaidTime(database, RAID_TIME);
    this.tweakInsuranceTime(database, INSURANCE_TIME);
    this.tweakHideoutProductions(database, PRODUCTION_TIME);
    this.tweakHideoutConstructions(database, CONSTRUCTION_TIME);
    this.tweakFleaMarket(database, configServer);
    this.tweakInRaidMenuSettings(configServer);
    this.tweakItemsWeight(database, ITEMS_WEIGHT_MULTIPLIER);
    this.tweakItemsFixedWeight(database, ITEMS_FIXED_WEIGHTS);
    this.tweakBackpacksFilters(database);
    this.tweakHolster(database);
    this.tweakDurability(configServer, MIN_DURABILITY_FOR_SALE);

    this.logger.success(`===> Successfully loaded ${getModDisplayName(true)}`);
  }
}

module.exports = { mod: new Mod() };
