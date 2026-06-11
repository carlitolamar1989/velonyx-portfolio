import React from 'react';
import { Composition } from 'remotion';
import { HeroSlide1 } from './HeroSlide1';
import { HeroSlide2 } from './HeroSlide2';
import { HeroSlide3 } from './HeroSlide3';
import { BannerFrontDesk } from './BannerFrontDesk';
import { BannerEveryLead } from './BannerEveryLead';
import { BannerDemos } from './BannerDemos';

const FPS = 30;
const DURATION_FRAMES = FPS * 6; // 6-second seamless loop

export const Root: React.FC = () => {
  return (
    <>
      {/* Hero story images — 4:5 portrait slots, but composed 16:9 (CSS crops). */}
      <Composition id="HeroSlide1" component={HeroSlide1} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
      <Composition id="HeroSlide2" component={HeroSlide2} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
      <Composition id="HeroSlide3" component={HeroSlide3} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
      {/* 16:9 banners. */}
      <Composition id="BannerFrontDesk" component={BannerFrontDesk} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
      <Composition id="BannerEveryLead" component={BannerEveryLead} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
      {/* 32:9 thin cinematic bar — "These Are The Demos". 3200x896 ≈ 32:8.96,
          chosen so scale 0.75 yields clean even dims (2400x672) for H.264. */}
      <Composition id="BannerDemos" component={BannerDemos} durationInFrames={DURATION_FRAMES} fps={FPS} width={3200} height={896} />
    </>
  );
};
