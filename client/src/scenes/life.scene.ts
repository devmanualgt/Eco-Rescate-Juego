import 'phaser';

export class LifeScene extends Phaser.Scene {
    private lives!: number;
    private heartImages: Phaser.GameObjects.Image[] = [];
    private tecla!: Phaser.Input.Keyboard.Key;
    

    constructor() {
        super({ key: 'LifeScene',active:false });
       
    }

    preload() {
        this.load.image('heart', 'assets/heart.png');
        this.load.image('tiles', 'assets/tileset.png');
        this.load.image('character', 'assets/player.png');
        // Cargar cualquier asset adicional aquí
    }

    create() {
        this.lives = 3;

       

        // Crear corazones en HUD (esquina superior izquierda por ejemplo)
        for (let i = 0; i < this.lives; i++) {
            const heart = this.add.image(750 - (i * 40), 30, 'heart')
                .setScrollFactor(0)     //  Fijar en pantalla
                .setDepth(100)          // Asegurar que estén al frente
                .setScale(0.5)
                .setOrigin(0.5);
            this.heartImages.push(heart);
        }

        // Tecla para simular pérdida de vida
        this.tecla = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.tecla)) {
            if (this.lives > 0) {
                this.lives--;
                this.heartImages[this.lives].setVisible(false);
                this.cameras.main.shake(100, 0.02);
            }

            if (this.lives <= 0) {
                const reiniciar = confirm('¡Game Over! ¿Quieres reiniciar?');
                if (reiniciar) {
                    this.lives = 3;
                    this.heartImages.forEach(h => h.setVisible(true));
                } else {
                    this.game.destroy(true);
                }
            }
        }
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [LifeScene]
};

new Phaser.Game(config);
