import Phaser from 'phaser';
import { dialogues } from '../utils/dialog';
export class DialogueBox {
  private scene: Phaser.Scene;
  private dialogueData: any;
  private currentNode: string;
  private dialogueBox: Phaser.GameObjects.Graphics;
  private characterNameText: Phaser.GameObjects.Text;
  private dialogueText: Phaser.GameObjects.Text;
  private optionButtons: Phaser.GameObjects.Group;
  private characterIndicator: Phaser.GameObjects.Arc;
  private textSpeed: number = 25;
  private fullMessageShown = false;
  private textIntervalId: ReturnType<typeof setInterval> | null = null;
  private onComplete?: () => void;

  constructor(
    scene: Phaser.Scene,
    dialogueKey: string,
    onComplete?: () => void
  ) {
    this.scene = scene;
    this.onComplete = onComplete;

    const dialoguesData = dialogues();
    this.dialogueData = dialoguesData[dialogueKey] || dialoguesData.home;
    this.currentNode = this.dialogueData.start || 'start';

    this.createDialogueBox();
    this.showDialogueNode(this.currentNode);
  }

  private createDialogueBox() {
    const { width, height } = this.scene.cameras.main;

    this.dialogueBox = this.scene.add.graphics();
    this.dialogueBox.setScrollFactor(0); // <- Aquí

    this.dialogueBox.fillStyle(0x000000, 0.8);
    this.dialogueBox.fillRoundedRect(50, height - 170, width - 100, 150, 10);

    this.characterIndicator = this.scene.add.circle(
      70,
      height - 140,
      10,
      0xffffff
    );
    this.characterIndicator.setScrollFactor(0); // <- Aquí

    this.characterNameText = this.scene.add.text(100, height - 150, '', {
      fontSize: '20px',
      color: '#fff',
      wordWrap: { width: width - 140 },
    });
    this.characterNameText.setScrollFactor(0); // <- Aquí

    this.dialogueText = this.scene.add.text(120, height - 120, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: width - 140 },
    });
    this.dialogueText.setScrollFactor(0); // <- Aquí

    this.optionButtons = this.scene.add.group();
  }

  private showDialogueNode(nodeKey: string) {
    const node = this.dialogueData.nodes[nodeKey];
    if (!node) return;

    this.currentNode = nodeKey;
    this.characterNameText.setText(node.personaje || '');
    this.optionButtons.clear(true, true);

    this.dialogueText.setText('');
    this.fullMessageShown = false;

    this.scene.sound.stopByKey('typing');
    this.typeTextEffect(node.text);

    const options = node.options.slice(0, 2);
    const { width, height } = this.scene.cameras.main;
    const buttonWidth = 140;
    const spacing = 20;
    const totalWidth =
      options.length * buttonWidth + (options.length - 1) * spacing;
    const startX = width / 2 - totalWidth / 2;
    const buttonY = height - 60;

    options.forEach((option, index) => {
      const x = startX + index * (buttonWidth + spacing);
      const bg = this.scene.add.graphics();
      bg.setScrollFactor(0); // <- Aquí

      bg.fillStyle(0x444444, 1);
      bg.fillRoundedRect(x, buttonY, buttonWidth, 40, 10);

      const btn = this.scene.add
        .text(x + buttonWidth / 2, buttonY + 20, option.text, {
          fontSize: '16px',
          color: '#ffffff',
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          if (option.scena) {
            const pixelated =
              this.scene.cameras.main.postFX?.addPixelate?.(1) ?? null;

            if (pixelated) {
              this.scene.add.tween({
                targets: pixelated,
                duration: 700,
                amount: 40,
                onComplete: () => {
                  this.scene.cameras.main.fadeOut(100);

                  this.scene.time.delayedCall(150, () => {
                    this.scene.scene.start(option.next); // <- usa el valor en option.scena
                  });
                },
              });
            } else {
              // En caso de que no exista postFX pixelate
              this.scene.scene.start(option.next);
            }
            this.destroy(); // Ocultar el diálogo
          } else {
            if (option.next === '') {
              this.destroy(); // Ocultar el diálogo
              //this.sound.stopByKey('typing');
              //this.scene.stop(); // Cierra el diálogo
            } else {
              this.showDialogueNode(option.next);
            }
          }

          /* if (option.next === '') {
            this.destroy(); // Ocultar el diálogo
          } else {
            this.showDialogueNode(option.next);
          } */
        });
      btn.setScrollFactor(0); // <- Aquí

      this.optionButtons.addMultiple([bg, btn]);
    });

    if (options.length === 0) {
      this.scene.time.delayedCall(1500, () => this.destroy());
    }
  }

  private typeTextEffect(message: string) {
    this.scene.sound.play('typing', { loop: true, volume: 0.5 });

    let charIndex = 0;
    this.dialogueText.setText('');
    this.textIntervalId = setInterval(() => {
      this.dialogueText.text += message[charIndex++];
      if (charIndex >= message.length) {
        clearInterval(this.textIntervalId!);
        this.fullMessageShown = true;
        this.scene.sound.stopByKey('typing');
      }
    }, this.textSpeed);
  }

  destroy() {
    this.dialogueBox.destroy();
    this.characterIndicator.destroy();
    this.characterNameText.destroy();
    this.dialogueText.destroy();
    this.optionButtons.clear(true, true);
    if (this.textIntervalId) clearInterval(this.textIntervalId);
    this.scene.sound.stopByKey('typing');

    if (this.onComplete) {
      this.onComplete(); // <- Aquí se llama al callback cuando finaliza
    }
  }
}
