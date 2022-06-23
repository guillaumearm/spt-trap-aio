import { DependencyContainer } from "tsyringe";

import { IMod } from "@spt-aki/models/external/mod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

import { getModDisplayName } from "./utils";

class Mod implements IMod {
  private logger: ILogger;

  private setAmmoItemColors(container: DependencyContainer) {
    const database = container.resolve<DatabaseServer>("DatabaseServer");
    const tables = database.getTables();

    const items = tables.templates.items;

    for (const i in items) {
      const item = items[i]

      //set baground colour of ammo depending on pen
      if (item._parent === "5485a8684bdc2da71d8b4567") {
        const pen = item._props.PenetrationPower
        let color = "grey"

        if (pen > 60) {
          color = "red";
        } else if (pen > 50) {
          color = "yellow";
        } else if (pen > 40) {
          color = 'violet';
        } else if (pen > 30) {
          color = 'blue';
        } else if (pen > 20) {
          color = 'green'
        }

        item._props.BackgroundColor = color
      }
    }
  }

  public load(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>("WinstonLogger");
    this.logger.info(`=> Loading ${getModDisplayName(true)} ...`);
  }

  public delayedLoad(container: DependencyContainer): void {
    this.setAmmoItemColors(container);
    this.logger.success(`=> Successfully loaded ${getModDisplayName(true)}`);
  }
}

module.exports = { mod: new Mod() }