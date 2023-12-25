import Phaser from "phaser";

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  FONT_KEY,
  SCENE_KEYS,
  SOUND_KEYS,
  ENTITY_IMAGE_KEYS,
  ENTITY_SPRITE_KEYS,
  MUSIC_KEYS,
  UI_KEYS,
  TILEMAP_KEYS,
  TILESET_KEYS,
} from "@/constants";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload() {
    this.initScene();

    this.load.setBaseURL("assets");

    this.loadLevel();

    this.loadEntities();

    this.loadUI();

    this.loadMusic();
    this.loadSounds();

    this.loadFont();
  }

  public create() {
    this.scene.start(SCENE_KEYS.MAIN_MENU);
  }

  private initScene() {
    this.cameras.main.setBackgroundColor("#000000");

    this.add
      .text(20, 20, "Loading game...")
      .setPosition(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2)
      .setOrigin(0.5, 0.5);
  }

  private loadLevel() {
    this.load.image(TILESET_KEYS.FIRST, "tiles_packed.png");
    this.load.tilemapTiledJSON(TILEMAP_KEYS.FIRST, "level1.json");
  }

  private loadEntities() {
    this.load.spritesheet(ENTITY_SPRITE_KEYS.PLAYER, "ball320.png", {
      frameWidth: 320,
      frameHeight: 320,
    });
    this.load.spritesheet(ENTITY_SPRITE_KEYS.COIN, "coin.png", {
      frameWidth: 18,
      frameHeight: 18,
    });

    this.load.image(ENTITY_IMAGE_KEYS.SPIKE, "spike.png");
    this.load.image(ENTITY_IMAGE_KEYS.JUMPER, "jumper.png");
    this.load.image(ENTITY_IMAGE_KEYS.JUMPER_ACTIVE, "jumper-active.png");
    this.load.image(ENTITY_IMAGE_KEYS.CHECKPOINT, "checkpoint.png");
    this.load.image(
      ENTITY_IMAGE_KEYS.CHECKPOINT_PRESSED,
      "checkpoint-pressed.png",
    );
  }

  private loadUI() {
    this.load.image(UI_KEYS.BUTTON, "/ui/button.png");
    this.load.image(UI_KEYS.BUTTON_PRESSED, "/ui/button-pressed.png");
    this.load.image(UI_KEYS.PANEL, "/ui/panel.png");
    this.load.image(UI_KEYS.GREY_PANEL, "/ui/grey-panel.png");
    this.load.image(UI_KEYS.ORANGE_BUTTON, "/ui/orange-button.png");
    this.load.image(
      UI_KEYS.ORANGE_BUTTON_PRESSED,
      "/ui/orange-button-pressed.png",
    );
    this.load.image(UI_KEYS.BACKGROUND, "/ui/background.jpg");
    this.load.image(UI_KEYS.SOUNDS, "/ui/sounds.png");
    this.load.image(UI_KEYS.SOUNDS_OFF, "/ui/sounds-off.png");
    this.load.image(UI_KEYS.CLOSE, "/ui/close.png");
  }

  private loadMusic() {
    this.load.audio(MUSIC_KEYS.MENU, "/music/menu.ogg");
    this.load.audio(MUSIC_KEYS.BACKGROUND, "/music/background.ogg");
  }

  private loadSounds() {
    this.load.audio(SOUND_KEYS.COIN, "/sounds/coin.mp3");
    this.load.audio(SOUND_KEYS.DEATH, "/sounds/death.mp3");
    this.load.audio(SOUND_KEYS.CHECKPOINT, "/sounds/checkpoint.mp3");
    this.load.audio(SOUND_KEYS.JUMPER, "/sounds/jumper.mp3");
    this.load.audio(SOUND_KEYS.JUMP, "/sounds/jump.wav");
    this.load.audio(SOUND_KEYS.WIN, "/sounds/win.mp3");
  }

  private loadFont() {
    this.load.bitmapFont(FONT_KEY, "/ui/fonts/font.png", "/ui/fonts/font.xml");
  }
}
