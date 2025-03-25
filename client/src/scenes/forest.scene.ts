import Phaser from 'phaser';
import { Hero } from '../sprites/hero';

export class BosqueEscena extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  hero!: Hero;

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

    map.createLayer('topplayer', tileset, 0, 0)?.setScale(2.5);
    const treeLayer = map.createLayer('tree', tileset, 0, 0)?.setScale(2.5);
    const boxLayer = map.createLayer('boxes', tileset, 0, 0)?.setScale(2.5);

    this.anims.createFromAseprite('hero');
    this.hero = new Hero(this, 512, 384);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels * 2.5,
      map.heightInPixels * 2.45
    );
    this.cameras.main.startFollow(this.hero);

    treeLayer?.setCollisionBetween(8, 63);
    boxLayer?.setCollisionBetween(231, 260);
    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels * 2.5,
      map.heightInPixels * 2.45
    );

    this.physics.add.collider(this.hero, treeLayer!);
    this.physics.add.collider(this.hero, boxLayer!);
  }

  update() {
    this.hero.move(this.cursors);
  }
}
