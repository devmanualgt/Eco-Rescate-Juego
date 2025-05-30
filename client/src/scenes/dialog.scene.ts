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
  private textSpeed: number = 50;
  private fullMessageShown = false;
  private textIntervalId: ReturnType<typeof setInterval> | null = null;

  private dialogueImage?: Phaser.GameObjects.Image;

  onComplete?: (stop: boolean) => void;
  position;

  constructor(
    scene: Phaser.Scene,
    dialogueKey: string,
    onComplete?: (stop: boolean) => void, // ✅ Ahora espera un parámetro booleano
    position: 'center' | 'bottom' = 'bottom' // nueva propiedad
  ) {
    this.scene = scene;
    this.onComplete = onComplete;
    this.position = position;
    const dialoguesData = dialogues();
    this.dialogueData = dialoguesData[dialogueKey] || dialoguesData.home;
    this.currentNode = this.dialogueData.start || 'start';

    this.createDialogueBox();
    this.showDialogueNode(this.currentNode);
  }

  private createDialogueBox() {
    const { width, height } = this.scene.cameras.main;

    const boxHeight = 250;
    const yOffset =
      this.position === 'center'
        ? height / 2 - boxHeight / 2
        : height - boxHeight - 20;

    this.dialogueBox = this.scene.add.graphics();
    this.dialogueBox.setScrollFactor(0);
    this.dialogueBox.fillStyle(0x000000, 0.8);
    this.dialogueBox.fillRoundedRect(50, yOffset, width - 100, boxHeight, 10);

    this.characterIndicator = this.scene.add.circle(
      90,
      yOffset + 50,
      20,
      0xffffff
    );
    this.characterIndicator.setScrollFactor(0);

    this.characterNameText = this.scene.add.text(width / 2, yOffset + 20, '', {
      fontSize: '20px',
      color: '#fff',
      wordWrap: { width: width * 0.8 },
      lineSpacing: 20,
      padding: { x: 30, y: 20 },
      align: 'center',
    });
    this.characterNameText.setOrigin(0.5, 0); // Centrado horizontal, top alineado
    this.characterNameText.setScrollFactor(0);

    this.dialogueText = this.scene.add.text(width / 2, yOffset + 70, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: width * 0.8 },
      padding: { x: 30, y: 20 },
      lineSpacing: 10,
      align: 'center',
    });
    this.dialogueText.setOrigin(0.5, 0);
    this.dialogueText.setScrollFactor(0);

    this.optionButtons = this.scene.add.group();
  }

  private showDialogueNode(nodeKey: string) {
    const node = this.dialogueData.nodes[nodeKey];
    if (!node) return;

    this.currentNode = nodeKey;
    this.characterNameText.setText(node.titulo || '');
    this.optionButtons.clear(true, true);

    this.dialogueText.setText('');
    this.fullMessageShown = false;
    this.scene.sound.stopByKey('typing');
    this.typeTextEffect(node.text);

    if (this.dialogueImage) {
      this.dialogueImage.destroy(); // eliminar la anterior si existía
      this.dialogueImage = undefined;
    }

    if (node.img) {
      const { width, height } = this.scene.cameras.main;

      const yOffset =
        this.position === 'center' ? height / 2 - 250 / 2 : height - 250 - 20;

      this.dialogueImage = this.scene.add
        .image(width - 150, yOffset + 125, node.img)
        .setOrigin(0.5, 0)
        .setScale(0.3)
        .setScrollFactor(0);

      this.scene.tweens.add({
        targets: this.dialogueImage,
        y: '+=10',
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    const options = node.options.slice(0, 2);
    const { width, height } = this.scene.cameras.main;
    const buttonWidth = 140;
    const spacing = 20;
    const totalWidth =
      options.length * buttonWidth + (options.length - 1) * spacing;
    const startX = width / 2 - totalWidth / 2;
    // const buttonY = height - 60;
    const boxHeight = 150;

    const buttonY =
      this.position === 'center'
        ? height / 2 + boxHeight / 2
        : height - boxHeight + 70;

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
            this.destroy(true); // Ocultar el diálogo
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
                    this.scene.scene.start(option.next); //
                  });
                },
              });
            } else {
              // En caso de que no exista postFX pixelate
              this.scene.scene.start(option.next);
            }
          } else {
            if (option.next === '') {
              this.destroy(false);
            } else {
              this.showDialogueNode(option.next);
            }
          }
        });
      btn.setScrollFactor(0); // <- Aquí

      this.optionButtons.addMultiple([bg, btn]);
    });

    if (options.length === 0) {
      this.scene.time.delayedCall(1500, () => this.destroy(false));
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

  destroy(stop) {
    if (this.dialogueImage) {
      this.dialogueImage.destroy();
      this.dialogueImage = undefined;
    }
    this.dialogueBox.destroy();
    this.characterIndicator.destroy();
    this.characterNameText.destroy();
    this.dialogueText.destroy();
    this.optionButtons.clear(true, true);
    if (this.textIntervalId) clearInterval(this.textIntervalId);
    this.scene.sound.stopByKey('typing');
    console.log(stop);

    if (this.onComplete) {
      this.onComplete(stop); // <- Aquí se llama al callback cuando finaliza
    }
  }
}
