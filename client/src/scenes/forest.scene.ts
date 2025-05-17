import Phaser from 'phaser';
import Swal from 'sweetalert2';
import { Hero } from '../sprites/hero';
import { DebugHelper } from '../utils/debuger.herlper';

export class BosqueEscena extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  hero!: Hero;
  debugHelper: DebugHelper;
  map!: Phaser.Tilemaps.Tilemap;
  layers: Phaser.Tilemaps.TilemapLayer[] = [];
  dialogueTriggers: any;

  lives: number = 3;
  heartImages: Phaser.GameObjects.Image[] = [];
  private teclaL!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('BosqueEscena');
  }

  preload() {
    this.load.spritesheet('map', 'assets/tilemaps/map.png', {
      frameWidth: 16,
      frameHeight: 15,
    });

    this.load.tilemapTiledJSON('forest', 'assets/tilemaps/map01.json');
    this.load.image('heart', 'assets/heart.png');

    this.load.aseprite({
      key: 'hero',
      textureURL: 'assets/sprites/hero-frames.png',
      atlasURL: 'assets/sprites/hero-frames.json',
    });
    // Carga del sprite de corazón rojo original
    this.load.image('vida_fondo', 'assets/ui/vida.png');
  }

  create() {
    const map = this.make.tilemap({ key: 'forest' });
    const tileset = map.addTilesetImage('map', 'map');

    const layersConfig = [
      { name: 'water', collision: [173, 174] },
      { name: 'land', collision: null },
      { name: 'tree0', collision: [35, 37, 63, 64, 65] },
      { name: 'tree1', collision: { start: 8, end: 63 } },
      { name: 'tree2', collision: [36] },
      { name: 'boxes', collision: { start: 231, end: 260 } },
    ];

    layersConfig.forEach((config) => {
      const layer = map.createLayer(config.name, tileset, 0, 0)?.setScale(2.5);
      if (layer) {
        this.layers[config.name] = layer;
        if (config.collision) {
          if (Array.isArray(config.collision)) {
            layer.setCollision(config.collision);
          } else {
            layer.setCollisionBetween(config.collision.start, config.collision.end);
          }
        }
      }
    });

    this.hero = new Hero(this, 512, 384);

    // Crear corazones (vivos = rojos)
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add.image(750 - i * 40, 30, 'vida_fondo')
        .setScrollFactor(0)
        .setDepth(100)
        .setScale(0.5)
        .setOrigin(0.5);
      this.heartImages.push(heart);
    }

    Object.values(this.layers).forEach((layer) => {
      if (layer) this.physics.add.collider(this.hero, layer);
    });

    this.anims.createFromAseprite('hero', [
      'respirar',
      'respirar-right',
      'respirar-left',
      'respirar-back',
      'walk-right',
      'walk-left',
      'walk-front',
      'walk-back',
    ]);
    this.anims.get('respirar').repeat = -1;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.teclaL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

    this.cameras.main.setBounds(0, 0, map.widthInPixels * 2.5, map.heightInPixels * 2.45);
    this.cameras.main.startFollow(this.hero);
    this.physics.world.setBounds(0, 0, map.widthInPixels * 2.5, map.heightInPixels * 2.45);

    this.debugHelper = new DebugHelper(this, Object.values(this.layers));

    const dialogueLayer = map.getObjectLayer('boxesd');
    if (dialogueLayer) {
      this.dialogueTriggers = this.physics.add.group();

      dialogueLayer.objects.forEach((obj) => {
        const trigger = this.physics.add
          .sprite(obj.x * 2.5, obj.y * 2.5, null)
          .setOrigin(0, 1)
          .setSize(obj.width * 2.5, obj.height * 2.5)
          .setAlpha(0) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody & {
          dialogueKey: string;
        };

        trigger.dialogueKey = obj.name;
        this.dialogueTriggers.add(trigger);
      });

      this.physics.add.overlap(
        this.hero,
        this.dialogueTriggers,
        () => this.triggerDialogue('Caja1'),
        null,
        this
      );
    }
  }

  update() {
    this.debugHelper.update();
    this.hero.move(this.cursors);

    if (Phaser.Input.Keyboard.JustDown(this.teclaL)) {
      this.perderVida();
    }
  }

  private perderVida() {
    if (this.lives > 0) {
      this.lives--;
      // Cambiar el color del corazón perdido a negro
      this.heartImages[this.lives].setTint(0x000000);
      this.cameras.main.shake(100, 0.02);
    }

    if (this.lives <= 0) {
      Swal.fire({
        title: '¡Game Over!',
        text: '¿Quieres reiniciar el juego?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Reiniciar',
        cancelButtonText: 'Salir',
      }).then((result) => {
        if (result.isConfirmed) {
          this.lives = 3;
          // Restaurar corazones: quitar tinte y hacer visibles
          this.heartImages.forEach((h) => {
            h.setVisible(true);
            h.clearTint();
          });
        } else {
          this.game.destroy(true);
        }
      });
    }
  }

  triggerDialogue(trigger) {
    const key = (trigger as any).dialogueKey || 'DefaultKey';

    const dialogues = {
      Caja1: {
        start: 'Inicio',
        nodes: {
          Inicio: {
            text: '¡Encontraste una caja misteriosa!',
            options: [
              { text: 'Hola', next: 'Abrir' },
              { text: 'two', next: 'Jugar' },
            ],
          },
          Abrir: {
            text: 'Dentro hay un mensaje antiguo...',
            options: [{ text: 'Regresar', next: 'Inicio' }],
          },
          Jugar: {
            text: 'Dentro hay un mensaje antiguo...',
            options: [{ text: 'Regresar', next: 'Inicio' }],
          },
        },
      },
      Caja2: {
        start: 'Inicio',
        nodes: {
          Inicio: {
            text: 'Parece que esta caja está bloqueada.',
            options: [{ text: 'Regresar', next: 'Inicio' }],
          },
        },
      },
    };

    const dialogueData = dialogues[trigger] || {
      start: 'Inicio',
      nodes: {
        Inicio: {
          text: 'Este objeto no tiene diálogo asignado.',
          options: [{ text: 'Ok', next: 'Inicio' }],
        },
      },
    };
    this.scene.launch('DialogueScene', {
      dialogueData: dialogueData,
      startNode: 'Inicio',
    });
  }
}
