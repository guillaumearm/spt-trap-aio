import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
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