import Phaser from 'phaser';
import { height, width } from '../constants/sizes';
import { SceneManager } from '../utils/scene.manager';

export class CutTrashScene extends Phaser.Scene {
  dialogueBox: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'CutTrashScene' });
  }

  preload() {
    this.load.image('background', 'assets/sprites/background-lianas.jpeg');
    this.load.image('quitButton', 'assets/sprites/quitbutton.png');
  }

  create() {
    //this.cameras.main.setBackgroundColor(0x000000);
    this.add
      .sprite(0, 0, 'background')
      .setOrigin(0) // Establece el origen en la esquina superior izquierda
      .setDisplaySize(width, height); // Ajusta al tamaño exacto

    const quit = this.add
      .image(0, 0, 'quitButton')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    quit.setInteractive();
    quit.on('pointerdown', () => {
      const manager = SceneManager.getInstance(this);
      manager.transitionTo('LianasScene', 'DialogueScene', 'fade', 500);
    });
  }
}
