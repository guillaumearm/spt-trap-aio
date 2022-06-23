import { Wave } from "@spt-aki/models/eft/common/ILocationBase";

export const factoryWaves = (): Wave[] => {
  const common = {
    "SpawnPoints": "BotZone",
    "BotPreset": "easy",
    "isPlayers": false,
  } as const;

  const scav = {
    "BotSide": "Savage",
    "WildSpawnType": "assault",
  } as const;

  const usec = {
    "BotSide": "Usec",
    "WildSpawnType": "usec",
  } as const;

  return [
    {
      "time_min": 30,
      "time_max": 60,
      "slots_min": 1,
      "slots_max": 2,
      ...scav,
    },
    {
      "time_min": 60,
      "time_max": 120,
      "slots_min": 1,
      "slots_max": 3,
      ...usec, // usec
    },
    {
      "time_min": 60,
      "time_max": 120,
      "slots_min": 1,
      "slots_max": 4,
      ...scav,
    },
    {
      "time_min": 150,
      "time_max": 200,
      "slots_min": 1,
      "slots_max": 3,
      ...usec, // usec
    },
    {
      "time_min": 210,
      "time_max": 300,
      "slots_min": 1,
      "slots_max": 3,
      ...scav,
    },
    {
      "time_min": 260,
      "time_max": 350,
      "slots_min": 0,
      "slots_max": 3,
      ...scav,
    },
    {
      "time_min": 350,
      "time_max": 410,
      "slots_min": 1,
      "slots_max": 3,
      ...usec, // usec
    },
    {
      "time_min": 410,
      "time_max": 500,
      "slots_min": 2,
      "slots_max": 3,
      ...scav,
    },
    {
      "time_min": 500,
      "time_max": 600,
      "slots_min": 1,
      "slots_max": 3,
      ...usec, // usec
    },
    {
      "time_min": 600,
      "time_max": 700,
      "slots_min": 1,
      "slots_max": 3,
      ...scav,
    },
    {
      "time_min": 1200,
      "time_max": 1500,
      "slots_min": 1,
      "slots_max": 3,
      ...scav,
    },
    {
      "time_min": 1500,
      "time_max": 1600,
      "slots_min": 1,
      "slots_max": 3,
      ...usec, // usec
    },
    {
      "time_min": 1600,
      "time_max": 1700,
      "slots_min": 0,
      "slots_max": 3,
      ...scav,
    }
  ].map((v, i) => ({
    ...v,
    ...common,
    number: i,
  }));
}
