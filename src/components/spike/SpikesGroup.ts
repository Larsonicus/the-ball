import { ITouch } from "@/types";
import { Player } from "@/components";

import { Spike } from "./Spike";

export class SpikesGroup extends Phaser.Physics.Arcade.Group {
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    collide: ITouch<Player>,
  ) {
    super(scene.physics.world, scene, {
      allowGravity: false,
      immovable: true,
    });

    const layerName = "spikes";

    const tiles = map.getObjectLayer(layerName)?.objects;

    if (!tiles) {
      throw new Error(`Objects for ${layerName} not found`);
    }

    tiles.forEach((tile) => {
      const spike = new Spike(scene, tile, collide);
      this.add(spike);
    });
  }
}
