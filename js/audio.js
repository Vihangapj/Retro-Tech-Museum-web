/**
 * Retro Tech Museum - Pure Web Audio API Sound Synthesizer
 * 100% Native 8-Bit Chiptune Sound Effects & Synth BGM without external audio files
 */

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.currentStep = 0;
    
    // Check saved preferences
    const savedSound = localStorage.getItem('retro_sound_enabled');
    if (savedSound !== null) {
      this.soundEnabled = savedSound === 'true';
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('retro_sound_enabled', this.soundEnabled);
    if (!this.soundEnabled && this.bgmPlaying) {
      this.stopBGM();
    }
    return this.soundEnabled;
  }

  // 8-Bit Click / Cursor Blip
  playBlip() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  }

  // 8-Bit Arcade Coin / Select
  playCoin() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.setValueAtTime(0.12, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.35);
    } catch(e) {}
  }

  // Retro Laser Shoot
  playLaser() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    } catch(e) {}
  }

  // Retro Explosion / Crash
  playExplosion() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch(e) {}
  }

  // Vintage Computer Boot Chime
  playBootChime() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const chords = [261.63, 329.63, 392.00, 523.25]; // C major arpeggio
      chords.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.6);
      });
    } catch(e) {}
  }

  // Floppy Disk Drive Seek Sound
  playDiskSeek() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const steps = 6;
      for (let i = 0; i < steps; i++) {
        const t = this.ctx.currentTime + (i * 0.045);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140 + Math.random() * 80, t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.035);
      }
    } catch(e) {}
  }

  // 8-Bit Looping Background Music (Chiptune Synthesizer)
  toggleBGM() {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  startBGM() {
    this.init();
    if (!this.ctx) return;
    this.bgmPlaying = true;

    // Iconic 8-bit melody sequence (frequencies in Hz)
    // C4, E4, G4, B4, C5, G4, E4, D4...
    const melody = [
      261.63, 329.63, 392.00, 493.88, 523.25, 392.00, 329.63, 293.66,
      329.63, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 523.25,
      440.00, 392.00, 349.23, 329.63, 293.66, 261.63, 293.66, 329.63,
      392.00, 329.63, 293.66, 261.63, 196.00, 220.00, 246.94, 261.63
    ];

    const bassLine = [
      130.81, 130.81, 164.81, 164.81, 196.00, 196.00, 146.83, 146.83,
      164.81, 164.81, 220.00, 220.00, 130.81, 130.81, 196.00, 196.00
    ];

    this.currentStep = 0;
    const tempo = 150; // ms per 16th note

    const playStep = () => {
      if (!this.bgmPlaying || !this.soundEnabled || !this.ctx) return;

      const t = this.ctx.currentTime;
      const noteFreq = melody[this.currentStep % melody.length];
      const bassFreq = bassLine[Math.floor(this.currentStep / 2) % bassLine.length];

      // Lead Melody
      if (noteFreq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(noteFreq, t);

        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      }

      // Bass Rhythm
      if (this.currentStep % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, t);

        bassGain.gain.setValueAtTime(0.06, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(t);
        bassOsc.stop(t + 0.23);
      }

      this.currentStep++;
      this.bgmTimer = setTimeout(playStep, tempo);
    };

    playStep();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// Global Audio Engine Instance
window.retroAudio = new RetroAudioEngine();

// Attach sound to common UI elements
document.addEventListener('DOMContentLoaded', () => {
  // Blip sound on hover over buttons and links
  document.querySelectorAll('a, button, .pixel-box-interactive, input, select').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      window.retroAudio.playBlip();
    });
  });

  // Coin sound on main action buttons
  document.querySelectorAll('.pixel-btn, .ctrl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.retroAudio.playCoin();
    });
  });
});
