import Phaser from 'phaser';
import { height, width } from '../constants/sizes';
import { LifeHeader } from './life.scene';

const speedDown = 250;
const numBasuras = 5;

const itemConfig: Record<
  string,
  { scale: number; type: 'score' | 'damage'; value: number }
> = {
  lata: { scale: 0.5, type: 'score', value: 10 },
  manzana: { scale: 0.45, type: 'score', value: 5 },
  papel: { scale: 0.6, type: 'score', value: 5 },
  cereza: { scale: 1, type: 'damage', value: 1 },
  limon: { scale: 1, type: 'damage', value: 1 },
};

export class CutTrashScene extends Phaser.Scene {
  dialogueBox: Phaser.GameObjects.Graphics;
  private header!: LifeHeader;

  player;
  cursor;
  playerSpeed = speedDown + 50;
  targets = [];
  points = +window.localStorage.getItem('highscore') || 0;

  constructor() {
    super({ key: 'CutTrashScene' });
  }

  preload() {}

  create() {
    this.add
      .sprite(0, 0, 'background')
      .setOrigin(0) // Establece el origen en la esquina superior izquierda
      .setDisplaySize(width, height); // Ajusta al tamaño exacto

    //this.add.image(80, 0, 'escena').setOrigin(0, 0);

    this.header = new LifeHeader(this, 3, 'DialogueScene'); // 3 vidas iniciales

    this.player = this.physics.add
      .image(85, height - 700, 'bote')
      .setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.setAllowGravity(false);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(
      this.player.width - this.player.height / 4,
      this.player.height / 6
    );

    this.cursor = this.input.keyboard.createCursorKeys();

    //const itemsFalling = ['lata', 'manzana', 'papel', 'cereza', 'limon']; // puedes agregar más
    const itemsFalling = Object.keys(itemConfig);

    for (let i = 0; i < numBasuras; i++) {
      const x = this.getRandomX();
      const y = Phaser.Math.Between(-height, 0);
      const randomKey = Phaser.Utils.Array.GetRandom(itemsFalling); // elige una imagen al azar
      const config = itemConfig[randomKey];

      const item = this.physics.add
        .image(x, y, randomKey)
        .setOrigin(0, 0) as Phaser.Physics.Arcade.Image & {
        canBeCollected: boolean;
      };
      item.setScale(config.scale);

      item.setVelocityY(speedDown);
      item.canBeCollected = true;
      this.targets.push(item);

      this.physics.add.overlap(this.player, item, () => {
        if (item.canBeCollected) {
          item.canBeCollected = false;
          this.targetHit(item, config);

          this.time.delayedCall(500, () => {
            item.canBeCollected = true;
          });
        }
      });
    }
  }

  update() {
    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    this.targets.forEach((basura) => {
      if (basura.y >= height) {
        basura.setY(0);
        basura.setX(this.getRandomX());
        basura.setVelocityY(speedDown);
      }
    });
  }

  getRandomX() {
    return Math.floor(Math.random() * (width - 100));
  }

  targetHit(basura, config) {
    console.log(basura);

    basura.setY(0);
    basura.setX(this.getRandomX());
    basura.setVelocityY(speedDown);
    if (config.type === 'score') {
      this.points += config.value;
    } else {
      //this.someDamageFunction();
    }

    window.localStorage.setItem('highscore', this.points.toString());
    console.log('¡Puntos! ' + this.points);
  }

  someDamageFunction() {
    const newLives = 3;
    this.header.updateLives(newLives);
  }
}
