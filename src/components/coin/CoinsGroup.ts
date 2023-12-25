import { Player } from "@/components";
import { hasPhysics } from "@/helpers";
import { IOverlap } from "@/types";

import { Coin } from "./Coin";

export class CoinsGroup extends Phaser.Physics.Arcade.Group {
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    overlap: IOverlap<Player>,
  ) {
    super(scene.physics.world, scene, {
      allowGravity: false,
      immovable: true,
    });

    const layerName = "coins";

    const tiles = map.getObjectLayer(layerName)?.objects;

    if (!tiles) {
      throw new Error(`Objects for ${layerName} not found`);
    }

    tiles.forEach((tile) => {
      if (!hasPhysics(tile)) {
        throw new Error("Coin physics not found");
      }

      const x = tile.x;
      const y = tile.y - tile.height / 2;

      const coin = new Coin(scene, x, y, tile.width, tile.height, overlap);
      this.add(coin);
    });
  }
}
