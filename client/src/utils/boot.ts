import Phaser from 'phaser';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.aseprite({
      key: 'all-bird',
      textureURL: 'assets/sprites/all-bird.png',
      atlasURL: 'assets/sprites/all-bird.json',
    });
  }

  create() {
    this.scene.start('Preloader');
  }
}
