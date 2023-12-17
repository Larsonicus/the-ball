import Phaser from "phaser";

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  FONT_KEY,
  MUSIC_KEYS,
  SCENE_KEYS,
  UI_KEYS,
} from "@/constants";

export class MainMenu extends Phaser.Scene {
  private buttons: Phaser.GameObjects.Image[] = [];

  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  create() {
    this.cameras.main.fadeIn();

    this.sound.play(MUSIC_KEYS.MENU, { loop: true, volume: 0.1, delay: 0.5 });

    const buttonStyle = {
      width: 75,
      height: 40,
      gap: 10,
    };

    const play = this.add
      .image(DEFAULT_WIDTH * 0.5, DEFAULT_HEIGHT * 0.5, UI_KEYS.ORANGE_BUTTON)
      .setDisplaySize(buttonStyle.width, buttonStyle.height)
      .setDepth(1);

    const playText = this.add
      .bitmapText(play.x, play.y, FONT_KEY, "Play", 20)
      .setOrigin(0.5)
      .setDepth(2);

    const titleText = this.add
      .bitmapText(DEFAULT_WIDTH * 0.5, 40, FONT_KEY, "Huge Ball\nRunner", 24, 1)
      .setOrigin(0.5)
      .setDepth(2);

    const options = this.add
      .image(play.x, play.y + play.displayHeight + 10, UI_KEYS.BUTTON)
      .setDisplaySize(buttonStyle.width, buttonStyle.height)
      .setDepth(1);

    const optionsText = this.add
      .bitmapText(options.x, options.y, FONT_KEY, "Options", 20)
      .setOrigin(0.5)
      .setDepth(2);

    this.add
      .image(DEFAULT_WIDTH * 0.5 - 1, 38, UI_KEYS.PANEL)
      .setDisplaySize(titleText.width + buttonStyle.gap, titleText.height + 20)
      .setTint(0x10c010);

    const background = this.add
      .image(DEFAULT_WIDTH * 0.5, DEFAULT_HEIGHT * 0.5, UI_KEYS.BACKGROUND)
      .setDepth(-1);

    const scaleBackground = Math.max(
      DEFAULT_WIDTH / background.width,
      DEFAULT_HEIGHT / background.height,
    );

    background.setScale(scaleBackground);

    play.setInteractive();
    play.on("pointerover", () => {
      play.setTint(0xffa500);
    });

    play.on("pointerdown", () => {
      play.setTexture(UI_KEYS.ORANGE_BUTTON_PRESSED);
    });

    play.on("pointerout", () => {
      play.setTexture(UI_KEYS.ORANGE_BUTTON);
      play.clearTint();
    });

    play.on("pointerup", () => {
      this.cameras.main.fadeOut(750);
      this.sound.stopAll();

      this.time.delayedCall(1000, () => {
        this.scene.start(SCENE_KEYS.MAIN);
      });
    });

    this.buttons.push(play);
    this.buttons.push(options);

    const backgroundPanel = this.add
      .image(play.x, play.y + buttonStyle.height * 0.5 + 4, UI_KEYS.GREY_PANEL)
      .setDisplaySize(
        this.buttons.length * buttonStyle.width,
        this.buttons.length * buttonStyle.height + 15 + 40,
      );

    const sounds = this.add
      .image(backgroundPanel.x, backgroundPanel.y, UI_KEYS.SOUNDS)
      .setOrigin(0.5)
      .setDisplaySize(36, 36)
      .setDepth(2)
      .setVisible(false)
      .setInteractive();

    const closeOptions = this.add
      .image(
        backgroundPanel.x + backgroundPanel.displayWidth * 0.5 - 15,
        backgroundPanel.y - backgroundPanel.displayHeight * 0.5 + 15,
        UI_KEYS.CLOSE,
      )
      .setOrigin(0.5)
      .setDisplaySize(10, 10)
      .setTint(0xaa0000)
      .setDepth(2)
      .setVisible(false)
      .setInteractive();

    options.setInteractive();
    options.on("pointerover", () => {
      options.setTint(0x7878ff);
    });

    options.on("pointerdown", () => {
      options.setTexture("button-pressed");
    });

    options.on("pointerout", () => {
      options.setTexture(UI_KEYS.BUTTON);
      options.clearTint();
    });

    options.on("pointerup", () => {
      this.changeElementsVisibility(
        [closeOptions, sounds],
        [play, playText, options, optionsText],
      );
    });

    sounds.on("pointerover", () => {
      sounds.setTint(0xdd118f);
    });

    sounds.on("pointerout", () => {
      sounds.clearTint();
    });

    sounds.on("pointerup", () => {
      sounds.setTexture(this.sound.mute ? UI_KEYS.SOUNDS : UI_KEYS.SOUNDS_OFF);
      this.sound.setMute(!this.sound.mute);
    });

    closeOptions.on("pointerover", () => {
      closeOptions.setTint(0xff0000);
    });

    closeOptions.on("pointerout", () => {
      closeOptions.setTint(0xaa0000);
    });

    closeOptions.on("pointerup", () => {
      this.changeElementsVisibility(
        [play, playText, options, optionsText],
        [closeOptions, sounds],
      );
    });
  }

  private changeElementsVisibility(
    visibleElements: Array<
      | Phaser.GameObjects.Image
      | Phaser.GameObjects.Text
      | Phaser.GameObjects.BitmapText
    >,
    hiddenElements: Array<
      | Phaser.GameObjects.Image
      | Phaser.GameObjects.Text
      | Phaser.GameObjects.BitmapText
    >,
  ) {
    for (const element of visibleElements) {
      element.setVisible(true);
    }

    for (const element of hiddenElements) {
      element.setVisible(false);
    }
  }
}
