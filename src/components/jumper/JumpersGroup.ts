import { ITouch } from "@/types";
import { Player } from "@/components";

import { BaseGroup } from "../BaseGroup";

import { Jumper } from "./Jumper";

export class JumpersGroup extends BaseGroup<Jumper> {
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    overlap: ITouch<Player>,
  ) {
    super(scene, map, "jumpers", (tile) => new Jumper(scene, tile, overlap));
  }
}
