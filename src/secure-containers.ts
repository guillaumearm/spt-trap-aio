import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

import { getItemTemplate } from "./utils";

const GAMMA_CONTAINER_ID = "5857a8bc2459772bad15db29";
const KAPPA_CONTAINER_ID = "5c093ca986f7740a1867ab12";

export const tweakSecureContainers = (
  database: DatabaseServer,
  width: number,
  height: number,
  kappaExtraSize: number
): void => {
  const tables = database.getTables();

  const gamma = getItemTemplate(tables, GAMMA_CONTAINER_ID);
  const kappa = getItemTemplate(tables, KAPPA_CONTAINER_ID);

  gamma._props.Grids[0]._props.cellsH = width;
  gamma._props.Grids[0]._props.cellsV = height;

  kappa._props.Grids[0]._props.cellsH = width;
  kappa._props.Grids[0]._props.cellsV = height + kappaExtraSize;
};
