import React from 'react';
import { Composition } from 'remotion';
import { HeroSlide1 } from './HeroSlide1';
import { HeroSlide2 } from './HeroSlide2';
import { HeroSlide3 } from './HeroSlide3';

const FPS = 30;
const DURATION_FRAMES = FPS * 6; // 6-second seamless loop

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
      <Composition
        id="HeroSlide2"
        component={HeroSlide2}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="HeroSlide3"
        component={HeroSlide3}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
