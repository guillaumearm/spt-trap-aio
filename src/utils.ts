import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { ITrader } from "@spt-aki/models/eft/common/tables/ITrader";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { readFileSync } from "fs";
import path from "path";

const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

export const getModDisplayName = (withVersion = false): string => {
  if (withVersion) {
    return `${packageJson.displayName} v${packageJson.version}`;
  }
  return `${packageJson.displayName}`;
}

export const getItemTemplate = (tables: IDatabaseTables, id: string): ITemplateItem => {
  const item = tables.templates.items[id];

  if (!item) {
    throw new Error(`Fatal: unknown item id '${id}'`)
  }

  return item;
}

export const getTrader = (tables: IDatabaseTables, id: string): ITrader => {
  const trader = tables.traders[id];

  if (!trader) {
    throw new Error(`Fatal: unknown trader id '${id}'`)
  }

  return trader;
}


export const forEachItems = (cb: (item: ITemplateItem) => void, database: DatabaseServer): void => {
  const items = database.getTables().templates.items;

  for (const itemId in items) {
    cb(items[itemId]);
  }
};