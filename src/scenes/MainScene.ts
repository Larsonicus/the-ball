import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

import { Player } from "@/components/Player";
import { isExistCoordinate } from "@/helpers";

export class MainScene extends Phaser.Scene {
  player: Player | null = null;

  spikes: Phaser.Physics.Arcade.Group | null = null;

  coins: Phaser.Physics.Arcade.Group | null = null;

  jumpers: Phaser.Physics.Arcade.Group | null = null;

  constructor() {
    super({ key: "main" });
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
    this.sound.play("background", { loop: true });

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles_packed", "tileset");

    if (!tileset) {
      throw new Error("Tileset not found");
    }

    const all = map.createLayer("all", tileset);

    if (!all) {
      throw new Error("Layer not found");
    }

    this.sys.animatedTiles.init(all.tilemap);

    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.coins = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    map.getObjectLayer("coins")?.objects.forEach((coin) => {
      if (!coin.x || !coin.y || !coin.height || !coin.width) {
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

    this.jumpers = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    map.getObjectLayer("jumpers")?.objects.forEach((jumper) => {
      if (!jumper.x || !jumper.y || !jumper.height || !jumper.width) {
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
      if (!spike.y || !spike.height || !spike.width || !spike.x) {
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
        spikeSprite.body.setOffset(-spike.height, -spike.height);
      }
    });

    all.setCollisionByProperty({ hasCollision: true });

    if (!this.input.keyboard) {
      throw new Error("Keyboard not found");
    }

    const spawnPoint = map.findObject(
      "spawn",
      (spawn) => spawn.name === "spawn",
    );

    if (
      !spawnPoint ||
      !isExistCoordinate(spawnPoint.x) ||
      !isExistCoordinate(spawnPoint.y)
    ) {
      throw new Error("Spawn point not found");
    }

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    this.physics.add.overlap(this.player, this.coins, (_, coin) => {
      this.player?.collectCoin();
      this.sound.play("coin");
      coin.destroy();
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

      this.player?.die();
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
