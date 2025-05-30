import Phaser from 'phaser';
import { SceneManager } from '../utils/scene.manager';

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {}

  create() {
    this.time.delayedCall(500, () => {
      this.registry.set('highscore', 0);
      const score = this.registry.get('highscore');

      const textStyle = {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
      };

      this.add.image(512, 384, 'background');

      this.add.particles(512, 300, 'flares', {
        frame: 'white',
        color: [0x96e0da, 0x937ef3],
        colorEase: 'quart.out',
        lifespan: 2500,
        angle: { min: -140, max: -40 },
        scale: { start: 1, end: 0, ease: 'sine.in' },
        speed: { min: 150, max: 200 },
        advance: 2000,
        frequency: 100,
        blendMode: 'ADD',
      });

      // ✅ Agregar sprite animado del héroe
      const hero = this.add.sprite(512, 540, 'hero');
      hero.setScale(5);

      // ✅ Animación tipo "respiración" o rebote
      this.tweens.add({
        targets: hero,
        y: '+=10',
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      const logo = this.add.image(512, -500, 'logo');
      logo.setScale(0.5);
      this.tweens.add({
        targets: logo,
        y: 300,
        duration: 1000,
        ease: 'Bounce',
      });

      this.add.text(32, 32, `Punteo máximo: ${score}`, textStyle);

      const instructions = ['', '', '', 'Click para empezar!'];

      this.add
        .text(512, 550, instructions, textStyle)
        .setAlign('center')
        .setOrigin(0.5);

      this.input.once('pointerdown', () => {
        const manager = SceneManager.getInstance(this);
        manager.transitionTo('Preloader', 'BosqueEscena', 'fade', 500);
      });

      window.localStorage.setItem('showHistory', 'true');
    });
  }
}
