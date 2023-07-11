import Phaser from "phaser";

import { MainScene } from "./scenes";
import { resize } from "./helpers";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "./constants";

window.addEventListener("load", () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "app",
    scale: {
      mode: Phaser.Scale.NONE,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200 },
      },
    },
    scene: [MainScene],
  };

  const game = new Phaser.Game(config);

  window.addEventListener("resize", () => {
    resize(game);
  });

  resize(game);
});
