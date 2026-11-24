/**
 * Web Audio API sound engine for Advent quiz.
 * No audio files needed — all sounds are oscillator-generated.
 * OFF by default. User must explicitly enable via toggle.
 */

const LS_KEY_ENABLED = "advent_audio_enabled";
const LS_KEY_VOLUME = "advent_audio_volume";

type SoundName =
  | "doorOpen"
  | "selectOption"
  | "correctAnswer"
  | "incorrectAnswer"
  | "quizComplete"
  | "badgeUnlock"
  | "celebration";

class AdventAudioEngine {
  private ctx: AudioContext | null = null;
  private _enabled = false;
  private _volume = 0.3;

  constructor() {
    if (typeof window === "undefined") return;
    try {
      this._enabled = localStorage.getItem(LS_KEY_ENABLED) === "true";
      const vol = localStorage.getItem(LS_KEY_VOLUME);
      if (vol) this._volume = Math.max(0, Math.min(1, parseFloat(vol)));
    } catch {
      /* storage unavailable */
    }
  }

  get enabled() {
    return this._enabled;
  }

  get volume() {
    return this._volume;
  }

  setEnabled(on: boolean) {
    this._enabled = on;
    try {
      localStorage.setItem(LS_KEY_ENABLED, String(on));
    } catch {
      /* noop */
    }
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    try {
      localStorage.setItem(LS_KEY_VOLUME, String(this._volume));
    } catch {
      /* noop */
    }
  }

  private getCtx(): AudioContext | null {
    if (!this._enabled) return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private tone(freq: number, duration: number, type: OscillatorType = "sine", gainVal?: number) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime((gainVal ?? 1) * this._volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  private sweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType = "sine") {
    const ctx = this.getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.6 * this._volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  play(sound: SoundName) {
    if (!this._enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    switch (sound) {
      case "doorOpen":
        this.sweep(200, 600, 0.3, "sine");
        break;

      case "selectOption":
        this.tone(800, 0.05, "triangle", 0.4);
        break;

      case "correctAnswer": {
        // C5 → E5 two-note chime
        this.tone(523, 0.25, "sine", 0.7);
        setTimeout(() => this.tone(659, 0.3, "sine", 0.6), 150);
        break;
      }

      case "incorrectAnswer":
        this.tone(200, 0.2, "sine", 0.4);
        break;

      case "quizComplete": {
        // Ascending arpeggio: C5-E5-G5-C6
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          setTimeout(() => this.tone(freq, 0.3, "sine", 0.5), i * 180);
        });
        break;
      }

      case "badgeUnlock":
        this.sweep(1200, 2400, 0.4, "sine");
        setTimeout(() => this.sweep(2000, 3000, 0.3, "sine"), 200);
        break;

      case "celebration": {
        // Multi-tone fanfare for perfect score
        const fanfare = [523, 659, 784, 1047, 784, 1047, 1319];
        fanfare.forEach((freq, i) => {
          setTimeout(() => this.tone(freq, 0.25, "sine", 0.5), i * 160);
        });
        break;
      }
    }
  }
}

/** Singleton audio engine instance. */
export const adventAudio = new AdventAudioEngine();
