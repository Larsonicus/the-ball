import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  DEPTH,
  FONT_KEY,
  SOUND_KEYS,
  TILE_SIZE,
} from "@/constants";
import { isNumber } from "@/helpers";
import { ITouch } from "@/types";
import { Player } from "@/components";

export class Finish extends Phaser.GameObjects.Rectangle {
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    overlap: ITouch<Player>,
  ) {
    const layer = "finishPoint";
    const finishName = "finish";

    const tile = map.findObject(layer, (finish) => finish.name === finishName);

    if (!tile || !isNumber(tile.x) || !isNumber(tile.y)) {
      throw new Error("Finish not found");
    }

    const finishSize = TILE_SIZE * 2;

    super(scene, tile.x, tile.y, finishSize, finishSize);

    this.setOrigin(0, 1);
    scene.physics.add.existing(this, true);

    scene.physics.add.overlap(overlap.object, this, () => {
      this.destroy();

      scene.cameras.main.fadeOut();
      scene.cameras.main.once("camerafadeoutcomplete", () => {
        scene.add
          .rectangle(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT, 0x000000)
          .setScale(10)
          .setScrollFactor(0)
          .setDepth(DEPTH.FINISH);

        scene.add
          .bitmapText(
            DEFAULT_WIDTH * 0.5,
            DEFAULT_HEIGHT * 0.5,
            FONT_KEY,
            "You win!",
            20,
          )
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(DEPTH.FINISH);

        scene.cameras.main.fadeIn();
      });

      overlap.object.disableKeys();

      scene.sound.stopAll();
      scene.sound.play(SOUND_KEYS.WIN, { volume: 0.2 });

      overlap.callback?.();
    });
  }
}
