import Phaser from 'phaser';

export class DialogueScene extends Phaser.Scene {
  dialogueData: any;
  currentNode: any;
  dialogueBox: Phaser.GameObjects.Graphics;
  dialogueText: any;
  optionButtons: any;
  constructor() {
    super({ key: 'DialogueScene' });

    this.dialogueData = null; // Se establecerá cuando se inicie la escena
    this.currentNode = null; // Nodo actual del diálogo
  }

  init(data) {
    this.dialogueData = data.dialogueData || {}; // Recibe datos externos
    this.currentNode = data.startNode || 'start';
  }

  create() {
    this.createDialogueBox();
    this.showDialogueNode(this.currentNode);
  }

  createDialogueBox() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fondo del cuadro de diálogo
    this.dialogueBox = this.add.graphics();
    this.dialogueBox.fillStyle(0x000000, 0.8);
    this.dialogueBox.fillRoundedRect(50, height - 150, width - 100, 100, 10);

    // Texto del diálogo
    this.dialogueText = this.add.text(70, height - 140, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: width - 140 },
    });

    // Grupo para opciones
    this.optionButtons = this.add.group();
  }

  showDialogueNode(nodeKey) {
    const node = this.dialogueData.nodes[nodeKey];
    //console.log(node);

    if (!node) return;

    this.currentNode = 'Abrir';
    this.dialogueText.setText(node.text);

    // Limpiar opciones anteriores
    this.optionButtons.clear(true, true);

    let buttonY = this.cameras.main.height - 110;

    if (node.options.length === 0) {
      // Si no hay opciones, cerrar la escena al hacer clic
      this.time.delayedCall(1500, () => this.scene.stop()); // Cierra después de 1.5s
      return;
    }

    node.options.forEach((option) => {
      let button = this.add
        .text(70, buttonY, `> ${option.text}`, {
          fontSize: '16px',
          color: '#00ff00',
        })
        .setInteractive()
        .on('pointerdown', () => {
          this.showDialogueNode(option.next);
          //console.log('Option clicked:', option.next);
        });

      /*    this.input.keyboard.on('keydown', function (event) {
            console.log('Key code: ' + event.keyCode);
        } */

      this.optionButtons.add(button);
      buttonY += 25;
    });
  }
}
