import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

import {
  Player,
  Score,
  Map,
  CoinsGroup,
  SpikesGroup,
  JumpersGroup,
  CheckpointsGroup,
} from "@/components";
import { isNumber } from "@/helpers";
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  TILE_SIZE,
  ENTITY_SPRITE_KEYS,
  FONT_KEY,
  TILEMAP_KEYS,
  TILESET_KEYS,
  MUSIC_KEYS,
  SCENE_KEYS,
  SOUND_KEYS,
  ANIMATION_KEYS,
  PLUGIN_KEYS,
} from "@/constants";

export class MainScene extends Phaser.Scene {
  player: Player | null = null;

  constructor() {
    super({ key: SCENE_KEYS.MAIN });
  }

  preload() {
    this.load.scenePlugin(
      PLUGIN_KEYS.ANIMATED_TILES,
      AnimatedTiles,
      PLUGIN_KEYS.ANIMATED_TILES,
      SCENE_KEYS.MAIN,
    );

    this.anims.create({
      key: ANIMATION_KEYS.COIN_SPIN,
      frames: this.anims.generateFrameNumbers(ENTITY_SPRITE_KEYS.COIN, {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private createMap() {
    return new Map(
      this,
      {
        key: TILEMAP_KEYS.FIRST,
        layerId: "all",
      },
      {
        key: TILESET_KEYS.FIRST,
        name: "tiles_packed",
      },
    );
  }

  private initAnimatedTiles(map: Phaser.Tilemaps.Tilemap) {
    const { animatedTiles } = this.sys as typeof this.sys & {
      [PLUGIN_KEYS.ANIMATED_TILES]: AnimatedTiles;
    };
    animatedTiles.init(map);
  }

  create() {
    this.cameras.main.fadeIn();

    this.sound.play(MUSIC_KEYS.BACKGROUND, {
      loop: true,
      volume: 0.1,
      delay: 0.5,
    });

    const map = this.createMap();
    this.initAnimatedTiles(map.value);

    const score = new Score(this, 5, 6);

    const spawnPoint = map.value.findObject(
      "spawn",
      (spawn) => spawn.name === "spawn",
    );

    if (!spawnPoint || !isNumber(spawnPoint.x) || !isNumber(spawnPoint.y)) {
      throw new Error("Spawn point not found");
    }

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    const checkpoints = new CheckpointsGroup(this, map.value, {
      object: this.player,
    });

    new SpikesGroup(this, map.value, {
      object: this.player,
      callback: () =>
        this.player?.die(() => {
          this.player?.setPosition(
            checkpoints.lastCheckpoint?.x ?? spawnPoint.x,
            checkpoints.lastCheckpoint?.x ?? spawnPoint.y,
          );
        }),
    });

    new CoinsGroup(this, map.value, {
      object: this.player,
      callback: () => score.increment(),
    });

    new JumpersGroup(this, map.value, {
      object: this.player,
    });

    const finishPoint = map.value.findObject(
      "finishPoint",
      (finish) => finish.name === "finish",
    );

    if (!finishPoint || !isNumber(finishPoint.x) || !isNumber(finishPoint.y)) {
      throw new Error("Finish not found");
    }

    const finishSize = TILE_SIZE * 2;
    const finish = this.add.rectangle(
      finishPoint.x,
      finishPoint.y,
      finishSize,
      finishSize,
    );
    finish.setOrigin(0, 1);
    this.physics.add.existing(finish, true);

    map.value.setCollisionByProperty({ hasCollision: true });

    if (!this.input.keyboard) {
      throw new Error("Keyboard not found");
    }

    this.physics.add.overlap(this.player, finish, (_, finish) => {
      if (!(finish instanceof Phaser.GameObjects.Rectangle)) {
        throw new Error("Finish not found");
      }

      this.end(finish);
    });

    this.physics.add.collider(this.player, map.mapLayer);

    this.cameras.main.setBounds(
      map.mapLayer.x,
      map.mapLayer.y,
      map.mapLayer.width,
      map.mapLayer.height,
    );

    this.physics.world.setBounds(
      map.mapLayer.x,
      map.mapLayer.y,
      map.mapLayer.width,
      map.mapLayer.height,
    );

    this.cameras.main.startFollow(this.player);
  }

  private end(
    finish: (
      | Phaser.Tilemaps.Tile
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) &
      Phaser.GameObjects.Rectangle,
  ): void {
    finish.destroy();

    this.cameras.main.fadeOut();
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.add
        .rectangle(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT, 0x000000)
        .setScale(10)
        .setScrollFactor(0);

      this.add
        .bitmapText(
          DEFAULT_WIDTH * 0.5,
          DEFAULT_HEIGHT * 0.5,
          FONT_KEY,
          "You win!",
          20,
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1);

      this.cameras.main.fadeIn();
    });

    this.player?.disableKeys();

    this.sound.stopAll();
    this.sound.play(SOUND_KEYS.WIN, { volume: 0.2 });
  }

  update(): void {
    if (!this.player) {
      throw new Error("Player not found");
    }

    this.player.update();
  }
}
