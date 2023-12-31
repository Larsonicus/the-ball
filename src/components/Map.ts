import Phaser from "phaser";
import { TILEMAP_KEYS, TILESET_KEYS } from "@/constants";

export class Map {
  public readonly mapLayer: Phaser.Tilemaps.TilemapLayer;
  public readonly value: Phaser.Tilemaps.Tilemap;

  constructor(
    scene: Phaser.Scene,
    map: {
      key: TILEMAP_KEYS;
      layerId: string;
    },
    tileset: {
      name: string;
      key: TILESET_KEYS;
    },
  ) {
    this.value = scene.make.tilemap({ key: map.key });
    const createdTileset = this.value.addTilesetImage(
      tileset.name,
      tileset.key,
    );

    if (!createdTileset) {
      throw new Error("Tileset not found");
    }

    const layer = this.value.createLayer(map.layerId, createdTileset);

    if (!layer) {
      throw new Error("Layer not found");
    }

    this.mapLayer = layer;

    this.initPhysics(scene, layer);
  }

  private initPhysics(
    scene: Phaser.Scene,
    layer: Phaser.Tilemaps.TilemapLayer,
  ) {
    layer.setCollisionByProperty({ hasCollision: true });

    scene.cameras.main.setBounds(layer.x, layer.y, layer.width, layer.height);

    scene.physics.world.setBounds(layer.x, layer.y, layer.width, layer.height);
  }
}
