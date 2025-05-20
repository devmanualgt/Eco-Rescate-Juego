import Phaser from 'phaser';
import { height, width } from './constants/sizes';
import { DialogueScene } from './scenes/dialog.scene';
import { BosqueEscena } from './scenes/forest.scene';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width,
  height,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0, x: 0 },
    },
  },
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: [BosqueEscena, DialogueScene],
};

new Phaser.Game(config);
