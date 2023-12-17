import { PreloadScene, MainScene, MainMenu } from "@/scenes";

import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./resolution";

export const config: Phaser.Types.Core.GameConfig = {
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
