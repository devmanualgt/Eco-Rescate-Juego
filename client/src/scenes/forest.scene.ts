import Phaser from 'phaser';
import { Hero } from '../sprites/hero';
import { DebugHelper } from '../utils/debuger.herlper';

export class BosqueEscena extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  hero!: Hero;
  debugHelper: DebugHelper;
  map!: Phaser.Tilemaps.Tilemap;
  layers: Phaser.Tilemaps.TilemapLayer[];

  private soundCaminar!: Phaser.Sound.BaseSound;
  private musicaFondo!: Phaser.Sound.BaseSound;

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

    this.load.audio('caminar', [
      'assets/audio/ogg/leavesWalk01.ogg',
      'assets/audio/mp3/leavesWalk01.mp3',
    ]);

    this.load.audio('musicaFondo', [
      'assets/audio/ogg/intro.ogg',
      'assets/audio/mp3/intro.mp3',
    ]);
  }

  create() {
    this.musicaFondo = this.sound.add('musicaFondo', {
      loop: true,
      volume: 1,
    });
    this.musicaFondo.play();

    const map = this.make.tilemap({ key: 'forest' });
    const tileset = map.addTilesetImage('map', 'map');

    this.layers = [
      map.createLayer('water', tileset, 0, 0)?.setScale(2.5)!,
      map.createLayer('land', tileset, 0, 0)?.setScale(2.5)!,
      map.createLayer('tree0', tileset, 0, 0)?.setScale(2.5)!,
      map.createLayer('tree1', tileset, 0, 0)?.setScale(2.5)!,
      map.createLayer('tree2', tileset, 0, 0)?.setScale(2.5)!,
      map.createLayer('boxes', tileset, 0, 0)?.setScale(2.5)!,
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

    this.soundCaminar = this.sound.add('caminar', { volume: 5 });
    console.log('Sonido caminar cargado:', this.soundCaminar);

    this.createSoundUI();
  }

  update() {
    this.debugHelper.update();
    this.hero.move(this.cursors);

    const moviendo =
      this.cursors.left.isDown ||
      this.cursors.right.isDown ||
      this.cursors.up.isDown ||
      this.cursors.down.isDown;

    if (moviendo) {
      if (!this.soundCaminar.isPlaying) {
        this.soundCaminar.play({ loop: true });
      }
    } else {
      if (this.soundCaminar.isPlaying) {
        this.soundCaminar.stop();
      }
    }
  }

  drawGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.3);
    const tileSize = 16 * 2.5;
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

  private createSoundUI() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '20px';
    container.style.left = '20px';
    container.style.background = 'rgba(0, 0, 0, 0.6)';
    container.style.padding = '12px';
    container.style.borderRadius = '10px';
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    container.style.zIndex = '1000';

    const volMusica = (this.musicaFondo as Phaser.Sound.WebAudioSound).volume;
    const volAmbiente = (this.soundCaminar as Phaser.Sound.WebAudioSound)
      .volume;

    container.innerHTML = `
      <label style="display:block; margin-bottom: 10px;">🎵 Música de Fondo:
        <input type="range" id="musicSlider" min="0" max="1" step="0.01" value="${volMusica}">
      </label>
      <label style="display:block;">🌿 Sonido Ambiental:
        <input type="range" id="ambientSlider" min="0" max="1" step="0.01" value="${volAmbiente}">
      </label>
    `;

    document.body.appendChild(container);

    const musicSlider = container.querySelector(
      '#musicSlider'
    ) as HTMLInputElement;
    const ambientSlider = container.querySelector(
      '#ambientSlider'
    ) as HTMLInputElement;

    musicSlider.addEventListener('input', () => {
      (this.musicaFondo as Phaser.Sound.WebAudioSound).setVolume(
        parseFloat(musicSlider.value)
      );
    });

    ambientSlider.addEventListener('input', () => {
      (this.soundCaminar as Phaser.Sound.WebAudioSound).setVolume(
        parseFloat(ambientSlider.value)
      );
    });

    this.input.keyboard.on('keydown-M', () => {
      container.style.display =
        container.style.display === 'none' ? 'block' : 'none';
    });
  }
}
