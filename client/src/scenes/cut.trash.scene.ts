import Phaser from 'phaser';
import Swal from 'sweetalert2';
import { height, width } from '../constants/sizes';
import { DialogueBox } from './dialog.scene';
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
  diaper: { scale: 0.3, type: 'score', value: 15, tag: 'noreciclaje' },
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
  stop = false;
  private header!: LifeHeader;
  private scoreText!: Phaser.GameObjects.Text;
  private speedDown = 100; // Velocidad inicial
  private speedIncrement = 50; // Cuánto se incrementa cada vez
  private playerSpeed = this.speedDown + 50;
  private collectedCount = 0;
  private pauseInProgress = false;
  private currentSkinIndex = 0;
  dialogB: DialogueBox | null = null;

  constructor() {
    super({ key: 'CutTrashScene' });
  }

  preload() {}

  async create() {
    this.add
      .sprite(0, 0, 'background')
      .setOrigin(0) // Establece el origen en la esquina superior izquierda
      .setDisplaySize(width, height); // Ajusta al tamaño exacto

    this.header = new LifeHeader(this, 3, 'BosqueEscena'); // 3 vidas iniciales
    this.player = this.physics.add
      .image(width - 600, height - 250, 'botereciclaje')
      .setOrigin(0, 0)
      .setScale(0.3)
      .setVisible(false);
    this.dialogB = new DialogueBox(
      this,
      'game1',
      async () => {
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
        await this.dropText(
          `Ahora debes de recolectar la basura \n ${this.getNewType(
            this.currentSkinIndex
          )}!`
        ).then(() => {
          this.elementsGame();
        });
      },
      'center'
    );
  }

  elementsGame() {
    this.player.setVisible(true);
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

    this.time.addEvent({
      delay: 10000, // cada 1 segundo
      loop: true,
      callback: () => {
        if (!this.stop) {
          this.crearItemsFalling();
        }
      },
    });
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

    const usedX = this.targets.map((t) => Math.round(t.x));
    const availableSlots = possibleSlots.filter((x) => !usedX.includes(x));

    for (let i = 0; i < itemsFalling.length; i++) {
      if (availableSlots.length === 0) break;

      const x = availableSlots.pop();
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
    if (!this.player || !this.cursor) return;

    this.targets = this.targets.filter((item) => {
      if (item.y > this.cameras.main.height) {
        item.destroy();
        return false;
      }
      return true;
    });

    // Movimiento horizontal
    const { left, right, up, down } = this.cursor;
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

  getRandomX() {
    return Math.floor(Math.random() * (width - 100));
  }

  async targetHit(basura, config) {
    const currentBote = this.player.texture.key;
    const sinBote = currentBote.replace('bote', '');
    this.collectedCount++;

    // ✅ Cuando recolecta 10
    if (this.collectedCount >= 10) {
      this.pauseInProgress = true;

      // ❌ Eliminar todos los ítems actuales
      this.targets.forEach((obj) => obj.destroy());
      this.targets = [];
      this.changeBote();
      await this.dropText(
        `Ahora debes de recolectar la basura \n ${this.getNewType(
          this.currentSkinIndex
        )}!`
      ).then(() => {
        //this.changeBote();
        this.speedDown += this.speedIncrement;
        console.log('⬇️ Nueva velocidad:', this.speedDown);

        // Aplicar nueva velocidad a todos los objetos en pantalla
        this.targets.forEach((item) => {
          item.setVelocityY(this.speedDown);
        });
      });

      this.collectedCount = 0;
      this.pauseInProgress = false;

      // ✅ Generar nuevos ítems
      this.crearItemsFalling();
    }

    basura.destroy();

    if (config.type === 'score') {
      let deltaText = null;
      if (sinBote === config.tag) {
        this.points += config.value;
        deltaText = `+${config.value}`;
      } else {
        if (this.points === 0) return;
        this.points -= config.value;
        deltaText = `-${config.value}`;
      }

      window.localStorage.setItem('highscore', this.points.toString());
      this.updateScoreText();

      // Mostrar texto flotante sobre el jugador
      const feedback = this.add
        .text(
          this.player.x + this.player.width / 2,
          this.player.y - 20,
          deltaText,
          {
            fontSize: '24px',
            fontStyle: 'bold',
            color: sinBote === config.tag ? '#00ff00' : '#ff0000',
            stroke: '#000000',
            strokeThickness: 2,
          }
        )
        .setOrigin(0.5)
        .setDepth(200);

      this.tweens.add({
        targets: feedback,
        y: feedback.y - 30,
        alpha: 0,
        duration: 1000,
        ease: 'Power1',
        onComplete: () => feedback.destroy(),
      });
    } else {
      this.someDamageFunction();
    }
  }

  getNewType(type) {
    switch (type) {
      case 1:
        return 'ORGANICA';
      case 2:
        return 'NO RECICLABLE';
      case 0:
        return 'RECICLABLE';
      default:
        return 'TODO TIPO DE BASURA';
    }
  }

  updateScoreText() {
    this.scoreText.setText(`Puntaje: ${this.points}`);
  }

  async someDamageFunction() {
    const shotModal = this.header.updateLives();
    console.log(shotModal);
  }

  pauseItems() {
    this.stop = true;
    this.targets.forEach((item) => {
      item.body.setVelocity(0, 0);
    });
  }

  // ✅ Reanudar caída
  resumeItems() {
    this.stop = false;
    this.targets.forEach((item) => {
      item.setVelocityY(this.speedDown);
    });
  }

  changeBote() {
    //let currentSkinIndex = 0;
    this.currentSkinIndex = (this.currentSkinIndex + 1) % boteSkins.length;
    const newSkin = boteSkins[this.currentSkinIndex];

    this.player.setTexture(newSkin);
  }

  dropText(message: string): Promise<void> {
    return new Promise((resolve) => {
      const tempText = this.add
        .text(0, 0, message, {
          fontSize: '32px',
          color: '#ffffff',
          fontStyle: 'bold',
          padding: { x: 10, y: 5 },
          align: 'center',
          wordWrap: { width: this.cameras.main.width * 0.8 },
        })
        .setOrigin(0.5);

      // Medidas basadas en el texto
      const { width, height } = tempText;
      const bg = this.add.graphics();
      bg.fillStyle(0x000000, 0.8); // Negro con 80% de opacidad
      bg.fillRoundedRect(
        this.cameras.main.centerX - width / 2 - 10,
        -50 - height / 2 - 5,
        width + 20,
        height + 10,
        10
      );

      // Reubica el texto en el centro
      tempText.setPosition(this.cameras.main.centerX, -50);

      // Agrupa para animar juntos
      const container = this.add.container(0, 0, [bg, tempText]);

      this.tweens.add({
        targets: container,
        y: this.cameras.main.centerY + 50,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
          this.time.delayedCall(1500, () => {
            container.destroy();
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
