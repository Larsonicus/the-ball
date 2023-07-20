import Phaser from "phaser";

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/constants";

export class MainMenu extends Phaser.Scene {
  private buttons: Phaser.GameObjects.Image[] = [];
  private selectedButtonIndex = 0;

  constructor() {
    super({ key: "main-menu" });
  }

  create() {
    const buttonStyle = {
      width: 75,
      height: 40,
      gap: 10,
    };

    const play = this.add
      .image(DEFAULT_WIDTH * 0.5, DEFAULT_HEIGHT * 0.5, "orange-button")
      .setDisplaySize(buttonStyle.width, buttonStyle.height)
      .setDepth(1);

    this.add
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

    this.add.text(options.x, options.y, "Options").setOrigin(0.5).setDepth(2);

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

      this.time.delayedCall(1000, () => {
        this.scene.start("main");
      });
    });

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
      console.log("open options");
    });

    this.buttons.push(play);
    this.buttons.push(options);

    this.add
      .image(play.x, play.y + buttonStyle.height * 0.5 + 4, "grey-panel")
      .setDisplaySize(
        this.buttons.length * buttonStyle.width,
        this.buttons.length * buttonStyle.height + 15 + 40,
      );
  }
}
