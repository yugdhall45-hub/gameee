# Audio Assets & Synthesis Directory 🔊

This directory is designated for game audio files, background music tracks, sound effects (SFX), and Web Audio API synthesis presets.

## 📁 Recommended Structure

- `sfx/` — Short sound effects (.mp3, .ogg, .wav):
  - `thruster.wav`
  - `collectible-ping.wav`
  - `gravity-assist.wav`
  - `collision-alarm.wav`
- `music/` — Ambient background tracks (.ogg, .mp3):
  - `interstellar-ambient-loop.mp3`
- `presets/` — JSON synthesis parameter maps for procedural Web Audio nodes.

## ⚡ Zero-Dependency Audio Engine

Voyager includes a built-in procedural Web Audio synthesizer in [`js/systems/AudioSystem.js`](file:///c:/Users/dhall/New%20folder/js/systems/AudioSystem.js) that generates all sound effects in real time:
- White-noise filtered rocket thruster roar
- Frequency-modulated golden record harmonics
- Resonant bandpass gravity slingshot whoosh
- Square-wave collision warnings

External audio files placed in this directory can be loaded alongside procedural audio for enhanced immersion.
