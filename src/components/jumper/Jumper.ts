import { ITouch } from "@/types";
import { Player } from "../Player";
import { hasPhysics } from "@/helpers";
import { ENTITY_IMAGE_KEYS, SOUND_KEYS } from "@/constants";

export class Jumper extends Phaser.Physics.Arcade.Image {
  constructor(
    scene: Phaser.Scene,
    tile: Phaser.Types.Tilemaps.TiledObject,
    collide: ITouch<Player>,
  ) {
    if (!hasPhysics(tile)) {
      throw new Error("Jumper physics not found");
    }

    super(scene, tile.x, tile.y, ENTITY_IMAGE_KEYS.JUMPER);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0, 1);

    this.setSize(tile.width, tile.height * 0.5);
    this.setOffset(0, this.height * 0.5);

    scene.physics.add.collider(collide.object, this, () => {
      if (!(this.body?.touching.up && collide.object.body?.touching.down)) {
        return;
      }

      collide.object.setVelocityY(-550);

      this.setTexture(ENTITY_IMAGE_KEYS.JUMPER_ACTIVE);
      scene.sound.play(SOUND_KEYS.JUMPER, { volume: 0.2 });

      scene.time.addEvent({
        delay: 300,
        callback: () => {
          this.setTexture(ENTITY_IMAGE_KEYS.JUMPER);
        },
      });

      collide.callback?.();
    });
  }
}
