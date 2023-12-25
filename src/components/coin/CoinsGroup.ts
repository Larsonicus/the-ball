import { Player } from "@/components";
import { ITouch } from "@/types";

import { BaseGroup } from "../BaseGroup";

import { Coin } from "./Coin";

export class CoinsGroup extends BaseGroup<Coin> {
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    overlap: ITouch<Player>,
  ) {
    super(scene, map, "coins", (tile) => new Coin(scene, tile, overlap));
  }
}
