import { ReanimatedError } from '../../../errors';
import {
  ERROR_MESSAGES,
  getNormalizedCSSTransitionConfigUpdates,
  normalizeCSSTransitionConfig,
} from './config';
import { cubicBezier } from '../../easing';
import type {
  CSSTransitionConfig,
  CSSTransitionProperty,
  NormalizedCSSTransitionConfig,
  NormalizedCSSTransitionProperties,
  Repeat,
} from '../../types';

describe(normalizeCSSTransitionConfig, () => {
  describe('when there is a single transition property', () => {
    it('normalizes transition config', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: 'all',
        transitionDuration: '1.5s',
        transitionTimingFunction: cubicBezier(0.4, 0, 0.2, 1),
        transitionDelay: '300ms',
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual({
        properties: 'all',
        settings: {
          all: {
            duration: 1500,
            timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
            delay: 300,
          },
        },
      });
    });

    it('uses default values for unspecified properties', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: 'opacity',
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual({
        properties: ['opacity'],
        settings: {
          opacity: {
            duration: 0,
            timingFunction: 'ease',
            delay: 0,
          },
        },
      });
    });

    it('returns null if transition property is "none"', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: 'none',
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual(null);
    });

    it('returns null if transition property is an empty array', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: [],
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual(null);
    });

    it('ignores redundant transition settings', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: 'all',
        transitionDuration: ['1.5s', 1000, '100ms'],
        transitionTimingFunction: ['ease', cubicBezier(0.4, 0, 0.2, 1)],
        transitionDelay: '300ms',
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual({
        properties: 'all',
        settings: {
          all: {
            duration: 1500,
            timingFunction: 'ease',
            delay: 300,
          },
        },
      });
    });
  });

  describe('when there are multiple transition properties', () => {
    it('uses proper values if different properties have different settings', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: ['opacity', 'transform'],
        transitionDuration: ['1.5s', '2s'],
        transitionTimingFunction: ['easeIn', cubicBezier(0.4, 0, 0.2, 1)],
        transitionDelay: ['300ms', '500ms'],
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual({
        properties: ['opacity', 'transform'],
        settings: {
          opacity: {
            duration: 1500,
            timingFunction: 'easeIn',
            delay: 300,
          },
          transform: {
            duration: 2000,
            timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
            delay: 500,
          },
        },
      });
    });

    it('uses the same settings for all properties if only single values are provided', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: ['opacity', 'width'],
        transitionDuration: '1.5s',
        transitionTimingFunction: 'easeIn',
        transitionDelay: ['300ms', '300ms'],
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual({
        properties: ['opacity', 'width'],
        settings: {
          opacity: {
            duration: 1500,
            timingFunction: 'easeIn',
            delay: 300,
          },
          width: {
            duration: 1500,
            timingFunction: 'easeIn',
            delay: 300,
          },
        },
      });
    });

    it('cycles through values if their number is different than the number of transition properties', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: ['width', 'opacity', 'transform'],
        transitionDuration: ['1.5s', '2s'],
        transitionTimingFunction: 'easeIn',
        transitionDelay: ['300ms', '500ms'],
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual({
        properties: ['width', 'opacity', 'transform'],
        settings: {
          width: {
            duration: 1500,
            timingFunction: 'easeIn',
            delay: 300,
          },
          opacity: {
            duration: 2000,
            timingFunction: 'easeIn',
            delay: 500,
          },
          transform: {
            duration: 1500,
            timingFunction: 'easeIn',
            delay: 300,
          },
        },
      });
    });

    it('uses the last transition property settings if the same transition property is specified multiple times', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: ['opacity', 'opacity'],
        transitionDuration: ['1.5s', '2s'],
        transitionTimingFunction: ['easeIn', cubicBezier(0.4, 0, 0.2, 1)],
        transitionDelay: '300ms',
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual({
        properties: ['opacity'],
        settings: {
          opacity: {
            duration: 2000,
            timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
            delay: 300,
          },
        },
      });
    });

    it('returns only "all" string if "all" appears in the list of properties and keeps other property settings in the settings object', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: ['all', 'opacity'],
        transitionDuration: ['1.5s', '2s'],
        transitionTimingFunction: ['easeIn', cubicBezier(0.4, 0, 0.2, 1)],
        transitionDelay: ['300ms', '500ms'],
      };

      expect(normalizeCSSTransitionConfig(config)).toEqual({
        properties: 'all',
        settings: {
          all: {
            duration: 1500,
            timingFunction: 'easeIn',
            delay: 300,
          },
          opacity: {
            duration: 2000,
            timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
            delay: 500,
          },
        },
      });
    });

    it('throws an error if one of the transition properties is "none"', () => {
      const config: CSSTransitionConfig = {
        transitionProperty: ['opacity', 'none'] as CSSTransitionProperty,
        transitionDuration: ['1.5s', '2s'],
        transitionTimingFunction: ['easeIn', cubicBezier(0.4, 0, 0.2, 1)],
        transitionDelay: ['300ms', '500ms'],
      };

      expect(() => normalizeCSSTransitionConfig(config)).toThrow(
        new ReanimatedError(
          ERROR_MESSAGES.invalidTransitionProperty(config.transitionProperty)
        )
      );
    });
  });
});

