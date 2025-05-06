const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function create() {
    // Inicializar vidas
    this.lives = 3;
    
    // Texto para mostrar vidas
    this.livesText = this.add.text(20, 20, 'Vidas: ' + this.lives, {
        fontSize: '24px',
        fill: '#fff'
    });

    // Configurar tecla (usaremos la tecla 'L' como ejemplo)
    this.tecla = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
}

function update() {
    // Verificar si se presionó la tecla L
    if (Phaser.Input.Keyboard.JustDown(this.tecla)) {
        if (this.lives > 0) {
            this.lives--; // Quitar una vida
            this.livesText.setText('Vidas: ' + this.lives);
            
            // Efecto visual al perder vida
            this.cameras.main.shake(100, 0.02);
        }

        // Cuando se acaban las vidas
        if (this.lives <= 0) {
            // Mostrar alerta
            const reiniciar = confirm('¡Game Over! ¿Quieres reiniciar?');
            
            if (reiniciar) {
                this.lives = 3; // Reiniciar contador
                this.livesText.setText('Vidas: ' + this.lives);
            } else {
                // Opcional: Cerrar el juego
                this.game.destroy(true);
            }
        }
    }
}