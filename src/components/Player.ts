import Phaser from "phaser";
import { ANIMATION_KEYS, ENTITY_SPRITE_KEYS, SOUND_KEYS } from "@/constants";

export class Player extends Phaser.Physics.Arcade.Sprite {
  public isDisableKeys = false;
  private isDead = false;
  private keys: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ENTITY_SPRITE_KEYS.PLAYER);

    this.initKeys(scene.input);

    this.initAnims(scene);

    this.initPhysics(scene);
  }

  public onJumper(): void {
    this.setVelocityY(-550);
  }

  public die(callback: () => void): void {
    if (this.isDead) {
      return;
    }

    this.isDead = true;

    this.anims.play(ANIMATION_KEYS.PLAYER_DEAD, true);

    this.scene.sound.play(SOUND_KEYS.DEATH);

    this.setVelocity(0);

    this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        this.setVelocity(0);
        callback();
        this.isDead = false;
      },
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
      key: ANIMATION_KEYS.PLAYER_TURN,
      frames: [{ key: ENTITY_SPRITE_KEYS.PLAYER, frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: ANIMATION_KEYS.PLAYER_LEFT,
      frames: this.anims.generateFrameNumbers(ENTITY_SPRITE_KEYS.PLAYER, {
        start: 19,
        end: 23,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: ANIMATION_KEYS.PLAYER_DEAD,
      frames: this.anims.generateFrameNumbers(ENTITY_SPRITE_KEYS.PLAYER, {
        start: 24,
        end: 27,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: ANIMATION_KEYS.PLAYER_RIGHT,
      frames: this.anims.generateFrameNumbers(ENTITY_SPRITE_KEYS.PLAYER, {
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
      throw new Error("Player body not found");
    }

    this.body.setOffset(320 / 4 - 7, 320 / 2 - 14);
    this.body.setSize(320 / 2 + 10, 320 / 2 + 10, false);

    this.setScale(0.1);

    this.setCollideWorldBounds(true);
  }

  public enableKeys(): void {
    this.isDisableKeys = false;
  }

  public disableKeys(): void {
    this.isDisableKeys = true;
  }

  public update(): void {
    if (!this.keys || !this.body) {
      throw new Error("Keys/body not found");
    }

    if (this.isDead || this.isDisableKeys) {
      return;
    }

    if (this.keys.left.isDown) {
      this.setVelocityX(-160);

      this.anims.play(ANIMATION_KEYS.PLAYER_LEFT, true);
    } else if (this.keys.right.isDown) {
      this.setVelocityX(160);

      this.anims.play(ANIMATION_KEYS.PLAYER_RIGHT, true);
    } else {
      this.setVelocityX(0);

      this.anims.play(ANIMATION_KEYS.PLAYER_TURN);
    }

    if (
      this.keys.up.isDown &&
      this.body.blocked.down &&
      !this.body.touching.down
    ) {
      this.setVelocityY(-330);

      this.scene.sound.play(SOUND_KEYS.JUMP);
    }
  }
}
