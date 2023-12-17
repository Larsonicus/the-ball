import { isNumber } from "./isNumber";

export const hasPhysics = (
  object: Phaser.Types.Tilemaps.TiledObject,
): object is Required<Phaser.Types.Tilemaps.TiledObject> => {
  return (
    isNumber(object.x) ||
    isNumber(object.y) ||
    isNumber(object.height) ||
    isNumber(object.width)
  );
};
