import { ANIMATION_KEYS, ENTITY_SPRITE_KEYS, SOUND_KEYS } from "@/constants";
import { Player } from "@/components";
import { IOverlap } from "@/types";

export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    overlap: IOverlap<Player>,
  ) {
    super(scene, x, y, ENTITY_SPRITE_KEYS.COIN);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0, 0.5);

    if (!this.body) {
      throw new Error("Coin body not found");
    }

    this.body.setSize(width * 0.5, height * 0.5);
    this.body.setOffset(
      width * 0.5 - width * 0.25,
      height * 0.5 - height * 0.25,
    );

    this.anims.play(ANIMATION_KEYS.COIN_SPIN, true);

    scene.physics.add.overlap(overlap.object, this, () => {
      overlap.callback();

      scene.sound.play(SOUND_KEYS.COIN, { volume: 0.5 });
      this.destroy();
    });
  }
}
