import { ENTITY_IMAGE_KEYS, SOUND_KEYS } from "@/constants";
import { ITouch } from "@/types";
import { Player } from "@/components";

export class Checkpoint extends Phaser.Physics.Arcade.Image {
  constructor(
    scene: Phaser.Scene,
    tile: Required<Phaser.Types.Tilemaps.TiledObject>,
    overlap: ITouch<Player, Checkpoint>,
  ) {
    super(scene, tile.x, tile.y, ENTITY_IMAGE_KEYS.CHECKPOINT);

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.setOrigin(0, 1);

    this.setSize(tile.width, tile.height * 0.5);
    this.setOffset(0, tile.height * 0.5);

    const dataPressedKey = "isPressed";
    scene.physics.add.overlap(overlap.object, this, () => {
      if (this.getData(dataPressedKey)) {
        return;
      }

      this.setTexture(ENTITY_IMAGE_KEYS.CHECKPOINT_PRESSED);

      this.scene.sound.play(SOUND_KEYS.CHECKPOINT, { volume: 0.5 });

      this.setData(dataPressedKey, true);

      overlap.callback?.(this);
    });
  }
}
