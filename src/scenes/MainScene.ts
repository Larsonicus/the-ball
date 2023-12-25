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
import { findSpawnpoint } from "@/helpers";
import {
  TILEMAP_KEYS,
  TILESET_KEYS,
  MUSIC_KEYS,
  SCENE_KEYS,
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

    const spawnPoint = findSpawnpoint(map.value);

    this.player = new Player(this, spawnPoint.x, spawnPoint.y, map.mapLayer);

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
  }

  update(): void {
    if (!this.player) {
      throw new Error("Player not found");
    }

    this.player.update();
  }
}
