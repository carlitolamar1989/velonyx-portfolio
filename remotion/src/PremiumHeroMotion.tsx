import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * PremiumHeroMotion — the shared look for the three hero story images.
 *
 * Three layered, restrained moves, all on a perfectly seamless 6s loop:
 *
 *   1. Breathing zoom   — centered scale 1.000 → 1.045 → 1.000. Centered so the
 *                         headline text never drifts out of the portrait crop.
 *   2. Glow pulse       — brightness + saturation lift synced to the zoom, so
 *                         the light source (starburst / rays / swirl) intensifies
 *                         as the frame breathes in.
 *   3. Gold sheen sweep — a soft warm band that travels across once per loop and
 *                         catches the gold (screen blend = adds light, never
 *                         darkens). Off-screen + zero-opacity at both seam ends.
 *
 * Seamless-loop math: breathe = (1 - cos(2π·t)) / 2. This is 0 at t=0 and t=1,
 * peaks at 1 at the midpoint, AND has zero velocity at both ends — so when the
 * <video loop> wraps, there is no position jump and no velocity snap.
 *
 * Tune the four constants below to taste; everything scales off them.
 */

const ZOOM_AMOUNT = 0.045; // how far it drifts in (4.5%)
const GLOW_AMOUNT = 0.07; // brightness lift at the peak
const SAT_AMOUNT = 0.06; // saturation lift at the peak
const SHEEN_PEAK_OPACITY = 0.14; // max strength of the gold light-sweep

export const PremiumHeroMotion: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1 across the loop

  const breathe = (1 - Math.cos(2 * Math.PI * t)) / 2;

  const scale = 1 + ZOOM_AMOUNT * breathe;
  const brightness = 0.98 + GLOW_AMOUNT * breathe;
  const saturate = 1 + SAT_AMOUNT * breathe;

  // Sheen: travels left→right, off-screen at both ends, fades in/out via sin.
  const sweepX = -60 + 220 * t; // -60% → 160%
  const sweepOpacity = Math.sin(Math.PI * t) * SHEEN_PEAK_OPACITY;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
          filter: `brightness(${brightness}) saturate(${saturate})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(105deg, transparent 38%, rgba(240,208,96,0.55) 50%, transparent 62%)',
          transform: `translateX(${sweepX}%)`,
          opacity: sweepOpacity,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
