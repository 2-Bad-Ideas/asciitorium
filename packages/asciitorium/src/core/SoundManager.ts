import { isWebEnvironment } from './environment.js';

export class SoundManager {
  private static audioCache: Map<string, HTMLAudioElement> = new Map();
  private static playingAudio: Map<string, HTMLAudioElement> = new Map();
  private static enabled: boolean = true;

  static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }

  static async playSound(soundPath: string, loop: boolean = false): Promise<void> {
    // Only play sounds in web environment
    if (!isWebEnvironment()) {
      return;
    }

    if (!this.enabled) {
      return;
    }

    try {
      // Check cache first
      let audio = this.audioCache.get(soundPath);

      if (!audio) {
        // Create new audio element
        audio = new Audio(`art/sounds/${soundPath}`);
        this.audioCache.set(soundPath, audio);
      }

      // Clone the audio element to allow overlapping sounds
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.loop = loop;

      // Track playing audio for fade operations
      if (loop) {
        this.playingAudio.set(soundPath, audioClone);

        // Clean up when audio ends (if it's stopped manually)
        audioClone.addEventListener('ended', () => {
          this.playingAudio.delete(soundPath);
        });
      }

      await audioClone.play();
    } catch (error) {
      console.warn(`Failed to play sound "${soundPath}":`, error);
    }
  }

  static fadeToStop(soundPath: string, durationMs: number = 3000): void {
    // Only works in web environment
    if (!isWebEnvironment()) {
      return;
    }

    const audio = this.playingAudio.get(soundPath);
    if (!audio) {
      return;
    }

    // Store initial volume
    const initialVolume = audio.volume;
    const startTime = Date.now();

    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Calculate new volume (linear fade from initial to 0)
      audio.volume = initialVolume * (1 - progress);

      // When fade is complete, stop audio and clean up
      if (progress >= 1) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        this.playingAudio.delete(soundPath);
      }
    }, 16); // ~60fps
  }

  static clearCache(): void {
    this.audioCache.clear();
  }
}
