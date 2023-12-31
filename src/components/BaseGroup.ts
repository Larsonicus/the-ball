import { hasPhysics } from "@/helpers";

export class BaseGroup<
  T extends Phaser.Physics.Arcade.Image | Phaser.Physics.Arcade.Sprite,
> extends Phaser.Physics.Arcade.Group {
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    layerName: string,
    createFromTile: (tile: Required<Phaser.Types.Tilemaps.TiledObject>) => T,
  ) {
    super(scene.physics.world, scene, {
      allowGravity: false,
      immovable: true,
    });

    const tiles = map.getObjectLayer(layerName)?.objects;

    if (!tiles) {
      throw new Error(`Objects for ${layerName} not found`);
    }

    tiles.forEach((tile) => {
      if (!hasPhysics(tile)) {
        throw new Error(`[${layerName}]: Tile must have physics properties`);
      }

      const object = createFromTile(tile);
      this.add(object);
    });
  }
}
