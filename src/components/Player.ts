import Phaser from "phaser";
import { PLAYER_TEXTURE_KEY } from "@/constants";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private isDead = false;
  private keys: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  coins = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PLAYER_TEXTURE_KEY);

    this.initKeys(scene.input);

    this.initAnims(scene);

    this.initPhysics(scene);
  }

  public collectCoin(): void {
    this.coins++;
  }

  public onJumper(): void {
    this.setVelocityY(-550);
  }

  public die(): void {
    this.isDead = true;

    this.setVelocity(0, 0);

    this.anims.play("dead", true);

    this.scene.time.addEvent({
      delay: 300,
      callback: () => this.scene.scene.restart(),
    });
  }

  private initKeys(input: Phaser.Input.InputPlugin): void {
    if (!input.keyboard) {
      throw new Error("Keyboard not found");
    }

    this.keys = input.keyboard.createCursorKeys();
  }

  private initAnims(scene: Phaser.Scene): void {
    scene.anims.create({
      key: "turn",
      frames: [{ key: PLAYER_TEXTURE_KEY, frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(PLAYER_TEXTURE_KEY, {
        start: 19,
        end: 23,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "dead",
      frames: this.anims.generateFrameNumbers(PLAYER_TEXTURE_KEY, {
        start: 24,
        end: 27,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(PLAYER_TEXTURE_KEY, {
        start: 14,
        end: 18,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private initPhysics(scene: Phaser.Scene): void {
    this.setOrigin(0.5, 0.5);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (!this.body) {
      throw new Error("Body not found");
    }

    this.body.setOffset(320 / 4 - 7, 320 / 2 - 14);
    this.body.setSize(320 / 2 + 10, 320 / 2 + 10, false);

    this.setScale(0.1);

    // this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }

  update(): void {
    if (!this.keys || !this.body) {
      throw new Error("Keys/body not found");
    }

    if (this.isDead) {
      return;
    }

    if (this.keys.left.isDown) {
      this.setVelocityX(-160);

      this.anims.play("left", true);
    } else if (this.keys.right.isDown) {
      this.setVelocityX(160);

      this.anims.play("right", true);
    } else {
      this.setVelocityX(0);

      this.anims.play("turn");
    }

    if (
      this.keys.up.isDown &&
      this.body.blocked.down &&
      !this.body.touching.down
    ) {
      this.setVelocityY(-330);
    }
  }
}
