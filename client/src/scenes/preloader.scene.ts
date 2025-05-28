import Phaser from 'phaser';
import { SceneManager } from '../utils/scene.manager';

export class Preloader extends Phaser.Scene {
  private bird: Phaser.GameObjects.Sprite;
  private numFrames = 5;

  constructor() {
    super({ key: 'Preloader' });
  }

  init() {
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNames('all-bird', {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.bird = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 50,
      'all-bird',
      '0'
    );

    this.bird.setScale(0.6);
    //this.bird.play('fly');

    // Progreso de carga → cambiar frame visible
    this.load.on('progress', (value: number) => {
      const currentFrameIndex = Math.floor(value * this.numFrames);
      const frameName = `${currentFrameIndex}`;

      // Evita reestablecer el mismo frame si ya está
      if (this.bird.frame.name !== frameName) {
        this.bird.setFrame(frameName);
      }
    });

    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  usar el progreso de carga para cambiar el ancho de la barra
    this.load.on('progress', (progress) => {
      //  actualizar el ancho de la barra
      bar.width = 4 + 460 * progress;
    });

    this.load.on('complete', () => {
      console.log('Carga completa');
      const manager = SceneManager.getInstance(this);
      manager.transitionTo('Preloader', 'StartScene', 'fade', 500);
      //            manager.transitionTo('Preloader', 'CutTrashScene', 'fade', 500);
    });
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

    this.load.audio('typing', ['assets/audio/mp3/typing.mp3']);

    // images
    this.load.image('vida_fondo', 'assets/ui/vida.png');
    this.load.image('logo', 'assets/ui/logo.png');
    this.load.image('background', 'assets/sprites/background-lianas.jpeg');
    this.load.image('quitButton', 'assets/sprites/quitbutton.png');

    this.load.image('bote', 'assets/ui/bote.jpg');
    this.load.image('botenoreciclaje', 'assets/ui/botenoreciclaje.png');
    this.load.image('boteorganico', 'assets/ui/boteorganico.png');
    this.load.image('botereciclaje', 'assets/ui/botereciclaje.png');
    this.load.image('basura', 'assets/ui/basura.jpg');
    this.load.image('escena', 'assets/ui/escena.jpg');

    // perder vida
    this.load.image('cereza', 'assets/ui/cereza.png');
    this.load.image('limon', 'assets/ui/limon.png');

    // dan puntos
    this.load.image('lata', 'assets/ui/lata.png');
    this.load.image('manzana', 'assets/ui/manzana.png');
    this.load.image('papel', 'assets/ui/papel.png');

    this.load.atlas('flares', 'assets/ui/flares.png', 'assets/ui/flares.json');

    /*  for (let i = 0; i < 100; i++) {
      this.load.image(`dummy-${i}`, 'assets/ui/logo.png'); // puede ser un ícono pequeño
    } */
  }

  create() {}
}
