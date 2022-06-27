import { RouteAction } from "@spt-aki/di/Router";
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { ITrader } from "@spt-aki/models/eft/common/tables/ITrader";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { readFileSync } from "fs";
import path from "path";

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
