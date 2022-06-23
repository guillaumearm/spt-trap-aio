import { DependencyContainer } from "tsyringe";

import { IMod } from "@spt-aki/models/external/mod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { getModDisplayName } from "./utils";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { AirdropChancePercent, IAirdropConfig } from "@spt-aki/models/spt/config/IAirdropConfig";
import { tweakBots } from "./bots";
import { tweakAmmoItemColors } from "./ammo-item-colors";


const AIRDROP_CHANCE: AirdropChancePercent = {
  reserve: 100,
  bigmap: 75,
  interchange: 75,
  lighthouse: 50,
  shoreline: 50,
  woods: 50
};

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

  private tweakBots(database, configServer: ConfigServer) {
    tweakBots(database, configServer);
    this.logger.success(`=> Changed pmc bot difficulty to 'easy'`);
  }

  public load(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>("WinstonLogger");
    this.logger.info(`=> Loading ${getModDisplayName(true)} ...`);
  }

  public delayedLoad(container: DependencyContainer): void {
    const database = container.resolve<DatabaseServer>("DatabaseServer");
    const configServer = container.resolve<ConfigServer>("ConfigServer");

    this.tweakAmmoItemColors(database);
    this.increaseAirdropChances(configServer);
    this.tweakBots(database, configServer);

    this.logger.success(`====> Successfully loaded ${getModDisplayName(true)}`);
  }
}

module.exports = { mod: new Mod() }

