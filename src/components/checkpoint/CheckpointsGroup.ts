import { ITouch } from "@/types";
import { Player } from "@/components";

import { BaseGroup } from "../BaseGroup";

import { Checkpoint } from "./Checkpoint";

export class CheckpointsGroup extends BaseGroup<Checkpoint> {
  private _lastCheckpoint: Checkpoint | null = null;
  public get lastCheckpoint(): Checkpoint | null {
    return this._lastCheckpoint;
  }

  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    overlap: ITouch<Player>,
  ) {
    super(
      scene,
      map,
      "checkPoints",
      (tile) =>
        new Checkpoint(scene, tile, {
          object: overlap.object,
          callback: (checkPoint) => {
            this.setCheckpoint(checkPoint);
            overlap.callback?.();
          },
        }),
    );
  }

  private setCheckpoint(checkpoint: Checkpoint): void {
    this._lastCheckpoint = checkpoint;
  }
}
