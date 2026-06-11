import React from 'react';
import { Composition } from 'remotion';
import { HeroSlide1 } from './HeroSlide1';

const FPS = 30;
const DURATION_FRAMES = FPS * 6;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroSlide1"
        component={HeroSlide1}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
