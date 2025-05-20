import Phaser from 'phaser';
import Swal from 'sweetalert2';

export class LifeScene extends Phaser.Scene {
  hero: any;
  lives: number = 3;
  heartImages: Phaser.GameObjects.Image[] = [];
  private teclaL!: Phaser.Input.Keyboard.Key;
  currentOverlappingTriggers: Set<any>;

  constructor() {
    super({ key: 'LifeScene' });
  }

  init(data) {
    this.hero = data.hero;
    this.lives = data.lives || 3;
    this.heartImages = [];
  }

  preload() {
    // Cargar cualquier asset adicional aquí
  }

  create() {
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add
        .image(750 - i * 40, 30, 'vida_fondo')
        .setScrollFactor(0)
        .setDepth(100)
        .setScale(0.5)
        .setOrigin(0.5);
      this.heartImages.push(heart);
    }
    this.currentOverlappingTriggers = new Set();
    this.teclaL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
  }

  update() {
    this.currentOverlappingTriggers.forEach((trigger) => {
      if (
        !Phaser.Geom.Intersects.RectangleToRectangle(
          this.hero.getBounds(),
          trigger.getBounds()
        )
      ) {
        this.currentOverlappingTriggers.delete(trigger);
        (trigger as any).used = false;
      }
    });

    if (Phaser.Input.Keyboard.JustDown(this.teclaL)) {
      this.perderVida();
    }
  }

  perderVida() {
    if (this.lives > 0) {
      this.lives--;
      // Cambiar el color del corazón perdido a negro
      this.heartImages[this.lives].setTint(0x000000);
      this.cameras.main.shake(100, 0.02);
    }

    if (this.lives <= 0) {
      Swal.fire({
        title: '¡Game Over!',
        text: '¿Quieres reiniciar el juego?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Reiniciar',
        cancelButtonText: 'Salir',
      }).then((result) => {
        if (result.isConfirmed) {
          this.lives = 3;
          // Restaurar corazones: quitar tinte y hacer visibles
          this.heartImages.forEach((h) => {
            h.setVisible(true);
            h.clearTint();
          });
        } else {
          this.game.destroy(true);
        }
      });
    }
  }
}
