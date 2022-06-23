import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";

const GENERIC_AMMO_ID = '5485a8684bdc2da71d8b4567';

export const tweakAmmoItemColors = (tables: IDatabaseTables): number => {
  const items = tables.templates.items;
  let itemCounter = 0;

  for (const i in items) {
    const item = items[i]

    //set baground colour of ammo depending on pen
    if (item._parent === GENERIC_AMMO_ID) {
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
      itemCounter = itemCounter + 1;
    }
  }

  return itemCounter;
}