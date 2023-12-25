import { ITouch } from "@/types";
import { Player } from "@/components";

import { Jumper } from "./Jumper";

export class JumpersGroup extends Phaser.Physics.Arcade.Group {
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    overlap: ITouch<Player>,
  ) {
    super(scene.physics.world, scene, {
      allowGravity: false,
      immovable: true,
    });

    const layerName = "jumpers";

    const tiles = map.getObjectLayer(layerName)?.objects;

    if (!tiles) {
      throw new Error(`Objects for ${layerName} not found`);
    }

    tiles.forEach((tile) => {
      const jumper = new Jumper(scene, tile, overlap);
      this.add(jumper);
    });
  }
}
