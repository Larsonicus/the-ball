import Phaser from "phaser";

import { ENTITY_SPRITE_KEYS, FONT_KEY } from "@/constants";

export class Score extends Phaser.GameObjects.Text {
  private _value: number = 0;

  public get value(): number {
    return this._value;
  }

  private readonly _scoreText: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "", {});

    this.scene.add
      .image(x, y, ENTITY_SPRITE_KEYS.COIN)
      .setDisplayOrigin(0, 0)
      .setScrollFactor(0);

    const margin = {
      x: 20,
      y: 4,
    };

    this._scoreText = this.scene.add
      .bitmapText(x + margin.x, y + margin.y, FONT_KEY, `Coins: ${this._value}`)
      .setDisplayOrigin(0, 0)
      .setScrollFactor(0);
  }

  public increment(): void {
    const newScore = ++this._value;

    this._scoreText.setText(`Coins: ${newScore}`);
  }
}
