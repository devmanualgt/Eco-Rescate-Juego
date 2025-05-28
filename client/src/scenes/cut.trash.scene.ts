import Phaser from 'phaser';
import { height, width } from '../constants/sizes';
import { LifeHeader } from './life.scene';

const itemConfig: Record<
  string,
  {
    scale: number;
    type: 'score' | 'damage';
    value: number;
    tag: 'noreciclaje' | 'organico' | 'reciclaje' | 'bien' | 'papel';
  }
> = {
  lata: { scale: 0.5, type: 'score', value: 10, tag: 'noreciclaje' },
  manzana: { scale: 0.45, type: 'score', value: 5, tag: 'organico' },
  papel: { scale: 0.6, type: 'score', value: 5, tag: 'reciclaje' },
  cereza: { scale: 1, type: 'damage', value: 1, tag: 'bien' },
  limon: { scale: 1, type: 'damage', value: 1, tag: 'bien' },
};
/*    this.load.image('botenoreciclaje', 'assets/ui/botenoreciclaje.png');
    this.load.image('botenorganico', 'assets/ui/botenorganico.png');
    this.load.image('botereciclaje', 'assets/ui/botereciclaje.png'); */
const boteSkins = ['botereciclaje', 'boteorganico', 'botenoreciclaje']; // Cambia los nombres según los recursos cargados

export class CutTrashScene extends Phaser.Scene {
  dialogueBox: Phaser.GameObjects.Graphics;
  private header!: LifeHeader;

  private speedDown = 100; // Velocidad inicial
  private speedIncrement = 50; // Cuánto se incrementa cada vez

  player;
  cursor;
  playerSpeed = this.speedDown + 50;
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
      .image(85, height - 100, 'botereciclaje')
      .setOrigin(0, 0)
      .setScale(0.3);
    this.player.setImmovable(true);
    this.player.body.setAllowGravity(false);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(
      this.player.width - this.player.height / 4,
      this.player.height / 6
    );

    this.cursor = this.input.keyboard.createCursorKeys();

    const itemsFalling = Object.keys(itemConfig);
    const slotWidth = 100; // Espaciado entre elementos (ajústalo a tus necesidades)
    const screenWidth = this.cameras.main.width;

    const possibleSlots: number[] = [];
    for (let x = 0; x < screenWidth - slotWidth; x += slotWidth) {
      possibleSlots.push(x);
    }

    Phaser.Utils.Array.Shuffle(possibleSlots); // Mezclar para que sea aleatorio

    for (let i = 0; i < itemsFalling.length; i++) {
      if (possibleSlots.length === 0) break; // No hay más espacio

      const x = possibleSlots.pop(); // Tomar una posición sin repetir
      const y = Phaser.Math.Between(-height, 0);
      const randomKey = Phaser.Utils.Array.GetRandom(itemsFalling);
      const config = itemConfig[randomKey];

      const item = this.physics.add
        .image(x, y, randomKey)
        .setOrigin(0, 0) as Phaser.Physics.Arcade.Image & {
        canBeCollected: boolean;
      };

      item.setScale(config.scale);
      item.setVelocityY(this.speedDown);
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

    this.time.addEvent({
      delay: 5000, // 10 segundos
      loop: true,
      callback: () => {
        this.speedDown += this.speedIncrement;
        console.log('⬇️ Nueva velocidad:', this.speedDown);

        // Aplicar nueva velocidad a todos los objetos en pantalla
        this.targets.forEach((item) => {
          item.setVelocityY(this.speedDown);
        });
      },
    });

    this.changeBote();
  }

  changeBote() {
    let currentSkinIndex = 0;

    this.time.addEvent({
      delay: 10000, // 10 segundos
      loop: true,
      callback: () => {
        currentSkinIndex = (currentSkinIndex + 1) % boteSkins.length;
        const newSkin = boteSkins[currentSkinIndex];

        // 🔄 Cambiar la textura del jugador
        this.player.setTexture(newSkin);
        //this.player.setScale(0.2);
      },
    });
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
        basura.setVelocityY(this.speedDown);
      }
    });
  }

  getRandomX() {
    return Math.floor(Math.random() * (width - 100));
  }

  targetHit(basura, config) {
    const currentBote = this.player.texture.key;
    const sinBote = currentBote.replace('bote', '');

    console.log(sinBote); // reciclaje

    //console.log();

    basura.setY(0);
    basura.setX(this.getRandomX());
    basura.setVelocityY(this.speedDown);
    if (config.type === 'score') {
      if (sinBote === config.tag) {
        this.points += config.value;
      }
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
