import { isNumber } from "./isNumber";

export const findSpawnpoint = (map: Phaser.Tilemaps.Tilemap) => {
  const layer = "spawn";
  const spawnName = "spawn";

  const spawnpoint = map.findObject(layer, (spawn) => spawn.name === spawnName);

  if (!spawnpoint || !isNumber(spawnpoint.x) || !isNumber(spawnpoint.y)) {
    throw new Error("Spawn point not found");
  }

  return spawnpoint as Required<typeof spawnpoint>;
};
