import { DependencyContainer } from "tsyringe";

import { IMod } from "@spt-aki/models/external/mod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { getItemTemplate, getModDisplayName } from "./utils";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IAirdropConfig } from "@spt-aki/models/spt/config/IAirdropConfig";
import { tweakBots } from "./bots";
import { tweakAmmoItemColors } from "./ammo-item-colors";
import { tweakStashSize } from "./stash";
import { tweakSecureContainers } from "./secure-containers";
import { AIRDROP_CHANCE, BOTS_GRENADE_ALLOWED, GLOBAL_CHANCE_MODIFIER, KAPPA_EXTRA_SIZE, KEYTOOL_HEIGHT, KEYTOOL_ID, KEYTOOL_WIDTH, MAGDRILL_SPEED, SAVAGE_COOLDOWN, SECURE_CONTAINER_HEIGHT, SECURE_CONTAINER_WIDTH, STASH_SIZE } from "./config";

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

    this.logger.success(`=> GlobalLootChanceModifier changed to '${globalLootChanceModifier}'`);
  }

  private tweakMagdrillSpeed(database: DatabaseServer, speedMultiplier: number): void {
    const tables = database.getTables();
    const magdrills = tables.globals.config.SkillsSettings.MagDrills;

    magdrills.MagazineCheckAction = magdrills.MagazineCheckAction * speedMultiplier;
    magdrills.RaidLoadedAmmoAction = magdrills.RaidLoadedAmmoAction * speedMultiplier;
    magdrills.RaidUnloadedAmmoAction = magdrills.RaidUnloadedAmmoAction * speedMultiplier;

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

  public load(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>("WinstonLogger");
    this.logger.info(`===> Loading ${getModDisplayName(true)} ...`);
  }

  public delayedLoad(container: DependencyContainer): void {
    const database = container.resolve<DatabaseServer>("DatabaseServer");
    const configServer = container.resolve<ConfigServer>("ConfigServer");

    this.tweakAmmoItemColors(database);
    this.increaseAirdropChances(configServer);
    this.tweakBots(database, configServer);
    this.tweakGlobalLootChanceModifier(database, GLOBAL_CHANCE_MODIFIER);
    this.tweakSavageCooldown(database, SAVAGE_COOLDOWN);
    this.tweakStashSize(database, STASH_SIZE);
    this.tweakMagdrillSpeed(database, MAGDRILL_SPEED);
    this.tweakKeytoolSize(database, KEYTOOL_WIDTH, KEYTOOL_HEIGHT);
    this.tweakSecureContainers(database);

    this.logger.success(`===> Successfully loaded ${getModDisplayName(true)}`);
  }
}

module.exports = { mod: new Mod() }


//TODO:
// all items examined (except for keys)
// extended-raid time
// change insurance time
// hideout production/construction time
// change stimulant use amount
// infinite key usage
