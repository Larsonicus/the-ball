import { ITouch } from "@/types";
import { Player } from "@/components";

import { Checkpoint } from "./Checkpoint";

export class CheckpointsGroup extends Phaser.Physics.Arcade.Group {
  private _lastCheckpoint: Checkpoint | null = null;
  public get lastCheckpoint(): Checkpoint | null {
    return this._lastCheckpoint;
  }

  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    overlap: ITouch<Player>,
  ) {
    super(scene.physics.world, scene, {
      allowGravity: false,
      immovable: true,
    });

    const layerName = "checkPoints";

    const tiles = map.getObjectLayer(layerName)?.objects;

    if (!tiles) {
      throw new Error(`Objects for ${layerName} not found`);
    }

    tiles.forEach((tile) => {
      const checkpoint = new Checkpoint(scene, tile, {
        object: overlap.object,
        callback: (checkPoint) => {
          this.setCheckpoint(checkPoint);
          overlap.callback?.();
        },
      });
      this.add(checkpoint);
    });
  }

  private setCheckpoint(checkpoint: Checkpoint): void {
    this._lastCheckpoint = checkpoint;
  }
}
