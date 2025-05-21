// ui/LifeHeader.ts
import Phaser from 'phaser';
import Swal from 'sweetalert2';
import { SceneManager } from '../utils/scene.manager';

export class LifeHeader {
  scene: Phaser.Scene;
  cameras: Phaser.Cameras.Scene2D.CameraManager;
  container: Phaser.GameObjects.Container;
  hearts: Phaser.GameObjects.Image[] = [];
  maxLives: number;
  backScene: string | undefined;

  constructor(scene: Phaser.Scene, lives: number, backScene?: string) {
    this.scene = scene;
    this.maxLives = lives;
    this.cameras = scene.cameras;
    this.container = scene.add.container(20, 20); // margen superior izquierdo
    this.backScene = backScene;

    this.createHearts(lives);
    if (backScene) {
      this.bntBack(this.backScene);
    }
  }

  private createHearts(lives: number) {
    for (let i = 0; i < this.maxLives; i++) {
      const heart = this.scene.add.image(750 - i * 40, 30, 'vida_fondo'); // corazón separado 40px

      heart.setScrollFactor(0);
      heart.setDepth(100);
      heart.setScale(0.5);
      heart.setOrigin(0.5);

      this.container.add(heart);
      this.hearts.push(heart);
    }

    //this.updateLives(lives);
  }

  private bntBack(backScene: string) {
    const back = this.scene.add
      .image(0, 0, 'quitButton')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    back.setInteractive();
    back.on('pointerdown', () => {
      const manager = SceneManager.getInstance(this.scene);
      manager.transitionTo('LianasScene', backScene, 'fade', 500);
    });
  }

  updateLives(lives: number) {
    /*  for (let i = 0; i < this.maxLives; i++) {
      this.hearts[i].setAlpha(i < lives ? 1 : 0.3); // vidas perdidas más opacas
    } */

    if (this.maxLives > 0) {
      this.maxLives--;
      // Cambiar el color del corazón perdido a negro
      this.hearts[this.maxLives].setTint(0x000000);
      this.cameras.main.shake(100, 0.02);
    }

    if (this.maxLives <= 0) {
      Swal.fire({
        title: '¡Game Over!',
        text: '¿Quieres reiniciar el juego?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Reiniciar',
        cancelButtonText: 'Salir',
      }).then((result) => {
        if (result.isConfirmed) {
          this.maxLives = 3;
          // Restaurar corazones: quitar tinte y hacer visibles
          this.hearts.forEach((h) => {
            h.setVisible(true);
            h.clearTint();
          });
        } else {
          //this.game.destroy(true);
        }
      });
    }
  }

  hide() {
    this.container.setVisible(false);
  }

  show() {
    this.container.setVisible(true);
  }

  destroy() {
    this.container.destroy();
  }
}
