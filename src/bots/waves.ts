import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { factoryWaves } from "./waves-factory";

export const tweakBotWaves = (db: DatabaseServer): string[] => {
  const tables = db.getTables();

  tables.locations.factory4_day.base.waves = factoryWaves();
  tables.locations.factory4_night.base.waves = factoryWaves();

  return [
    'factory4_day',
    'factory4_night',
  ];
}