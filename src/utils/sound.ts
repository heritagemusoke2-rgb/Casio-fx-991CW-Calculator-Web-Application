/**
 * Web Audio API synthesizer for authentic Casio tactile click sounds
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKeyClick(type: 'normal' | 'func' | 'ac' | 'exe' = 'normal') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      let freq = 1200;
      let duration = 0.015;
      let initialVol = 0.08;

      if (type === 'func') {
        freq = 1500;
        duration = 0.012;
        initialVol = 0.06;
      } else if (type === 'ac') {
        freq = 600;
        duration = 0.025;
        initialVol = 0.1;
      } else if (type === 'exe') {
        freq = 900;
        duration = 0.025;
        initialVol = 0.12;
      }

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + duration);

      gain.gain.setValueAtTime(initialVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio autoplay policy or browser restriction
    }
  }

  playErrorTone() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio autoplay policy
    }
  }
}

export const sound = new SoundEngine();
