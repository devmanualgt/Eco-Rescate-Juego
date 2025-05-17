// src/managers/AudioManager.ts

import Phaser from 'phaser';

type SoundKey = 'caminar' | 'fondo' | 'ganar' | 'perder';

export class AudioManager {
  private static instance: AudioManager;
  private scene!: Phaser.Scene;
  private sounds: Partial<Record<SoundKey, Phaser.Sound.BaseSound>> = {};

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public init(scene: Phaser.Scene) {
    this.scene = scene;

    this.sounds.caminar = scene.sound.add('caminar', { volume: 0.3 });
    this.sounds.fondo = scene.sound.add('fondo', { loop: true, volume: 0.5 });
    this.sounds.ganar = scene.sound.add('ganar', { volume: 0.7 });
    this.sounds.perder = scene.sound.add('perder', { volume: 0.7 });
  }

  public play(key: SoundKey) {
    const sound = this.sounds[key];
    if (sound && !sound.isPlaying) sound.play();
  }

  public playOnce(key: SoundKey) {
    const sound = this.sounds[key];
    if (sound) sound.play();
  }

  public stop(key: SoundKey) {
    const sound = this.sounds[key];
    if (sound && sound.isPlaying) sound.stop();
  }

  public stopAll() {
    Object.values(this.sounds).forEach((sound) => {
      if (sound?.isPlaying) sound.stop();
    });
  }

  public muteAll(muted: boolean) {
    this.scene.sound.mute = muted;
  }

  public setVolumeAll(volume: number) {
    this.scene.sound.volume = volume;
  }
}
