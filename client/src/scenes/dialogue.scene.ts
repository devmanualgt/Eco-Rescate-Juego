import Phaser from 'phaser';

export class DialogueScene extends Phaser.Scene {
  dialogueData: any;
  currentNode: any;
  dialogueBox: Phaser.GameObjects.Graphics;
  dialogueText: Phaser.GameObjects.Text;
  characterNameText: Phaser.GameObjects.Text;
  optionButtons: Phaser.GameObjects.Group;

  textSpeed: number;
  currentTextEvent: Phaser.Time.TimerEvent | null;
  fullMessageShown: boolean;

  constructor() {
    super({ key: 'DialogueScene' });

    this.dialogueData = null;
    this.currentNode = null;

    this.textSpeed = 25; // Velocidad de escritura (ms por letra)
    this.currentTextEvent = null;
    this.fullMessageShown = false;
  }

  init(data) {
    this.dialogueData = data.dialogueData || {};
    this.currentNode = data.startNode || 'start';
  }

  create() {
    this.createDialogueBox();
    this.showDialogueNode(this.currentNode);
  }

  createDialogueBox() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.dialogueBox = this.add.graphics();
    this.dialogueBox.fillStyle(0x000000, 0.8);
    this.dialogueBox.fillRoundedRect(50, height - 170, width - 100, 150, 10);

    this.characterNameText = this.add.text(70, height - 140, '', {
      fontSize: '18px',
      color: '#fff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    });

    this.dialogueText = this.add.text(70, height - 120, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: width - 140 },
    });

    this.optionButtons = this.add.group();
  }

  showDialogueNode(nodeKey) {
    const node = this.dialogueData.nodes[nodeKey];
    if (!node) return;

    this.currentNode = nodeKey;
    this.characterNameText.setText(this.dialogueData.character || '');
    this.optionButtons.clear(true, true);

    // Cancelar texto anterior si se está escribiendo
    if (this.currentTextEvent) {
      this.currentTextEvent.remove(false);
    }

    this.dialogueText.setText('');
    this.fullMessageShown = false;
    this.typeTextEffect(node.text);

    // Limitar a 2 opciones como máximo
    const options = node.options.slice(0, 2);

    const buttonWidth = 140;
    const buttonHeight = 40;
    const spacing = 20;
    const totalWidth =
      options.length * buttonWidth + (options.length - 1) * spacing;
    const startX = this.cameras.main.centerX - totalWidth / 2;
    const buttonY = this.cameras.main.height - 60;

    options.forEach((option, index) => {
      const x = startX + index * (buttonWidth + spacing);

      const buttonBg = this.add.graphics();
      buttonBg.fillStyle(0x444444, 1);
      buttonBg.fillRoundedRect(x, buttonY, buttonWidth, buttonHeight, 10);

      const buttonText = this.add
        .text(x + buttonWidth / 2, buttonY + buttonHeight / 2, option.text, {
          fontSize: '16px',
          color: '#ffffff',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.showDialogueNode(option.next);
        });

      this.optionButtons.addMultiple([buttonBg, buttonText]);
    });

    if (options.length === 0) {
      this.time.delayedCall(1500, () => this.scene.stop());
    }
  }

  typeTextEffect(message: string) {
    let charIndex = 0;
    this.dialogueText.setText('');

    this.currentTextEvent = this.time.addEvent({
      delay: this.textSpeed,
      repeat: message.length - 1,
      callback: () => {
        this.dialogueText.text += message[charIndex++];
        if (charIndex >= message.length) {
          this.fullMessageShown = true;
        }
      },
    });
  }
}
