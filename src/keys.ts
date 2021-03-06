import type { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";

export const KEY_IDS = [
  "543be5e94bdc2df1348b4568", // keys
  "5c99f98d86f7745c314214b3", // mechanical keys
  "5c164d2286f774194c5e69fa", // card keys
];

export const isKeyId = (item: ITemplateItem): boolean =>
  KEY_IDS.includes(item._parent);

// for keys only
export const tweakItemInfiniteDurability = (item: ITemplateItem): boolean => {
  if (isKeyId(item)) {
    item._props.MaximumNumberOfUsage = 0;
    return true;
  }

  return false;
};
