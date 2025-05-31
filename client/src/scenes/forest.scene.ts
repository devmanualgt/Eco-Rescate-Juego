import Phaser from 'phaser';
import { Hero } from '../sprites/hero';
import { DialogueBox } from './dialog.scene';
import { LifeHeader } from './life.scene';

export class BosqueEscena extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  hero!: Hero;
  // debugHelper: DebugHelper;
  map!: Phaser.Tilemaps.Tilemap;
  layers: Phaser.Tilemaps.TilemapLayer[] = [];
  dialogueTriggers: any;
  currentOverlappingTriggers: Set<any>;
  private soundCaminar!: Phaser.Sound.BaseSound;
  private musicaFondo!: Phaser.Sound.BaseSound;
  private header!: LifeHeader;
  private teclaL!: Phaser.Input.Keyboard.Key;
  dialog: DialogueBox | null = null;

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
    const tileset2 = map.addTilesetImage(
      'bote_NOreciclaje_32x32.png',
      'noreciclaje'
    );
    const tileset3 = map.addTilesetImage('bote_organico_32x32.png', 'organico');
    const tileset4 = map.addTilesetImage(
      'bote_reciclaje_32x32.png',
      'reciclaje'
    );

    const layersConfig = [
      { name: 'water', collision: [173, 174] },
      { name: 'land', collision: null },
      { name: 'tree0', collision: [35, 37, 63, 64, 65] },
      { name: 'tree1', collision: { start: 8, end: 63 } },
      { name: 'tree2', collision: [36] },
      { name: 'boxes', collision: [9, 10, /* 842, 843, */ 231, 258, 260] },
    ];
    const allTilesets = [tileset, tileset2, tileset3, tileset4];

    layersConfig.forEach((config) => {
      let layer;
      if (config.name === 'boxes') {
        layer = map.createLayer(config.name, allTilesets, 0, 0)?.setScale(2.5);
        //if()
      } else {
        layer = map.createLayer(config.name, tileset, 0, 0)?.setScale(2.5);
      }
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
    this.header = new LifeHeader(this, 5); // 5 vidas iniciales

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
    //this.hero.setVisible(false)
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

    //this.debugHelper = new DebugHelper(this, Object.values(this.layers));

    const dialogueLayer = map.getObjectLayer('boxesd');
    if (dialogueLayer) {
      this.dialogueTriggers = this.add.group();
      const scale = 2.5;

      dialogueLayer.objects.forEach((obj) => {
        const trigger = this.add.rectangle(
          obj.x * scale + (obj.width * scale) / 2, // x + mitad del ancho escalado
          obj.y * scale + (obj.height * scale) / 2, // y + mitad del alto escalado
          obj.width * scale, // ancho escalado
          obj.height * scale,
          0x000000,
          0 // invisible
        ) as Phaser.GameObjects.Rectangle & { dialogueKey: string };

        this.physics.add.existing(trigger, true); // cuerpo estático

        const body = trigger.body as Phaser.Physics.Arcade.StaticBody;
        // body.setSize(obj.width * 2.5, obj.height * 2.5);
        body.setOffset(0, 0);

        trigger.dialogueKey = obj.name;

        this.dialogueTriggers.add(trigger);
      });

      this.currentOverlappingTriggers = new Set();

      this.physics.add.collider(
        this.hero,
        this.dialogueTriggers,
        (hero, trigger) => {
          this.handleTriggerOverlap(trigger);
        }
      );
    }

    //this.debugHelper = new DebugHelper(this, this.layers);

    this.soundCaminar = this.sound.add('caminar', { volume: 10 });
    console.log('Sonido caminar cargado:', this.soundCaminar);

    this.createSoundUI();

    console.log(window.localStorage.getItem('showHistory'));

    if (window.localStorage.getItem('showHistory') === 'true') {
      this.openDialogue('home', 'center');
    }
  }

  update() {
    //this.debugHelper.update();
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
        if (this.dialog) {
          this.dialog.destroy(false);
          this.dialog = null;
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
    const key = trigger.dialogueKey || 'DefaultKey';
    if (!this.currentOverlappingTriggers.has(trigger)) {
      this.currentOverlappingTriggers.add(trigger);
      this.openDialogue(key, 'bottom');
    }
  }

  openDialogue(key, position: 'center' | 'bottom') {
    if (this.dialog) {
      //this.dialog.destroy(false);
      this.dialog = null;
    }

    this.dialog = new DialogueBox(
      this,
      key,
      (stop: boolean) => {
        if (stop) {
          this.musicaFondo.stop();
        }
      },
      position
    );
  }

  private createSoundUI() {
    let container = document.getElementById('audio-control-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'audio-control-container'; // ✅ ID único para identificarlo
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
    }

    // Siempre agrega el atajo de teclado, pero asegura que solo oculta/muestra
    this.input.keyboard.on('keydown-M', () => {
      if (container) {
        container.style.display =
          container.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  someDamageFunction() {
    const newLives = 3;
    this.header.updateLives(newLives);
  }
}
