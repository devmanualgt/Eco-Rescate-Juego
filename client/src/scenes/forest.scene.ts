import Phaser from 'phaser';
import { Hero } from '../sprites/hero';
import { DebugHelper } from '../utils/debuger.herlper';

export class BosqueEscena extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  hero!: Hero;
  debugHelper: DebugHelper;
  map!: Phaser.Tilemaps.Tilemap; // Agregar esta propiedad
  layers: Phaser.Tilemaps.TilemapLayer[];
  constructor() {
    super('BosqueEscena');
  }

  preload() {
    this.load.spritesheet('map', 'assets/tilemaps/map.png', {
      frameWidth: 16,
      frameHeight: 15,
    });

    this.load.tilemapTiledJSON('forest', 'assets/tilemaps/map01.json');

    this.load.aseprite({
      key: 'hero',
      textureURL: 'assets/sprites/hero-frames.png',
      atlasURL: 'assets/sprites/hero-frames.json',
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'forest' });
    const tileset = map.addTilesetImage('map', 'map');

    this.layers = [
      map.createLayer('water', tileset, 0, 0)?.setScale(2.5)!, // 0
      map.createLayer('land', tileset, 0, 0)?.setScale(2.5)!, // 1
      map.createLayer('tree0', tileset, 0, 0)?.setScale(2.5)!, // 2
      map.createLayer('tree1', tileset, 0, 0)?.setScale(2.5)!, // 3
      map.createLayer('tree2', tileset, 0, 0)?.setScale(2.5)!, // 4
      map.createLayer('boxes', tileset, 0, 0)?.setScale(2.5)!, // 5
    ];

    this.anims.createFromAseprite('hero', [
      'respirar',
      'respirar-right',
      'respirar-left',
      'respirar-back',
      'walk-right',
      'walk-left',
      'walk-front',
      'walk-back',
    ]);
    this.anims.get('respirar').repeat = -1;

    this.hero = new Hero(this, 512, 384);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels * 2.5,
      map.heightInPixels * 2.45
    );
    this.cameras.main.startFollow(this.hero);

    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels * 2.5,
      map.heightInPixels * 2.45
    );

    if (this.layers[0]) this.layers[0].setCollision([173, 174]);
    if (this.layers[2]) this.layers[2].setCollision([35, 37, 63, 64, 65]);
    if (this.layers[3]) this.layers[3].setCollisionBetween(8, 63);
    if (this.layers[4]) this.layers[4].setCollision([36]);
    if (this.layers[5]) this.layers[5].setCollisionBetween(231, 260);

    if (this.layers[1]) this.physics.add.collider(this.hero, this.layers[0]);
    if (this.layers[2]) this.physics.add.collider(this.hero, this.layers[2]);
    if (this.layers[3]) this.physics.add.collider(this.hero, this.layers[3]);
    if (this.layers[4]) this.physics.add.collider(this.hero, this.layers[4]);
    if (this.layers[5]) this.physics.add.collider(this.hero, this.layers[5]);

    this.debugHelper = new DebugHelper(this, this.layers);
  }

  update() {
    this.debugHelper.update();

    this.hero.move(this.cursors);
  }

  drawGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.3); // Líneas blancas con transparencia

    const tileSize = 16 * 2.5; // Ajustar según el tamaño del tile y el escalado
    const width = this.scale.width;
    const height = this.scale.height;

    for (let x = 0; x < width; x += tileSize) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }

    for (let y = 0; y < height; y += tileSize) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }

    graphics.strokePath();
  }
}
