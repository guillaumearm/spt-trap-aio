import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

import { getItemTemplate } from "./utils";

const EDITIONS = {
  STANDARD: "566abbc34bdc2d92178b4576", // Standard stash (default to 10x28)
  "LEFT BEHIND": "5811ce572459770cba1a34ea", // Left Behind stash (default to 10x38)
  "PREPARE FOR ESCAPE": "5811ce662459770f6f490f32", // Prepare for escape stash (default to 10x48)
  "EDGE OF DARKNESS": "5811ce772459770e9e5f9532", // Edge of darkness stash (default to 10x68)
};

export const tweakStashSize = (
  database: DatabaseServer,
  stashSize: number
): void => {
  const tables = database.getTables();

  Object.values(EDITIONS).forEach((id) => {
    const item = getItemTemplate(tables, id);
    item._props.Grids[0]._props.cellsV = stashSize;
  });
};
