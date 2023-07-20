import Phaser from "phaser";

import { MainScene, PreloadScene } from "./scenes";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "./constants";
import { MainMenu } from "./scenes/MainMenu";

window.addEventListener("load", () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "app",
    /** DON'T TOUCH THIS PROPERTY */
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.ScaleModes.ENVELOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 700 },
      },
    },
    scene: [PreloadScene, MainMenu, MainScene],
    backgroundColor: "#00B5E2",
  };

  new Phaser.Game(config);
});
