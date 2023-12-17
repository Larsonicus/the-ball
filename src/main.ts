import Phaser from "phaser";

import { config } from "./constants";

window.addEventListener("load", () => {
  new Phaser.Game(config);
});
