import { DependencyContainer } from "tsyringe";
import { IMod } from "@spt-aki/models/external/mod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { getModDisplayName } from "./utils";

class Mod implements IMod {
  private logger: ILogger;

  public load(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>("WinstonLogger");
    this.logger.info(`=> Loading ${getModDisplayName(true)} ...`);
  }

  public delayedLoad(container: DependencyContainer): void {
    void container;
    this.logger.success(`=> Successfully loaded ${getModDisplayName(true)}`);
  }
}

module.exports = { mod: new Mod() }