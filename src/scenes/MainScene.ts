import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

import {
  Player,
  Score,
  Map,
  CoinsGroup,
  SpikesGroup,
  JumpersGroup,
  CheckpointsGroup,
  Finish,
} from "@/components";
import { isNumber } from "@/helpers";
import {
  ENTITY_SPRITE_KEYS,
  TILEMAP_KEYS,
  TILESET_KEYS,
  MUSIC_KEYS,
  SCENE_KEYS,
  ANIMATION_KEYS,
  PLUGIN_KEYS,
} from "@/constants";

export class MainScene extends Phaser.Scene {
  player: Player | null = null;

  constructor() {
    super({ key: SCENE_KEYS.MAIN });
  }

  preload() {
    this.load.scenePlugin(
      PLUGIN_KEYS.ANIMATED_TILES,
      AnimatedTiles,
      PLUGIN_KEYS.ANIMATED_TILES,
      SCENE_KEYS.MAIN,
    );

    this.anims.create({
      key: ANIMATION_KEYS.COIN_SPIN,
      frames: this.anims.generateFrameNumbers(ENTITY_SPRITE_KEYS.COIN, {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private createMap() {
    return new Map(
      this,
      {
        key: TILEMAP_KEYS.FIRST,
        layerId: "all",
      },
      {
        key: TILESET_KEYS.FIRST,
        name: "tiles_packed",
      },
    );
  }

  private initAnimatedTiles(map: Phaser.Tilemaps.Tilemap) {
    const { animatedTiles } = this.sys as typeof this.sys & {
      [PLUGIN_KEYS.ANIMATED_TILES]: AnimatedTiles;
    };
    animatedTiles.init(map);
  }

  create() {
    this.cameras.main.fadeIn();

    this.sound.play(MUSIC_KEYS.BACKGROUND, {
      loop: true,
      volume: 0.1,
      delay: 0.5,
    });

    const map = this.createMap();
    this.initAnimatedTiles(map.value);

    const score = new Score(this, 5, 6);

    const spawnPoint = map.value.findObject(
      "spawn",
      (spawn) => spawn.name === "spawn",
    );

    if (!spawnPoint || !isNumber(spawnPoint.x) || !isNumber(spawnPoint.y)) {
      throw new Error("Spawn point not found");
    }

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    const checkpoints = new CheckpointsGroup(this, map.value, {
      object: this.player,
    });

    new SpikesGroup(this, map.value, {
      object: this.player,
      callback: () =>
        this.player?.die(() => {
          this.player?.setPosition(
            checkpoints.lastCheckpoint?.x ?? spawnPoint.x,
            checkpoints.lastCheckpoint?.x ?? spawnPoint.y,
          );
        }),
    });

    new CoinsGroup(this, map.value, {
      object: this.player,
      callback: () => score.increment(),
    });

    new JumpersGroup(this, map.value, {
      object: this.player,
    });

    new Finish(this, map.value, {
      object: this.player,
    });

    map.value.setCollisionByProperty({ hasCollision: true });

    this.physics.add.collider(this.player, map.mapLayer);

    this.cameras.main.setBounds(
      map.mapLayer.x,
      map.mapLayer.y,
      map.mapLayer.width,
      map.mapLayer.height,
    );

    this.physics.world.setBounds(
      map.mapLayer.x,
      map.mapLayer.y,
      map.mapLayer.width,
      map.mapLayer.height,
    );

    this.cameras.main.startFollow(this.player);
  }

  update(): void {
    if (!this.player) {
      throw new Error("Player not found");
    }

    this.player.update();
  }
}
