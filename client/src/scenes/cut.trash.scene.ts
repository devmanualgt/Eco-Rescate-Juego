import Phaser from 'phaser';
import Swal from 'sweetalert2';
import { height, width } from '../constants/sizes';
import { LifeHeader } from './life.scene';

/* const speedDown = 250;
const numBasuras = 5; */

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
  cheetos: { scale: 0.3, type: 'score', value: 5, tag: 'reciclaje' },
  pepsi: { scale: 0.3, type: 'score', value: 5, tag: 'reciclaje' },
  tortix: { scale: 0.3, type: 'score', value: 5, tag: 'reciclaje' },
  cereza: { scale: 1, type: 'damage', value: 1, tag: 'bien' },
  limon: { scale: 1, type: 'damage', value: 1, tag: 'bien' },
  hoja: { scale: 0.1, type: 'damage', value: 1, tag: 'bien' },
};

const boteSkins = ['botereciclaje', 'boteorganico', 'botenoreciclaje']; // Cambia los nombres según los recursos cargados

export class CutTrashScene extends Phaser.Scene {
  dialogueBox: Phaser.GameObjects.Graphics;
  player;
  cursor;

  targets = [];
  points = +window.localStorage.getItem('highscore') || 0;

  private header!: LifeHeader;
  private scoreText!: Phaser.GameObjects.Text;
  private speedDown = 100; // Velocidad inicial
  private speedIncrement = 50; // Cuánto se incrementa cada vez
  private playerSpeed = this.speedDown + 50;
  private collectedCount = 0;
  private pauseInProgress = false;
  private currentSkinIndex = 0;

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

    // Leer puntaje desde localStorage
    window.localStorage.removeItem('highscore'); // elimina el valor guardado
    this.points = 0; // empieza desde cero

    this.scoreText = this.add.text(20, 60, `Puntaje: ${this.points}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 3,
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(100);

    this.cursor = this.input.keyboard.createCursorKeys();
    this.dialog(
      'Clasifica',
      'Debes de recolectar la basura que se puede reciclar',
      'info'
    ).then(() => {
      this.elementsGame();
    });
  }

  elementsGame() {
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

    this.collectedCount = 0;
    this.pauseInProgress = false;

    this.crearItemsFalling(); // 👈 Inicializa la primera tanda de ítems
  }

  crearItemsFalling() {
    const itemsFalling = Object.keys(itemConfig);
    const slotWidth = 100;
    const screenWidth = this.cameras.main.width;
    const possibleSlots: number[] = [];

    for (let x = 0; x < screenWidth - slotWidth; x += slotWidth) {
      possibleSlots.push(x);
    }

    Phaser.Utils.Array.Shuffle(possibleSlots);
    this.targets = [];

    for (let i = 0; i < itemsFalling.length; i++) {
      if (possibleSlots.length === 0) break;

      const x = possibleSlots.pop();
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
      console.log(randomKey);

      this.targets.push(item);

      this.physics.add.overlap(this.player, item, async () => {
        if (item.canBeCollected && !this.pauseInProgress) {
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
    const { left, right, up, down } = this.cursor;

    // Movimiento horizontal
    if (this.player) {
      if (left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
      } else if (right.isDown) {
        this.player.setVelocityX(this.playerSpeed);
      } else {
        this.player.setVelocityX(0);
      }

      // Movimiento vertical
      if (up.isDown) {
        this.player.setVelocityY(-this.playerSpeed);
      } else if (down.isDown) {
        this.player.setVelocityY(this.playerSpeed);
      } else {
        this.player.setVelocityY(0);
      }

      // Lógica para reposicionar los objetos basura
      this.targets.forEach((basura) => {
        if (basura.y >= height) {
          basura.setY(0);
          basura.setX(this.getRandomX());
          basura.setVelocityY(this.speedDown);
        }
      });
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * (width - 100));
  }

  async targetHit(basura, config) {
    const currentBote = this.player.texture.key;
    const sinBote = currentBote.replace('bote', '');

    this.collectedCount++;

    // ✅ Cuando recolecta 10
    if (this.collectedCount >= 3) {
      this.pauseInProgress = true;

      // ❌ Eliminar todos los ítems actuales
      this.targets.forEach((obj) => obj.destroy());
      this.targets = [];

      await this.dropText('Ahora debes de !').then(() => {
        this.changeBote();
      });

      this.collectedCount = 0;
      this.pauseInProgress = false;

      // ✅ Generar nuevos ítems
      this.crearItemsFalling();
    }

    basura.destroy();

    if (config.type === 'score') {
      if (sinBote === config.tag) {
        this.points += config.value;
        window.localStorage.setItem('highscore', this.points.toString());
        this.updateScoreText();
        console.log('¡Puntos! ' + this.points);
      }
    } else {
      //this.someDamageFunction();
    }

    // window.localStorage.setItem('highscore', this.points.toString());
    // console.log('¡Puntos! ' + this.points);
  }

  updateScoreText() {
    this.scoreText.setText(`Puntaje: ${this.points}`);
  }

  someDamageFunction() {
    const newLives = 3;
    this.header.updateLives(newLives);
  }

  changeBote() {
    //let currentSkinIndex = 0;
    this.currentSkinIndex = (this.currentSkinIndex + 1) % boteSkins.length;
    const newSkin = boteSkins[this.currentSkinIndex];

    this.player.setTexture(newSkin);
    /* this.time.addEvent({
      delay: 10000, // 10 segundos
      loop: true,
      callback: () => {
        currentSkinIndex = (currentSkinIndex + 1) % boteSkins.length;
        const newSkin = boteSkins[currentSkinIndex];

      
        this.player.setTexture(newSkin);
      },
    }); */
  }

  dropText(message: string): Promise<void> {
    return new Promise((resolve) => {
      const text = this.add
        .text(this.cameras.main.centerX, -50, message, {
          fontSize: '32px',
          color: '#ffffff',
          fontStyle: 'bold',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: text,
        y: this.cameras.main.centerY,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
          this.time.delayedCall(1500, () => {
            text.destroy();
            resolve();
          });
        },
      });
    });
  }

  dialog(title, text, icon: 'warning' | 'error' | 'info') {
    let timerInterval;

    return Swal.fire({
      title,
      text,
      timer: 5000,
      timerProgressBar: true,
      icon,
      backdrop: false, // 👈 evita bloqueos o efectos sobre el fondo
      didOpen: () => {
        Swal.getPopup().blur(); // 👈 elimina focus para prevenir scroll automático
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }
}
