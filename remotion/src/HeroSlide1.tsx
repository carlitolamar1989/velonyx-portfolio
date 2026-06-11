import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Subtle Ken-Burns drift on hero-slide-1.webp.
 * Source served from ../assets via remotion.config.ts (setPublicDir).
 *
 * The composition is the reference we extend for the other slots — copy this
 * file, swap the staticFile() path, register the new Composition in Root.tsx,
 * add a `render:<name>` npm script, render to assets/motion/<name>.mp4, then
 * swap the <img> in index.html for a <video autoplay muted loop playsinline>.
 */
export const HeroSlide1: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  const scale = interpolate(t, [0, 1], [1.0, 1.08]);
  const translateY = interpolate(t, [0, 1], [0, -18]);
  const glow = interpolate(t, [0, 0.5, 1], [0.85, 1, 0.85]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Img
        src={staticFile('hero-slide-1.webp')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateY(${translateY}px)`,
          filter: `brightness(${glow})`,
        }}
      />
    </AbsoluteFill>
  );
};
