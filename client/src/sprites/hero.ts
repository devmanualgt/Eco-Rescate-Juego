import Phaser from 'phaser';

export class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(3);
    this.setCollideWorldBounds(true);
  }

  move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.setVelocity(0);

    if (cursors.right.isDown) {
      this.setVelocityX(100);
      this.play('walk-right', true);
    } else if (cursors.left.isDown) {
      this.setVelocityX(-100);
      this.play('walk-left', true);
    } else if (cursors.up.isDown) {
      this.setVelocityY(-100);
      this.play('walk-back', true);
    } else if (cursors.down.isDown) {
      this.setVelocityY(100);
      this.play('walk-front', true);
    }
  }
}
