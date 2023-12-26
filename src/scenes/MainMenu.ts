import Phaser from "phaser";

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  FONT_KEY,
  MUSIC_KEYS,
  SCENE_KEYS,
  UI_KEYS,
} from "@/constants";
import { UIElement } from "@/types";

export class MainMenu extends Phaser.Scene {
  private buttons: Phaser.GameObjects.Image[] = [];

  private buttonStyle = {
    width: 75,
    height: 40,
    gap: 10,
  };

  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  public create() {
    this.cameras.main.fadeIn();

    this.sound.play(MUSIC_KEYS.MENU, { loop: true, volume: 0.1, delay: 0.5 });

    this.addBackground();
    this.addTitle();

    const [playButton, playText] = this.addPlayButton(
      DEFAULT_WIDTH * 0.5,
      DEFAULT_HEIGHT * 0.5,
    );

    const [optionsButton, optionsText] = this.addOptionsButton(
      playButton.x,
      playButton.y + playButton.displayHeight + 10,
    );

    const backgroundPanel = this.addBackgroundPanel(
      playButton.x,
      playButton.y + this.buttonStyle.height * 0.5 + 4,
    );

    const soundsButton = this.addSoundsButton(
      backgroundPanel.x,
      backgroundPanel.y,
    );

    const closeOptionsButton = this.addCloseOptionsButton(
      backgroundPanel.x + backgroundPanel.displayWidth * 0.5 - 15,
      backgroundPanel.y - backgroundPanel.displayHeight * 0.5 + 15,
    );

    this.addOptionsButtonEventHandlers(optionsButton, optionsText, {
      visible: [closeOptionsButton, soundsButton],
      hidden: [playButton, playText],
    });

    this.addCloseOptionsButtonEventHandlers(closeOptionsButton, {
      visible: [playButton, playText, optionsButton, optionsText],
      hidden: [soundsButton],
    });
  }

  private changeElementsVisibility(
    visible: Array<UIElement>,
    hidden: Array<UIElement>,
  ) {
    for (const element of visible) {
      element.setVisible(true);
    }

    for (const element of hidden) {
      element.setVisible(false);
    }
  }

  private addBackground() {
    const background = this.add
      .image(DEFAULT_WIDTH * 0.5, DEFAULT_HEIGHT * 0.5, UI_KEYS.BACKGROUND)
      .setDepth(-1);

    const scaleBackground = Math.max(
      DEFAULT_WIDTH / background.width,
      DEFAULT_HEIGHT / background.height,
    );

    background.setScale(scaleBackground);
  }

  private addPlayButton(x: number, y: number) {
    const button = this.add
      .image(x, y, UI_KEYS.ORANGE_BUTTON)
      .setDisplaySize(this.buttonStyle.width, this.buttonStyle.height)
      .setDepth(1);

    const text = this.add
      .bitmapText(button.x, button.y, FONT_KEY, "Play", 20)
      .setOrigin(0.5)
      .setDepth(2);

    button.setInteractive();

    button.on("pointerover", () => {
      button.setTint(0xffa500);
    });

    button.on("pointerdown", () => {
      button.setTexture(UI_KEYS.ORANGE_BUTTON_PRESSED);
    });

    button.on("pointerout", () => {
      button.setTexture(UI_KEYS.ORANGE_BUTTON);
      button.clearTint();
    });

    button.on("pointerup", () => {
      this.cameras.main.fadeOut(750);
      this.sound.stopAll();

      this.time.delayedCall(1000, () => {
        this.scene.start(SCENE_KEYS.MAIN);
      });
    });

    this.buttons.push(button);

    return [button, text] as const;
  }

  private addOptionsButton(x: number, y: number) {
    const button = this.add
      .image(x, y, UI_KEYS.BUTTON)
      .setDisplaySize(this.buttonStyle.width, this.buttonStyle.height)
      .setDepth(1);

    const text = this.add
      .bitmapText(button.x, button.y, FONT_KEY, "Options", 20)
      .setOrigin(0.5)
      .setDepth(2);

    button.setInteractive();

    this.buttons.push(button);

    return [button, text] as const;
  }

  private addOptionsButtonEventHandlers(
    button: Phaser.GameObjects.Image,
    text: Phaser.GameObjects.BitmapText,
    elementVisibility: {
      visible: Array<UIElement>;
      hidden: Array<UIElement>;
    },
  ) {
    button.on("pointerover", () => {
      button.setTint(0x7878ff);
    });

    button.on("pointerdown", () => {
      button.setTexture("button-pressed");
    });

    button.on("pointerout", () => {
      button.setTexture(UI_KEYS.BUTTON);
      button.clearTint();
    });

    button.on("pointerup", () => {
      this.changeElementsVisibility(elementVisibility.visible, [
        button,
        text,
        ...elementVisibility.hidden,
      ]);
    });
  }

  private addTitle() {
    const title = this.add
      .bitmapText(DEFAULT_WIDTH * 0.5, 40, FONT_KEY, "The Ball", 24, 1)
      .setOrigin(0.5)
      .setDepth(2);

    this.add
      .image(DEFAULT_WIDTH * 0.5 - 1, 38, UI_KEYS.PANEL)
      .setDisplaySize(title.width + this.buttonStyle.gap, title.height + 20)
      .setTint(0x10c010);

    return title;
  }

  private addBackgroundPanel(x: number, y: number) {
    const panel = this.add
      .image(x, y, UI_KEYS.GREY_PANEL)
      .setDisplaySize(
        this.buttons.length * this.buttonStyle.width,
        this.buttons.length * this.buttonStyle.height + 15 + 40,
      );

    return panel;
  }

  private addSoundsButton(x: number, y: number) {
    const button = this.add
      .image(x, y, UI_KEYS.SOUNDS)
      .setOrigin(0.5)
      .setDisplaySize(36, 36)
      .setDepth(2)
      .setVisible(false)
      .setInteractive();

    button.on("pointerover", () => {
      button.setTint(0xdd118f);
    });

    button.on("pointerout", () => {
      button.clearTint();
    });

    button.on("pointerup", () => {
      button.setTexture(this.sound.mute ? UI_KEYS.SOUNDS : UI_KEYS.SOUNDS_OFF);
      this.sound.setMute(!this.sound.mute);
    });

    return button;
  }

  private addCloseOptionsButton(x: number, y: number) {
    const button = this.add
      .image(x, y, UI_KEYS.CLOSE)
      .setOrigin(0.5)
      .setDisplaySize(10, 10)
      .setTint(0xaa0000)
      .setDepth(2)
      .setVisible(false)
      .setInteractive();

    return button;
  }

  private addCloseOptionsButtonEventHandlers(
    button: Phaser.GameObjects.Image,
    elementVisibility: {
      visible: Array<UIElement>;
      hidden: Array<UIElement>;
    },
  ) {
    button.on("pointerover", () => {
      button.setTint(0xff0000);
    });

    button.on("pointerout", () => {
      button.setTint(0xaa0000);
    });

    button.on("pointerup", () => {
      this.changeElementsVisibility(elementVisibility.visible, [
        button,
        ...elementVisibility.hidden,
      ]);
    });
  }
}
