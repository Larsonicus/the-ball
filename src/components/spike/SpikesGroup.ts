import { ITouch } from "@/types";
import { Player } from "@/components";

import { BaseGroup } from "../BaseGroup";

import { Spike } from "./Spike";

export class SpikesGroup extends BaseGroup<Spike> {
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    collide: ITouch<Player>,
  ) {
    super(scene, map, "spikes", (tile) => new Spike(scene, tile, collide));
  }
}
