import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

import { Player, Score } from "@/components";
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
import { Map } from "@/components/Map";

export class MainScene extends Phaser.Scene {
  player: Player | null = null;

  spikes: Phaser.Physics.Arcade.Group | null = null;

  coins: Phaser.Physics.Arcade.Group | null = null;

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

    this.spikes = this.createGroup();
    this.coins = this.createGroup();
    this.jumpers = this.createGroup();
    this.checkPoints = this.createGroup();

    this.map.value.getObjectLayer("coins")?.objects.forEach((coin) => {
      if (!hasPhysics(coin)) {
        throw new Error("Coin physics not found");
      }

      const coinSprite: Phaser.Physics.Arcade.Sprite = this.coins
        ?.create(coin.x, coin.y - coin.height / 2, ENTITY_SPRITE_KEYS.COIN)
        .setOrigin(0, 0.5);

      if (!coinSprite.body) {
        throw new Error("Coin body not found");
      }

      coinSprite.body.setSize(coin.width * 0.5, coin.height * 0.5);
      coinSprite.body.setOffset(
        coin.width * 0.5 - coin.width * 0.25,
        coin.height * 0.5 - coin.height * 0.25,
      );

      coinSprite.anims.play(ANIMATION_KEYS.COIN_SPIN, true);
    });

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

    this.map.value.getObjectLayer("spikes")?.objects.forEach((spike) => {
      if (!hasPhysics(spike)) {
        throw new Error("Spike physics not found");
      }

      if (!this.spikes) {
        throw new Error("Spikes group not created");
      }

      const spikeSprite: Phaser.Physics.Arcade.Sprite = this.spikes
        .create(
          spike.x,
          spike.rotation === 180
            ? spike.y + spike.height
            : spike.y - spike.height,
          ENTITY_IMAGE_KEYS.SPIKE,
        )
        .setOrigin(0)
        .setAngle(spike.rotation);

      if (!spikeSprite.body) {
        throw new Error("Spike body not found");
      }

      spikeSprite.body
        .setSize(spike.width, spike.height - spike.height * 0.5)
        .setOffset(0, spike.height * 0.5);

      if (spike.rotation === 180) {
        spikeSprite.body.setOffset(-spike.width, -spike.height);
      }
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

    const spawnPoint = this.map.value.findObject(
      "spawn",
      (spawn) => spawn.name === "spawn",
    );

    if (!spawnPoint || !isNumber(spawnPoint.x) || !isNumber(spawnPoint.y)) {
      throw new Error("Spawn point not found");
    }

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    const score = new Score(this, 5, 6);

    this.physics.add.overlap(this.player, this.coins, (_, coin) => {
      score.increment();

      this.sound.play(SOUND_KEYS.COIN, { volume: 0.5 });
      coin.destroy();
    });

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

    this.physics.add.collider(this.player, this.spikes, (_, spike) => {
      if (!(spike instanceof Phaser.Physics.Arcade.Sprite)) {
        throw new Error("Spike not found");
      }

      if (
        !(
          (this.player?.body?.touching.down && spike.body?.touching.up) ||
          (this.player?.body?.touching.up && spike.body?.touching.down)
        )
      ) {
        return;
      }

      this.player?.die(() => {
        this.player?.setPosition(
          this.checkPoint?.x ?? spawnPoint.x,
          this.checkPoint?.y ?? spawnPoint.y,
        );
      });
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
