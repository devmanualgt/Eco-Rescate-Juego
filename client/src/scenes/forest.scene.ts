import Phaser from 'phaser';
import { Hero } from '../sprites/hero';
import { DebugHelper } from '../utils/debuger.herlper';

export class BosqueEscena extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  hero!: Hero;
  debugHelper: DebugHelper;
  map!: Phaser.Tilemaps.Tilemap; // Agregar esta propiedad
  layers: Phaser.Tilemaps.TilemapLayer[];
  dialogueTriggers: any;
  currentOverlappingTriggers: Set<any>;

  constructor() {
    super('BosqueEscena');
  }

  preload() {
    this.load.spritesheet('map', 'assets/tilemaps/map.png', {
      frameWidth: 16,
      frameHeight: 15,
    });

    this.load.tilemapTiledJSON('forest', 'assets/tilemaps/map01.json');

    this.load.aseprite({
      key: 'hero',
      textureURL: 'assets/sprites/hero-frames.png',
      atlasURL: 'assets/sprites/hero-frames.json',
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'forest' });
    const tileset = map.addTilesetImage('map', 'map');

    // 🔹 Definir las capas y sus colisiones
    const layersConfig = [
      { name: 'water', collision: [173, 174] },
      { name: 'land', collision: null },
      { name: 'tree0', collision: [35, 37, 63, 64, 65] },
      { name: 'tree1', collision: { start: 8, end: 63 } },
      { name: 'tree2', collision: [36] },
      { name: 'boxes', collision: { start: 231, end: 260 } },
    ];

    this.layers = [];

    layersConfig.forEach((config) => {
      const layer = map.createLayer(config.name, tileset, 0, 0)?.setScale(2.5);
      if (layer) {
        this.layers[config.name] = layer;
        if (config.collision) {
          if (Array.isArray(config.collision)) {
            layer.setCollision(config.collision);
          } else {
            layer.setCollisionBetween(
              config.collision.start,
              config.collision.end
            );
          }
        }
      }
    });

    // 🦸‍♂️ Crear el héroe después de cargar las capas
    this.hero = new Hero(this, 512, 384);

    // 🔹 Agregar colisiones solo si la capa existe
    Object.values(this.layers).forEach((layer) => {
      if (layer.layer.name === 'water') {
        console.log('layer.name', layer.layer.name);
      }
      if (layer) this.physics.add.collider(this.hero, layer);
    });

    // 🏃‍♂️ Crear animaciones
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

    // 🎥 Configurar cámara
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels * 2.5,
      map.heightInPixels * 2.45
    );
    this.cameras.main.startFollow(this.hero);
    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels * 2.5,
      map.heightInPixels * 2.45
    );

    // 🛠️ Depuración
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
        console.log(obj.name);

        trigger.dialogueKey = obj.name; // <- Usa el nombre asignado en Tiled

        this.dialogueTriggers.add(trigger);
      });
      this.currentOverlappingTriggers = new Set();

      this.physics.add.overlap(
        this.hero,
        this.dialogueTriggers,
        (hero, trigger) => this.handleTriggerOverlap(trigger),
        null,
        this
      );
    }
  }

  update() {
    this.debugHelper.update();
    this.hero.move(this.cursors);

    this.currentOverlappingTriggers.forEach((trigger) => {
      if (
        !Phaser.Geom.Intersects.RectangleToRectangle(
          this.hero.getBounds(),
          trigger.getBounds()
        )
      ) {
        this.currentOverlappingTriggers.delete(trigger);
        (trigger as any).used = false;
      }
    });
  }

  handleTriggerOverlap(trigger) {
    if (!this.currentOverlappingTriggers.has(trigger)) {
      this.currentOverlappingTriggers.add(trigger);
      this.triggerDialogue(trigger);
    }
  }

  triggerDialogue(trigger) {
    const key = trigger.dialogueKey || 'DefaultKey';

    if (this.scene.isActive('DialogueScene')) return; // evita lanzar múltiples veces
    if ((trigger as any).used) return;

    (trigger as any).used = true;

    const dialogues = {
      box: {
        start: 'Inicio',
        nodes: {
          Inicio: {
            titulo: '¡Bienvenido!',
            personaje: 'Hero',
            text: '¡Encontraste una caja misteriosa!',
            options: [
              { text: 'Salir', next: '' },
              { text: 'Abrir', next: 'Jugar' },
            ],
          },
          Abrir: {
            text: 'Dentro hay un mensaje antiguo...',
            options: [{ text: 'Regresar', next: 'Inicio' }],
          },
          Jugar: {
            text: '¡Juguemos algo nuevo!',
            options: [{ text: 'Regresar', next: 'Inicio' }],
          },
        },
      },
      posion: {
        start: 'Inicio',
        nodes: {
          Inicio: {
            text: 'Parece que esta caja está bloqueada.',
            options: [{ text: 'Regresar', next: '' }],
          },
        },
      },
    };

    const dialogueData = dialogues[key] || {
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
      startNode: dialogueData.start,
    });
  }
}
