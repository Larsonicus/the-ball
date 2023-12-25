import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

import { Player, Score, Map, CoinsGroup, SpikesGroup } from "@/components";
import { isNumber, hasPhysics } from "@/helpers";
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  TILE_SIZE,
  ENTITY_IMAGE_KEYS,
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

  jumpers: Phaser.Physics.Arcade.Group | null = null;

  checkPoints: Phaser.Physics.Arcade.Group | null = null;
  checkPoint: { x: number; y: number } | null = null;
  private map: Map | null = null;

  constructor() {
    super({ key: SCENE_KEYS.MAIN });
  }

  private createGroup(): Phaser.Physics.Arcade.Group {
    return this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
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
    this.map = new Map(
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

    this.createMap();
    if (!this.map) {
      throw new Error("Map not found");
    }

    this.initAnimatedTiles(this.map.value);

    const score = new Score(this, 5, 6);

    const spawnPoint = this.map.value.findObject(
      "spawn",
      (spawn) => spawn.name === "spawn",
    );

    if (!spawnPoint || !isNumber(spawnPoint.x) || !isNumber(spawnPoint.y)) {
      throw new Error("Spawn point not found");
    }

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    new SpikesGroup(this, this.map.value, {
      object: this.player,
      callback: () =>
        this.player?.die(() => {
          this.player?.setPosition(
            this.checkPoint?.x ?? spawnPoint.x,
            this.checkPoint?.y ?? spawnPoint.y,
          );
        }),
    });

    new CoinsGroup(this, this.map.value, {
      object: this.player,
      callback: () => score.increment(),
    });

    this.jumpers = this.createGroup();
    this.checkPoints = this.createGroup();

    this.map.value
      .getObjectLayer("checkPoints")
      ?.objects.forEach((checkPoint) => {
        if (!hasPhysics(checkPoint)) {
          throw new Error("CheckPoint physics not found");
        }

        const checkPointSprite: Phaser.Physics.Arcade.Sprite = this.checkPoints
          ?.create(checkPoint.x, checkPoint.y, ENTITY_IMAGE_KEYS.CHECKPOINT)
          .setOrigin(0, 1);

        if (!checkPointSprite.body) {
          throw new Error("CheckPoint body not found");
        }

        checkPointSprite.body.setSize(
          checkPoint.width,
          checkPoint.height * 0.5,
        );
        checkPointSprite.body.setOffset(0, checkPoint.height * 0.5);
      });

    this.map.value.getObjectLayer("jumpers")?.objects.forEach((jumper) => {
      if (!hasPhysics(jumper)) {
        throw new Error("Jumper physics not found");
      }

      const jumperSprite: Phaser.Physics.Arcade.Sprite = this.jumpers
        ?.create(jumper.x, jumper.y, ENTITY_IMAGE_KEYS.JUMPER)
        .setOrigin(0, 1);

      if (!jumperSprite.body) {
        throw new Error("Jumper body not found");
      }

      jumperSprite.body.setSize(jumper.width, jumper.height * 0.5);
      jumperSprite.body.setOffset(0, jumper.height * 0.5);
    });

    const finishPoint = this.map.value.findObject(
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

    this.map.value.setCollisionByProperty({ hasCollision: true });

    if (!this.input.keyboard) {
      throw new Error("Keyboard not found");
    }

    this.physics.add.overlap(this.player, this.checkPoints, (_, checkPoint) => {
      if (!(checkPoint instanceof Phaser.Physics.Arcade.Sprite)) {
        throw new Error("CheckPoint not found");
      }

      if (checkPoint.getData("isPressed")) {
        return;
      }

      checkPoint.setTexture(ENTITY_IMAGE_KEYS.CHECKPOINT_PRESSED);

      this.sound.play(SOUND_KEYS.CHECKPOINT, { volume: 0.2 });

      checkPoint.setData("isPressed", true);

      this.checkPoint = { x: checkPoint.x, y: checkPoint.y };
    });

    this.physics.add.overlap(this.player, finish, (_, finish) => {
      if (!(finish instanceof Phaser.GameObjects.Rectangle)) {
        throw new Error("Finish not found");
      }

      this.end(finish);
    });

    this.physics.add.collider(this.player, this.jumpers, (_, jumper) => {
      if (!(jumper instanceof Phaser.Physics.Arcade.Sprite)) {
        throw new Error("Jumper not found");
      }

      if (!(jumper.body?.touching.up && this.player?.body?.touching.down)) {
        return;
      }

      this.player?.onJumper();

      jumper.setTexture(ENTITY_IMAGE_KEYS.JUMPER_ACTIVE);

      this.sound.play(SOUND_KEYS.JUMPER, { volume: 0.2 });

      this.time.addEvent({
        delay: 300,
        callback: () => {
          jumper.setTexture(ENTITY_IMAGE_KEYS.JUMPER);
        },
      });
    });

    this.physics.add.collider(this.player, this.map.mapLayer);

    this.cameras.main.setBounds(
      this.map.mapLayer.x,
      this.map.mapLayer.y,
      this.map.mapLayer.width,
      this.map.mapLayer.height,
    );

    this.physics.world.setBounds(
      this.map.mapLayer.x,
      this.map.mapLayer.y,
      this.map.mapLayer.width,
      this.map.mapLayer.height,
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