describe(getNormalizedCSSTransitionConfigUpdates, () => {
  it('returns empty object if nothing changed', () => {
    const oldConfig: NormalizedCSSTransitionConfig = {
      properties: 'all',
      settings: {
        all: {
          duration: 1500,
          timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
          delay: 300,
        },
      },
    };
    const newConfig: NormalizedCSSTransitionConfig = {
      properties: 'all',
      settings: {
        all: {
          duration: 1500,
          timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
          delay: 300,
        },
      },
    };

    expect(
      getNormalizedCSSTransitionConfigUpdates(oldConfig, newConfig)
    ).toEqual({});
  });

  describe('property changes', () => {
    it.each([
      ['all', ['opacity'], ['opacity']],
      [['opacity'], 'all', 'all'],
      [['opacity'], ['transform'], ['transform']],
      [['opacity', 'transform'], 'all', 'all'],
      ['all', ['opacity', 'transform'], ['opacity', 'transform']],
      [['opacity', 'transform'], ['opacity'], ['opacity']],
    ] satisfies Repeat<NormalizedCSSTransitionProperties, 3>[])(
      'returns property update if properties changed from %p to %p',
      (oldProperties, newProperties, expected) => {
        const oldConfig: NormalizedCSSTransitionConfig = {
          properties: oldProperties,
          settings: {},
        };
        const newConfig: NormalizedCSSTransitionConfig = {
          properties: newProperties,
          settings: {},
        };

        expect(
          getNormalizedCSSTransitionConfigUpdates(oldConfig, newConfig)
        ).toEqual({ properties: expected });
      }
    );

    it.each([
      'all',
      ['opacity'],
      ['opacity', 'transform'],
    ] satisfies NormalizedCSSTransitionProperties[])(
      'does not return property update if properties did not change from %p',
      (properties) => {
        const oldConfig: NormalizedCSSTransitionConfig = {
          properties,
          settings: {},
        };
        const newConfig: NormalizedCSSTransitionConfig = {
          properties,
          settings: {},
        };

        expect(
          getNormalizedCSSTransitionConfigUpdates(oldConfig, newConfig)
        ).toEqual({});
      }
    );
  });

  describe('settings changes', () => {
    describe('single transition settings', () => {
      it('returns all new settings if at least one setting changed', () => {
        const oldConfig: NormalizedCSSTransitionConfig = {
          properties: 'all',
          settings: {
            all: {
              duration: 1500,
              timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
              delay: 300,
            },
          },
        };
        const newConfig: NormalizedCSSTransitionConfig = {
          properties: 'all',
          settings: {
            all: {
              duration: 1500,
              timingFunction: 'easeIn', // changed
              delay: 300,
            },
          },
        };

        expect(
          getNormalizedCSSTransitionConfigUpdates(oldConfig, newConfig)
        ).toEqual({
          settings: {
            all: {
              duration: 1500,
              timingFunction: 'easeIn',
              delay: 300,
            },
          },
        });
      });

      it('returns empty object if nothing changed', () => {
        const oldConfig: NormalizedCSSTransitionConfig = {
          properties: 'all',
          settings: {
            all: {
              duration: 1500,
              timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
              delay: 300,
            },
          },
        };
        const newConfig: NormalizedCSSTransitionConfig = {
          properties: 'all',
          settings: {
            all: {
              duration: 1500,
              timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
              delay: 300,
            },
          },
        };

        expect(
          getNormalizedCSSTransitionConfigUpdates(oldConfig, newConfig)
        ).toEqual({});
      });
    });

    describe('multiple transition settings', () => {
      it('returns all new settings if at least one setting changed', () => {
        const oldConfig: NormalizedCSSTransitionConfig = {
          properties: ['opacity', 'transform', 'width'],
          settings: {
            opacity: {
              duration: 1500,
              timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
              delay: 300,
            },
            transform: {
              duration: 2000,
              timingFunction: 'easeIn',
              delay: 500,
            },
            width: {
              duration: 1000,
              timingFunction: 'easeOut',
              delay: 200,
            },
          },
        };
        const newConfig: NormalizedCSSTransitionConfig = {
          properties: ['transform', 'width', 'opacity'],
          settings: {
            opacity: {
              duration: 1500,
              timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
              delay: 500,
            },
            transform: {
              duration: 2000,
              timingFunction: 'easeIn',
              delay: 500,
            },
            width: {
              duration: 500,
              timingFunction: 'ease',
              delay: 200,
            },
          },
        };

        expect(
          getNormalizedCSSTransitionConfigUpdates(oldConfig, newConfig)
        ).toEqual({
          properties: ['transform', 'width', 'opacity'],
          settings: {
            opacity: {
              duration: 1500,
              timingFunction: cubicBezier(0.4, 0, 0.2, 1).normalize(),
              delay: 500,
            },
            transform: {
              duration: 2000,
              timingFunction: 'easeIn',
              delay: 500,
            },
            width: {
              duration: 500,
              timingFunction: 'ease',
              delay: 200,
            },
          },
        });
      });
    });
  });
});
