import Phaser from "phaser";
import { PLAYER_TEXTURE_KEY } from "@/constants";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "preload" });
  }

  preload() {
    this.load.setBaseURL("./src/assets");

    this.load.image("tileset", "tiles_packed.png");
    this.load.tilemapTiledJSON("map", "level1.json");

    this.load.spritesheet(PLAYER_TEXTURE_KEY, "ball320.png", {
      frameWidth: 320,
      frameHeight: 320,
    });

    this.load.image("spike", "spike.png");

    this.load.spritesheet("coin", "coin.png", {
      frameWidth: 18,
      frameHeight: 18,
    });

    this.load.image("jumper", "jumper.png");
    this.load.image("jumper-active", "jumper-active.png");

    this.load.audio("coin", "/sounds/coin.mp3");
    this.load.audio("background", "/music/background.ogg");
  }

  create() {
    this.scene.start("main");
  }
}
