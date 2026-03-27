import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const BASE_W = 375;
const BASE_H = 812;

export const scale = (size) => Math.round((SCREEN_W / BASE_W) * size);

export const vScale = (size) => Math.round((SCREEN_H / BASE_H) * size);

export const mScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

export const isSmall = SCREEN_W < 360;
export const isMedium = SCREEN_W >= 360 && SCREEN_W < 400;
export const isLarge = SCREEN_W >= 400;


export const HP = isSmall ? 14 : isMedium ? 18 : 22;

export const FONT = {
  xs:   mScale(11),
  sm:   mScale(12),
  base: mScale(14),
  md:   mScale(15),
  lg:   mScale(17),
  xl:   mScale(20),
  xxl:  mScale(24),
  hero: mScale(30),
};

export const RADIUS = {
  sm:  mScale(8),
  md:  mScale(12),
  lg:  mScale(16),
  xl:  mScale(20),
  full: 999,
};


export const SPACE = {
  xs:  vScale(4),
  sm:  vScale(8),
  md:  vScale(12),
  lg:  vScale(16),
  xl:  vScale(24),
  xxl: vScale(32),
};

export { SCREEN_W, SCREEN_H };