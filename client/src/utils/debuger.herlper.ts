import Phaser from 'phaser';

export class DebugHelper {
  private scene: Phaser.Scene;
  private debugGraphics: Phaser.GameObjects.Graphics[] = [];
  private showCollisions = false;
  private showGrid = false;
  private layers: Phaser.Tilemaps.TilemapLayer[];
  private keyCombination: Phaser.Input.Keyboard.Key[];

  constructor(scene: Phaser.Scene, layers: Phaser.Tilemaps.TilemapLayer[]) {
    this.scene = scene;
    this.layers = layers;

    // ⬇ Registrar combinación de teclas: Ctrl + C
    this.keyCombination = [
      this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL),
      this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
    ];

    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
  }

  update() {
    // Detectar combinación de teclas: Ctrl + C
    if (
      Phaser.Input.Keyboard.JustDown(this.keyCombination[1]) &&
      this.scene.input.keyboard.checkDown(this.keyCombination[0], 250)
    ) {
      this.showCollisions = !this.showCollisions;
      this.toggleCollisions();
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.scene.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.G]
      )
    ) {
      this.showGrid = !this.showGrid;
      this.toggleGrid();
    }
  }

  toggleCollisions() {
    if (!this.showCollisions) {
      this.debugGraphics.forEach((g) => g.destroy());
      this.debugGraphics = [];
      return;
    }

    const colors = [
      new Phaser.Display.Color(0, 255, 0, 255),
      new Phaser.Display.Color(255, 255, 0, 255),
      new Phaser.Display.Color(255, 0, 0, 255),
      new Phaser.Display.Color(0, 0, 255, 255),
      new Phaser.Display.Color(255, 0, 255, 255),
    ];

    this.layers.forEach((layer, index) => {
      if (!layer) return;

      const graphics = this.scene.add.graphics();
      this.debugGraphics.push(graphics);

      const color = colors[index % colors.length];

      layer.renderDebug(graphics, {
        tileColor: null,
        collidingTileColor: null,
        faceColor: color,
      });
    });
  }

  toggleGrid() {
    this.debugGraphics.forEach((g) => g.clear());
    if (!this.showGrid) return;

    const gridGraphics = this.scene.add.graphics();
    this.debugGraphics.push(gridGraphics);

    gridGraphics.lineStyle(1, 0xffffff, 0.3);
    const tileSize = 16 * 2.5;
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    for (let x = 0; x < width; x += tileSize) {
      gridGraphics.moveTo(x, 0).lineTo(x, height);
    }
    for (let y = 0; y < height; y += tileSize) {
      gridGraphics.moveTo(0, y).lineTo(width, y);
    }
    gridGraphics.strokePath();
  }
}
