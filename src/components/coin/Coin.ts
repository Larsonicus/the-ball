import { ANIMATION_KEYS, ENTITY_SPRITE_KEYS, SOUND_KEYS } from "@/constants";
import { Player } from "@/components";
import { ITouch } from "@/types";

export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    overlap: ITouch<Player>,
  ) {
    super(scene, x, y, ENTITY_SPRITE_KEYS.COIN);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0, 0.5);

    this.setSize(width * 0.5, height * 0.5);
    this.setOffset(width * 0.5 - width * 0.25, height * 0.5 - height * 0.25);

    this.anims.create({
      key: ANIMATION_KEYS.COIN_SPIN,
      frames: this.anims.generateFrameNumbers(ENTITY_SPRITE_KEYS.COIN, {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.play(ANIMATION_KEYS.COIN_SPIN, true);

    scene.physics.add.overlap(overlap.object, this, () => {
      overlap.callback?.();

      scene.sound.play(SOUND_KEYS.COIN, { volume: 0.5 });
      this.destroy();
    });
  }
}
