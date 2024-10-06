'use strict';
import type { ShadowNodeWrapper, StyleProps } from '../../commonTypes';
import { adaptViewConfig } from '../../ConfigHelper';
import {
  extractCSSConfigsAndFlattenedStyles,
  removeViewStyle,
  setViewStyle,
} from '..';
import type {
  ICSSManager,
  ViewInfo,
} from '../../createAnimatedComponent/commonTypes';
import CSSTransitionManager from './CSSTransitionManager';
import CSSAnimationManager from './CSSAnimationManager';

export default class CSSManager implements ICSSManager {
  private readonly cssAnimationManager: CSSAnimationManager;
  private readonly cssTransitionManager: CSSTransitionManager;

  constructor() {
    this.cssAnimationManager = new CSSAnimationManager();
    this.cssTransitionManager = new CSSTransitionManager();
  }

  attach(styles: StyleProps[], viewInfo: ViewInfo): void {
    this.update(styles, viewInfo, true);
  }

  update(
    styles: StyleProps[],
    { shadowNodeWrapper, viewConfig, viewTag }: ViewInfo,
    isMount = false
  ): void {
    const [animationConfig, transitionConfig, style] =
      extractCSSConfigsAndFlattenedStyles(styles);

    const wrapper = shadowNodeWrapper as ShadowNodeWrapper;
    if (viewConfig) {
      adaptViewConfig(viewConfig);
    }

    // If the update is called during component mount, we won't recognize style
    // changes and treat styles as initial, thus we need to set them before
    // attaching transition and animation
    if (isMount) {
      setViewStyle(viewTag as number, style);
    }

    this.cssTransitionManager.update(wrapper, transitionConfig, style);
    this.cssAnimationManager.update(wrapper, animationConfig);

    // If the update is called during component mount, we want to first - update
    // the transition or animation config, and then - set the style (which may
    // trigger the transition)
    if (!isMount) {
      setViewStyle(viewTag as number, style);
    }
  }

  detach(viewTag: number): void {
    removeViewStyle(viewTag);
    this.cssAnimationManager.detach();
    this.cssTransitionManager.detach();
  }
}
