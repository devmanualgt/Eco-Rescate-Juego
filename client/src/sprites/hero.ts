import Phaser from 'phaser';

export class Hero extends Phaser.Physics.Arcade.Sprite {
  lastDirection: string;
  inputEnabled = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(3);
    this.play('respirar', true);

    this.setCollideWorldBounds(true);
  }

  move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!this.inputEnabled) return;

    this.setVelocity(0);

    if (cursors.right.isDown) {
      this.setVelocityX(100);
      this.play('walk-right', true);
      this.lastDirection = 'right';
    } else if (cursors.left.isDown) {
      this.setVelocityX(-100);
      this.play('walk-left', true);
      this.lastDirection = 'left';
    } else if (cursors.up.isDown) {
      this.setVelocityY(-100);
      this.play('walk-back', true);
      this.lastDirection = 'back';
    } else if (cursors.down.isDown) {
      this.setVelocityY(100);
      this.play('walk-front', true);
      this.lastDirection = 'front';
    } else {
      // Si no se está moviendo, usar la animación de "respirar" según la última dirección
      switch (this.lastDirection) {
        case 'front':
          this.play('respirar', true);
          break;
        case 'back':
          this.play('respirar-back', true);
          break;
        case 'left':
          this.play('respirar-left', true);
          break;
        case 'right':
          this.play('respirar-right', true);
          break;
      }
    }
  }
}
