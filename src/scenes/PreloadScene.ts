import Phaser from "phaser";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, PLAYER_TEXTURE_KEY } from "@/constants";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "preload" });
  }

  preload() {
    this.cameras.main.setBackgroundColor("#000000");
    this.add
      .text(20, 20, "Loading game...")
      .setPosition(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2)
      .setOrigin(0.5, 0.5);

    this.load.setBaseURL("assets");

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

    this.load.image("checkpoint", "checkpoint.png");
    this.load.image("checkpoint-pressed", "checkpoint-pressed.png");

    this.load.image("button", "/ui/button.png");
    this.load.image("button-pressed", "/ui/button-pressed.png");
    this.load.image("panel", "/ui/panel.png");
    this.load.image("grey-panel", "/ui/grey-panel.png");
    this.load.image("orange-button", "/ui/orange-button.png");
    this.load.image("orange-button-pressed", "/ui/orange-button-pressed.png");
    this.load.image("background-ui", "/ui/background.jpg");
    this.load.image("sounds", "/ui/sounds.png");
    this.load.image("sounds-off", "/ui/sounds-off.png");
    this.load.image("close", "/ui/close.png");

    this.load.audio("menu", "/music/menu.ogg");
    this.load.audio("background", "/music/background.ogg");

    this.load.audio("coin", "/sounds/coin.mp3");

    this.load.audio("death", "/sounds/death.mp3");

    this.load.audio("checkpoint", "/sounds/checkpoint.mp3");

    this.load.audio("jumper", "/sounds/jumper.mp3");

    this.load.audio("jump", "/sounds/jump.wav");
  }

  create() {
    this.scene.start("main-menu");
  }
}
