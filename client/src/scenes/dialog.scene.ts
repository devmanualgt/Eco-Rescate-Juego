import Phaser from 'phaser';
import { dialogues } from '../utils/dialog';
import { SceneManager } from '../utils/scene.manager';

export class DialogueScene extends Phaser.Scene {
  dialogueData: any;
  currentNode: any;
  trigger: any;
  dialogueBox: Phaser.GameObjects.Graphics;
  dialogueTitle: Phaser.GameObjects.Text;
  characterNameText: Phaser.GameObjects.Text;
  dialogueText: Phaser.GameObjects.Text;
  optionButtons: Phaser.GameObjects.Group;
  characterIndicator: Phaser.GameObjects.Arc;

  textSpeed: number;
  currentTextEvent: Phaser.Time.TimerEvent | null;
  fullMessageShown: boolean;

  constructor() {
    super({ key: 'DialogueScene' });

    this.dialogueData = null;
    this.currentNode = null;
    this.trigger = null;

    this.textSpeed = 25; // Velocidad de escritura (ms por letra)
    this.currentTextEvent = null;
    this.fullMessageShown = false;
  }

  init(data) {
    this.trigger = dialogues()[data.trigger] || dialogues().home;

    this.dialogueData = this.trigger || {};
    this.currentNode = this.trigger.start || 'start';
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

    // Indicador visual del personaje (círculo)
    this.characterIndicator = this.add.circle(70, height - 140, 10, 0xffffff); // blanco por defecto

    // Texto del nombre del personaje
    this.characterNameText = this.add.text(100, height - 150, '', {
      fontSize: '20px',
      color: '#fff',
      wordWrap: { width: width - 140 },
    });

    // Texto del diálogo
    this.dialogueText = this.add.text(120, height - 120, '', {
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
    this.characterNameText.setText(node.personaje || '');
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
          if (option.scena) {
            const manager = SceneManager.getInstance(this);
            manager.transitionTo('BosqueEscena', option.next, 'fade', 500);
          } else {
            if (option.next === '') {
              console.log('close');

              this.scene.stop(); // Cierra el diálogo
            } else {
              this.showDialogueNode(option.next);
            }
          }
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
