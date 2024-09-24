'use strict';
import { CubicBezierEasing } from './cubicBezier';
import { LinearEasing } from './linear';
import { StepsEasing } from './steps';
import type { LinearEasingInputPoint, StepsModifier } from './types';

export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return new CubicBezierEasing(x1, y1, x2, y2);
}

export function steps(
  stepsNumber: number,
  modifier: StepsModifier = 'jumpEnd'
) {
  return new StepsEasing(stepsNumber, modifier);
}

export function linear(points: LinearEasingInputPoint[]) {
  return new LinearEasing(points);
}

export type {
  ParametrizedTimingFunction,
  CSSTimingFunction,
  NormalizedCSSTimingFunction,
  PredefinedTimingFunction,
} from './types';
