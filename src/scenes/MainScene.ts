import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

import { Player } from "@/components";
import { isNumber } from "@/helpers";
import { TILE_SIZE } from "@/constants";

export class MainScene extends Phaser.Scene {
  player: Player | null = null;

  spikes: Phaser.Physics.Arcade.Group | null = null;

  coins: Phaser.Physics.Arcade.Group | null = null;

  jumpers: Phaser.Physics.Arcade.Group | null = null;

  checkPoints: Phaser.Physics.Arcade.Group | null = null;
  checkPoint: { x: number; y: number } | null = null;

  constructor() {
    super({ key: "main" });
  }

  private createGroup(): Phaser.Physics.Arcade.Group {
    return this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
  }

  preload() {
    this.load.scenePlugin(
      "animatedTiles",
      AnimatedTiles,
      "animatedTiles",
      "main",
    );

    this.anims.create({
      key: "coin-spin",
      frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  create() {
    this.sound.play("background", { loop: true, volume: 0.1 });

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles_packed", "tileset");

    if (!tileset) {
      throw new Error("Tileset not found");
    }

    const all = map.createLayer("all", tileset);

    if (!all) {
      throw new Error("Layer not found");
    }

    (this.sys as typeof this.sys & { animatedTiles: AnimatedTiles })
      .animatedTiles;

    this.spikes = this.createGroup();
    this.coins = this.createGroup();
    this.jumpers = this.createGroup();
    this.checkPoints = this.createGroup();

    map.getObjectLayer("coins")?.objects.forEach((coin) => {
      if (
        !isNumber(coin.x) ||
        !isNumber(coin.y) ||
        !isNumber(coin.height) ||
        !isNumber(coin.width)
      ) {
        throw new Error("Coin physics not found");
      }

      const coinSprite = this.coins
        ?.create(coin.x, coin.y - coin.height / 2, "coin")
        .setOrigin(0, 0.5) as Phaser.Physics.Arcade.Sprite;

      if (!coinSprite.body) {
        throw new Error("Coin body not found");
      }

      coinSprite.body.setSize(coin.width * 0.5, coin.height * 0.5);
      coinSprite.body.setOffset(
        coin.width * 0.5 - coin.width * 0.25,
        coin.height * 0.5 - coin.height * 0.25,
      );

      coinSprite.anims.play("coin-spin", true);
    });

    map.getObjectLayer("checkPoints")?.objects.forEach((checkPoint) => {
      if (
        !isNumber(checkPoint.x) ||
        !isNumber(checkPoint.y) ||
        !isNumber(checkPoint.height) ||
        !isNumber(checkPoint.width)
      ) {
        throw new Error("CheckPoint physics not found");
      }

      const checkPointSprite = this.checkPoints
        ?.create(checkPoint.x, checkPoint.y, "checkpoint")
        .setOrigin(0, 1) as Phaser.Physics.Arcade.Sprite;

      if (!checkPointSprite.body) {
        throw new Error("CheckPoint body not found");
      }

      checkPointSprite.body.setSize(checkPoint.width, checkPoint.height * 0.5);
      checkPointSprite.body.setOffset(0, checkPoint.height * 0.5);
    });

    map.getObjectLayer("jumpers")?.objects.forEach((jumper) => {
      if (
        !isNumber(jumper.x) ||
        !isNumber(jumper.y) ||
        !isNumber(jumper.height) ||
        !isNumber(jumper.width)
      ) {
        throw new Error("Jumper physics not found");
      }

      const jumperSprite: Phaser.Physics.Arcade.Sprite = this.jumpers?.create(
        jumper.x,
        jumper.y,
        "jumper",
      );

      jumperSprite.setOrigin(0, 1);

      if (!jumperSprite.body) {
        throw new Error("Jumper body not found");
      }

      jumperSprite.body.setSize(jumper.width, jumper.height * 0.5);
      jumperSprite.body.setOffset(0, jumper.height * 0.5);
    });

    map.getObjectLayer("spikes")?.objects.forEach((spike) => {
      if (
        !isNumber(spike.y) ||
        !isNumber(spike.height) ||
        !isNumber(spike.width) ||
        !isNumber(spike.x)
      ) {
        throw new Error("Spike physics not found");
      }

      if (!this.spikes) {
        throw new Error("Spikes group not created");
      }

      const spikeSprite: Phaser.Physics.Arcade.Sprite = this.spikes.create(
        spike.x,
        spike.rotation === 180
          ? spike.y + spike.height
          : spike.y - spike.height,
        "spike",
      );

      spikeSprite.setOrigin(0);

      spikeSprite.setAngle(spike.rotation);

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

    const finishPoint = map.findObject(
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

    all.setCollisionByProperty({ hasCollision: true });

    if (!this.input.keyboard) {
      throw new Error("Keyboard not found");
    }

    const spawnPoint = map.findObject(
      "spawn",
      (spawn) => spawn.name === "spawn",
    );

    if (!spawnPoint || !isNumber(spawnPoint.x) || !isNumber(spawnPoint.y)) {
      throw new Error("Spawn point not found");
    }

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    this.physics.add.overlap(this.player, this.coins, (_, coin) => {
      this.player?.collectCoin();
      this.sound.play("coin", { volume: 0.2 });
      coin.destroy();
    });

    this.physics.add.overlap(this.player, this.checkPoints, (_, checkPoint) => {
      if (!(checkPoint instanceof Phaser.Physics.Arcade.Sprite)) {
        throw new Error("CheckPoint not found");
      }

      if (checkPoint.getData("isPressed")) {
        return;
      }

      checkPoint.setTexture("checkpoint-pressed");

      this.sound.play("checkpoint", { volume: 0.2 });

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

    this.physics.add.overlap(this.player, finish, () => {
      console.log("finish");
    });

    this.physics.add.collider(this.player, this.jumpers, (_, jumper) => {
      if (!(jumper instanceof Phaser.Physics.Arcade.Sprite)) {
        throw new Error("Jumper not found");
      }

      if (!(jumper.body?.touching.up && this.player?.body?.touching.down)) {
        return;
      }

      this.player?.onJumper();

      jumper.setTexture("jumper-active");

      this.sound.play("jumper", { volume: 0.2 });

      this.time.addEvent({
        delay: 300,
        callback: () => {
          jumper.setTexture("jumper");
        },
      });
    });

    this.physics.add.collider(this.player, all);

    this.cameras.main.setBounds(all.x, all.y + 200, 2000, 2000);

    this.physics.world.setBounds(all.x, all.y, 2000, 2000);

    this.cameras.main.startFollow(this.player);
  }

  update(): void {
    if (!this.player) {
      throw new Error("Player not found");
    }

    this.player.update();
  }
}
