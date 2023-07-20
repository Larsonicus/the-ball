import Phaser from "phaser";

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/constants";

export class MainMenu extends Phaser.Scene {
  private buttons: Phaser.GameObjects.Image[] = [];

  constructor() {
    super({ key: "main-menu" });
  }

  create() {
    this.cameras.main.fadeIn();

    this.sound.play("menu", { loop: true, volume: 0.1, delay: 0.5 });

    const buttonStyle = {
      width: 75,
      height: 40,
      gap: 10,
    };

    const play = this.add
      .image(DEFAULT_WIDTH * 0.5, DEFAULT_HEIGHT * 0.5, "orange-button")
      .setDisplaySize(buttonStyle.width, buttonStyle.height)
      .setDepth(1);

    const playText = this.add
      .text(play.x, play.y, "Play", {
        fontSize: "20px",
      })
      .setOrigin(0.5)
      .setDepth(2);

    const titleText = this.add
      .text(DEFAULT_WIDTH * 0.5, 40, "Huge Balls\nRunner", {
        color: "#ffffff",
        fontSize: "24px",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(2);

    const options = this.add
      .image(play.x, play.y + play.displayHeight + 10, "button")
      .setDisplaySize(buttonStyle.width, buttonStyle.height)
      .setDepth(1);

    const optionsText = this.add
      .text(options.x, options.y, "Options")
      .setOrigin(0.5)
      .setDepth(2);

    this.add
      .image(DEFAULT_WIDTH * 0.5, 40, "panel")
      .setDisplaySize(titleText.width + buttonStyle.gap, 60)
      .setTint(0x10c010);

    const background = this.add
      .image(DEFAULT_WIDTH * 0.5, DEFAULT_HEIGHT * 0.5, "background-ui")
      .setDepth(-1);

    const scaleBackground = Math.max(
      DEFAULT_WIDTH / background.width,
      DEFAULT_HEIGHT / background.height,
    );

    // background.setDepth(0);
    background.setScale(scaleBackground);

    play.setInteractive();
    play.on("pointerover", () => {
      play.setTint(0xffa500);
    });

    play.on("pointerdown", () => {
      play.setTexture("orange-button-pressed");
    });

    play.on("pointerout", () => {
      play.setTexture("orange-button");
      play.clearTint();
    });

    play.on("pointerup", () => {
      this.cameras.main.fadeOut(750);
      this.sound.stopAll();

      this.time.delayedCall(1000, () => {
        this.scene.start("main");
      });
    });

    this.buttons.push(play);
    this.buttons.push(options);

    const panel = this.add
      .image(play.x, play.y + buttonStyle.height * 0.5 + 4, "grey-panel")
      .setDisplaySize(
        this.buttons.length * buttonStyle.width,
        this.buttons.length * buttonStyle.height + 15 + 40,
      );

    const sounds = this.add
      .image(panel.x, panel.y, "sounds")
      .setOrigin(0.5)
      .setDisplaySize(36, 36)
      .setDepth(2)
      .setVisible(false)
      .setInteractive();

    const closeOptions = this.add
      .image(
        panel.x + panel.displayWidth * 0.5 - 15,
        panel.y - panel.displayHeight * 0.5 + 15,
        "close",
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
      options.setTexture("button");
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
      sounds.setTexture(this.sound.mute ? "sounds" : "sounds-off");
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
    visibleElements: Array<Phaser.GameObjects.Image | Phaser.GameObjects.Text>,
    hiddenElements: Array<Phaser.GameObjects.Image | Phaser.GameObjects.Text>,
  ) {
    for (const element of visibleElements) {
      element.setVisible(true);
    }

    for (const element of hiddenElements) {
      element.setVisible(false);
    }
  }
}
