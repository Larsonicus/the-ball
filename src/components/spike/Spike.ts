import { ENTITY_IMAGE_KEYS } from "@/constants";
import { Player } from "@/components";
import { ITouch } from "@/types";

export class Spike extends Phaser.Physics.Arcade.Image {
  constructor(
    scene: Phaser.Scene,
    tile: Required<Phaser.Types.Tilemaps.TiledObject>,
    collide: ITouch<Player>,
  ) {
    const x = tile.x;
    const y =
      tile.rotation === 180 ? tile.y + tile.height : tile.y - tile.height;

    super(scene, x, y, ENTITY_IMAGE_KEYS.SPIKE);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0);
    this.setAngle(tile.rotation);

    this.setSize(tile.width, tile.height - tile.height * 0.5);

    if (tile.rotation === 180) {
      this.setOffset(-tile.width, -tile.height);
    } else {
      this.setOffset(0, tile.height * 0.5);
    }

    scene.physics.add.collider(collide.object, this, () => {
      if (
        !(
          (collide.object.body?.touching.down && this.body?.touching.up) ||
          (collide.object.body?.touching.up && this.body?.touching.down)
        )
      ) {
        return;
      }

      collide.callback?.();
    });
  }
}
