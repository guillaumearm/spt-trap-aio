import type { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import type { RouteAction } from "@spt-aki/di/Router";
import type { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import type { ITrader } from "@spt-aki/models/eft/common/tables/ITrader";
import type { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";

import { readFileSync } from "fs";
import path from "path";
import { TRAP_PROGRESSIVE_STASH_MOD_ID } from "./constants";

const packageJson = JSON.parse(
  readFileSync(path.join(__dirname, "../package.json"), "utf-8")
);

export const getModDisplayName = (withVersion = false): string => {
  if (withVersion) {
    return `${packageJson.displayName} v${packageJson.version}`;
  }
  return `${packageJson.displayName}`;
};

export const getItemTemplate = (
  tables: IDatabaseTables,
  id: string
): ITemplateItem => {
  const item = tables.templates.items[id];

  if (!item) {
    throw new Error(`Fatal: unknown item id '${id}'`);
  }

  return item;
};

export const getTrader = (tables: IDatabaseTables, id: string): ITrader => {
  const trader = tables.traders[id];

  if (!trader) {
    throw new Error(`Fatal: unknown trader id '${id}'`);
  }

  return trader;
};

export const forEachItems = (
  cb: (item: ITemplateItem, id: string) => void,
  database: DatabaseServer
): void => {
  const items = database.getTables().templates.items;

  for (const itemId in items) {
    cb(items[itemId], itemId);
  }
};

type StaticRouteCallback = (
  url: string,
  info: any,
  sessionId: string,
  output: string
) => void;

type StatitcRoutePeeker = {
  register: () => void;
  watchRoute: (url: string, cb: StaticRouteCallback) => void;
};

export const createStaticRoutePeeker = (
  staticRouter: StaticRouterModService
): StatitcRoutePeeker => {
  const routeActions: RouteAction[] = [];

  const watchRoute = (url: string, cb: StaticRouteCallback): void => {
    routeActions.push({
      url,
      action: (url, info, sessionId, output) => {
        cb(url, info, sessionId, output);
        return output;
      },
    });
  };

  const register = () => {
    staticRouter.registerStaticRouter(
      "StaticRoutePeekingAki",
      routeActions,
      "aki"
    );
  };

  return {
    register,
    watchRoute,
  };
};

export function noop(): void {}

const isModLoaded = (modLoader: PreAkiModLoader, modId: string): boolean => {
  const loadedModName = Object.keys(modLoader.imported).find(
    (modName) => modLoader.imported[modName].name === modId
  );

  return Boolean(loadedModName);
};

export const isProgressiveStashModLoaded = (
  modLoader: PreAkiModLoader
): boolean => {
  return isModLoaded(modLoader, TRAP_PROGRESSIVE_STASH_MOD_ID);
};
