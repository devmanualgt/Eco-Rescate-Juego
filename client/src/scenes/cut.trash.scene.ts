import Phaser from 'phaser';
import { height, width } from '../constants/sizes';
import { LifeHeader } from './life.scene';

export class CutTrashScene extends Phaser.Scene {
  dialogueBox: Phaser.GameObjects.Graphics;
  private header!: LifeHeader;

  constructor() {
    super({ key: 'CutTrashScene' });
  }

  preload() {}

  create() {
    this.add
      .sprite(0, 0, 'background')
      .setOrigin(0) // Establece el origen en la esquina superior izquierda
      .setDisplaySize(width, height); // Ajusta al tamaño exacto

    this.header = new LifeHeader(this, 3, 'DialogueScene'); // 3 vidas iniciales
  }

  someDamageFunction() {
    const newLives = 3;
    this.header.updateLives(newLives);
  }
}
