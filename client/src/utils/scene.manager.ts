export class SceneManager {
  private static instance: SceneManager;
  private scene: Phaser.Scene;

  private constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  static getInstance(scene: Phaser.Scene): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager(scene);
    } else {
      // 🔄 Actualizar referencia de escena al cambiar
      SceneManager.instance.scene = scene;
    }
    return SceneManager.instance;
  }

  transitionTo(
    currentScene: string,
    nextScene: string,
    effect: 'fade' | 'slide' | 'zoom' | 'wipe' = 'fade',
    duration: number = 1000
  ) {
    const camera = this.scene.cameras.main;
    let fx;

    // Aplicar efecto visual previo si se requiere
    switch (effect) {
      case 'fade':
        camera.fadeOut(duration, 0, 0, 0);
        break;
      case 'slide':
        camera.pan(camera.width, 0, duration, 'Sine.easeInOut');
        break;
      case 'zoom':
        camera.zoomTo(0.5, duration);
        break;
      case 'wipe':
        fx = camera.postFX.addWipe(0.3, 1, 1);
        break;
    }

    // Lanzar transición
    this.scene.scene.transition({
      target: nextScene,
      duration,
      moveBelow: false,
      allowInput: false,
      onUpdate: (progress: number) => {
        if (fx) fx.progress = progress;
      },
    });

    // Esperar a que la escena destino esté activa
    const next = this.scene.scene.get(nextScene);

    // ⚠️ Verificamos si ya se había registrado el evento para no duplicarlo
    next.events.once('transitioncomplete', () => {
      console.log(`✅ Transición completa hacia ${nextScene}`);

      // Fade in visual
      next.cameras.main.fadeIn(500, 0, 0, 0);
    });
  }
}
