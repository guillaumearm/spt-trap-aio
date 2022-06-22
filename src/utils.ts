import { readFileSync } from "fs";
import path from "path";

const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

export const getModDisplayName = (withVersion = false): string => {
  if (withVersion) {
    return `${packageJson.displayName} v${packageJson.version}`;
  }
  return `${packageJson.displayName}`;
}