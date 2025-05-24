import Phaser from 'phaser';
import { Hero } from '../sprites/hero';
import { DebugHelper } from '../utils/debuger.herlper';
import { LifeHeader } from './life.scene';

export class BosqueEscena extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  hero!: Hero;
  debugHelper: DebugHelper;
  map!: Phaser.Tilemaps.Tilemap;
  layers: Phaser.Tilemaps.TilemapLayer[] = [];
  dialogueTriggers: any;
  currentOverlappingTriggers: Set<any>;
  private soundCaminar!: Phaser.Sound.BaseSound;
  private musicaFondo!: Phaser.Sound.BaseSound;
  private header!: LifeHeader;
  private teclaL!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'BosqueEscena' });
  }

  preload() {}

  create() {
    this.musicaFondo = this.sound.add('musicaFondo', {
      loop: true,
      volume: 1,
    });
    this.musicaFondo.play();
    this.teclaL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

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
            layer.setCollisionBetween(
              config.collision.start,
              config.collision.end
            );
          }
        }
      }
    });

    /* this.scene.launch('LifeScene', {
      lives: 5,
      hero: this.hero,
    }); */
    this.header = new LifeHeader(this, 5, 'StartScene'); // 5 vidas iniciales

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

    this.hero = new Hero(this, 512, 384);
    Object.values(this.layers).forEach((layer) => {
      if (layer) this.physics.add.collider(this.hero, layer);
    });

    this.anims.get('respirar').repeat = -1;
    this.hero.inputEnabled = true;

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

        trigger.dialogueKey = obj.name;

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

    this.debugHelper = new DebugHelper(this, this.layers);

    this.soundCaminar = this.sound.add('caminar', { volume: 10 });
    console.log('Sonido caminar cargado:', this.soundCaminar);

    this.createSoundUI();
    this.dialogueInit();
  }

  update() {
    this.debugHelper.update();
    this.hero.move(this.cursors);

    const triggersToRemove: any[] = [];

    // Verifica qué triggers ya no colisionan
    this.currentOverlappingTriggers.forEach((trigger) => {
      if (
        !Phaser.Geom.Intersects.RectangleToRectangle(
          this.hero.getBounds(),
          trigger.getBounds()
        )
      ) {
        triggersToRemove.push(trigger);
      }
    });

    // Elimina los triggers no colisionados
    triggersToRemove.forEach((trigger) => {
      this.currentOverlappingTriggers.delete(trigger);
      (trigger as any).used = false;

      // Si ya no hay ningún trigger activo, detén el diálogo
      if (this.currentOverlappingTriggers.size === 0) {
        if (this.scene.isActive('DialogueScene')) {
          this.scene.stop('DialogueScene');
          console.log(
            '🛑 DialogueScene detenido por salida de todos los triggers'
          );
        }
      }
    });

    // Control de sonido caminar
    const moviendo =
      this.cursors.left.isDown ||
      this.cursors.right.isDown ||
      this.cursors.up.isDown ||
      this.cursors.down.isDown;

    if (moviendo) {
      if (!this.soundCaminar.isPlaying) {
        this.soundCaminar.play({ loop: true });
      }
    } else {
      if (this.soundCaminar.isPlaying) {
        this.soundCaminar.stop();
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.teclaL)) {
      this.someDamageFunction();
    }
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
    this.scene.launch('DialogueScene', {
      trigger: key,
      hero: this.hero,
    });
  }

  dialogueInit() {
    //const key = trigger.dialogueKey || 'DefaultKey';

    if (this.scene.isActive('DialogueScene')) return; // evita lanzar múltiples veces

    this.scene.launch('DialogueScene', {
      trigger: 'home',
    });
  }

  private createSoundUI() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '20px';
    container.style.left = '20px';
    container.style.background = 'rgba(0, 0, 0, 0.6)';
    container.style.padding = '12px';
    container.style.borderRadius = '10px';
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    container.style.zIndex = '1000';

    const volMusica = (this.musicaFondo as Phaser.Sound.WebAudioSound).volume;
    const volAmbiente = (this.soundCaminar as Phaser.Sound.WebAudioSound)
      .volume;

    container.innerHTML = `
      <label style="display:block; margin-bottom: 10px;">🎵 Música de Fondo:
        <input type="range" id="musicSlider" min="0" max="1" step="0.01" value="${volMusica}">
      </label>
      <label style="display:block;">🌿 Sonido Ambiental:
        <input type="range" id="ambientSlider" min="0" max="1" step="0.01" value="${volAmbiente}">
      </label>
    `;

    document.body.appendChild(container);

    const musicSlider = container.querySelector(
      '#musicSlider'
    ) as HTMLInputElement;
    const ambientSlider = container.querySelector(
      '#ambientSlider'
    ) as HTMLInputElement;

    musicSlider.addEventListener('input', () => {
      (this.musicaFondo as Phaser.Sound.WebAudioSound).setVolume(
        parseFloat(musicSlider.value)
      );
    });

    ambientSlider.addEventListener('input', () => {
      (this.soundCaminar as Phaser.Sound.WebAudioSound).setVolume(
        parseFloat(ambientSlider.value)
      );
    });

    this.input.keyboard.on('keydown-M', () => {
      container.style.display =
        container.style.display === 'none' ? 'block' : 'none';
    });
  }

  someDamageFunction() {
    const newLives = 3;
    this.header.updateLives(newLives);
  }
}
