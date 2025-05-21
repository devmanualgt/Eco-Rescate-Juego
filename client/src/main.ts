import Phaser from 'phaser';
import { height, width } from './constants/sizes';
import { CutTrashScene } from './scenes/cut.trash.scene';
import { DialogueScene } from './scenes/dialog.scene';
import { BosqueEscena } from './scenes/forest.scene';

import { Preloader } from './scenes/preloader.scene';
import { StartScene } from './scenes/strart.scene';
import './style.css';
import { Boot } from './utils/boot';

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
  scene: [
    Boot,
    Preloader,
    StartScene,
    BosqueEscena,
    DialogueScene,
    CutTrashScene,
  ],
};

new Phaser.Game(config);
