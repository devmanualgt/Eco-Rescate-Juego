import Phaser from 'phaser';
import Swal from 'sweetalert2';
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
  cheetos: { scale: 0.3, type: 'score', value: 5, tag: 'reciclaje' },
  pepsi: { scale: 0.3, type: 'score', value: 5, tag: 'reciclaje' },
  tortix: { scale: 0.3, type: 'score', value: 5, tag: 'reciclaje' },
  cereza: { scale: 1, type: 'damage', value: 1, tag: 'bien' },
  limon: { scale: 1, type: 'damage', value: 1, tag: 'bien' },
  hoja: { scale: 0.1, type: 'damage', value: 1, tag: 'bien' },
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
  playerSpeed = this.speedDown + 100;
  targets = [];
  points = +window.localStorage.getItem('highscore') || 0;

  // Agrega esto en tu clase
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

  private crearItemsFalling() {
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

  // ✅ Pausar caída de ítems
  pauseItems() {
    this.targets.forEach((item) => {
      item.body.setVelocity(0, 0);
    });
  }

  // ✅ Reanudar caída
  resumeItems() {
    this.targets.forEach((item) => {
      item.setVelocityY(this.speedDown);
    });
  }

  // ✅ Mostrar texto que cae y desaparece
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

  pauseGame() {
    this.physics.world.pause(); // Pausa física
    this.player.setVelocity(0, 0);
    this.targets.forEach((item) => item.setVelocity(0, 0));
    this.input.keyboard.enabled = false;
  }

  resumeGame() {
    this.physics.world.resume();
    this.input.keyboard.enabled = true;

    // Reanuda caída de objetos
    this.targets.forEach((item) => {
      item.setVelocityY(this.speedDown);
    });
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

  update() {
    const { left, right } = this.cursor;
    if (this.player) {
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
