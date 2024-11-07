import { ReanimatedError } from '../../../errors';
import type { StyleProps } from '../../../commonTypes';
import {
  ERROR_MESSAGES,
  extractCSSConfigsAndFlattenedStyles,
  normalizeStyle,
} from './style';

describe(normalizeStyle, () => {
  it('converts all "auto" values to undefined', () => {
    const style: StyleProps = {
      width: 'auto',
      margin: 'auto',
      borderRadius: 10,
      flexDirection: 'row',
    };

    expect(normalizeStyle(style)).toEqual({
      width: undefined,
      margin: undefined,
      borderRadius: 10,
      flexDirection: 'row',
    });
  });

  describe('color props', () => {
    describe('converts color strings to numbers for all color props', () => {
      it.each([
        ['backgroundColor', 'red', 0xff0000ff],
        ['color', 'rgb(255, 200, 0)', 0xffc800ff],
        ['textDecorationColor', 'rgba(50, 100, 150, 0.6)', 0x32649699],
        ['textShadowColor', '#34a', 0x3344aaff],
        ['borderColor', '#123456', 0x123456ff],
        ['borderTopColor', '#abc', 0xaabbccff],
        ['borderBlockStartColor', '#ff5733', 0xff5733ff],
        ['borderRightColor', 'hsl(240, 100%, 50%)', 0x0000ffff],
        ['borderEndColor', 'hsla(120, 50%, 50%, 0.5)', 0x40bf4080],
        ['borderBottomColor', 'hwb(0, 0%, 0%)', 0xff0000ff],
        ['borderBlockEndColor', 'blue', 0x0000ffff],
        ['borderLeftColor', 'green', 0x008000ff],
        ['borderStartColor', 'rgb(0, 128, 255)', 0x0080ffff],
        ['borderBlockColor', 'rgba(255, 0, 128, 0.3)', 0xff00804d],
        ['shadowColor', '#00ff88', 0x00ff88ff],
        ['overlayColor', 'hsla(360, 100%, 50%, 0.75)', 0xff0000bf],
        ['tintColor', 'hsl(180, 100%, 25%)', 0x007f80ff],
      ])('converts %p with value %p to %p', (key, value, expected) => {
        const argb = ((expected << 24) | (expected >>> 8)) >>> 0;
        const style: StyleProps = { [key]: value };
        expect(normalizeStyle(style)).toEqual({ [key]: argb });
      });
    });

    describe('throws an error for invalid color values', () => {
      it.each([
        'invalid',
        '#1',
        'rgb(255, 255, 255, 0.5)',
        'rgba(255, 255, 255)',
        'hsl(360, 100%, 50%, 0.5)',
        'hsla(360, 100%, 50%)',
        'hwb(360, 100%, 50%, 0.5)',
      ])('throws an error for %p', (value) => {
        const style: StyleProps = { color: value };
        expect(() => normalizeStyle(style)).toThrow(
          new ReanimatedError(ERROR_MESSAGES.invalidColor(value))
        );
      });
    });
  });

  describe('transform string', () => {
    it('normalizes transform string', () => {
      const style: StyleProps = {
        transform: 'translate(100px, 20%) translateY(50%) scale(2) skew(0)',
      };

      expect(normalizeStyle(style)).toEqual({
        transform: [
          { translateX: 100 },
          { translateY: '20%' },
          { translateY: '50%' },
          { scale: 2 },
          { skewX: '0deg' },
          { skewY: '0deg' },
        ],
      });
    });
  });

  describe('transform origin', () => {
    it('normalizes transform origin', () => {
      const style: StyleProps = {
        transformOrigin: 'top right',
      };

      expect(normalizeStyle(style)).toEqual({
        transformOrigin: ['100%', 0, 0],
      });
    });
  });

  describe('gap', () => {
    it('replaces gap with rowGap and columnGap', () => {
      const style: StyleProps = {
        gap: 10,
      };

      expect(normalizeStyle(style)).toEqual({
        rowGap: 10,
        columnGap: 10,
      });
    });
  });

  describe('other props', () => {
    it('passes other props without modification', () => {
      const style: StyleProps = {
        borderRadius: 10,
        flexDirection: 'row',
      };

      expect(normalizeStyle(style)).toEqual(style);
    });
  });

  describe('mixed props', () => {
    it('normalizes all props', () => {
      const style: StyleProps = {
        width: 'auto',
        margin: 'auto',
        backgroundColor: 'red',
        transform: 'translate(100px, 20%) translateY(50%) scale(2) skew(0)',
        transformOrigin: 'top right',
        gap: 10,
        borderRadius: 10,
        flexDirection: 'row',
      };

      expect(normalizeStyle(style)).toEqual({
        width: undefined,
        margin: undefined,
        backgroundColor: 0xffff0000, // ARGB
        transform: [
          { translateX: 100 },
          { translateY: '20%' },
          { translateY: '50%' },
          { scale: 2 },
          { skewX: '0deg' },
          { skewY: '0deg' },
        ],
        transformOrigin: ['100%', 0, 0],
        rowGap: 10,
        columnGap: 10,
        borderRadius: 10,
        flexDirection: 'row',
      });
    });
  });
});

describe(extractCSSConfigsAndFlattenedStyles, () => {
  describe('animation config', () => {
    it('returns null if there is no animationName', () => {
      const styles: StyleProps[] = [
        { transitionProperty: 'opacity', animationDuration: 100 },
      ];
      expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
        null,
        expect.any(Object),
        expect.any(Object),
      ]);
    });

    it('returns null if the animationName is an empty object', () => {
      const styles: StyleProps[] = [
        { animationName: {}, animationDuration: 100 },
      ];
      expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
        null,
        expect.any(Object),
        expect.any(Object),
      ]);
    });

    it('returns animation config if animationName is present', () => {
      const styles: StyleProps[] = [
        {
          animationName: {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          animationDuration: 100,
        },
      ];
      expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
        styles[0],
        expect.any(Object),
        expect.any(Object),
      ]);
    });

    describe('animation settings', () => {
      it.each([
        ['animationDuration', '2s'],
        ['animationTimingFunction', 'easeInOut'],
        ['animationDelay', '1s'],
        ['animationIterationCount', 5],
        ['animationDirection', 'reverse'],
        ['animationFillMode', 'both'],
        ['animationPlayState', 'paused'],
      ])(`returns %p setting`, (key, value) => {
        const styles: StyleProps[] = [
          {
            animationName: { from: { opacity: 0 }, to: { opacity: 1 } },
            [key]: value,
          },
        ];
        expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
          expect.objectContaining({ [key]: value }),
          null,
          {},
        ]);
      });
    });
  });

  describe('transition config', () => {
    it('returns null if there is no transitionProperty', () => {
      const styles: StyleProps[] = [
        {
          animationName: {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          transitionDuration: 100,
        },
      ];
      expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
        expect.any(Object),
        null,
        expect.any(Object),
      ]);
    });

    it('returns null if the transitionProperty is an empty array', () => {
      const styles: StyleProps[] = [
        { transitionProperty: [], transitionDuration: 100 },
      ];
      expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
        expect.any(Object),
        null,
        expect.any(Object),
      ]);
    });

    it('returns transition config if transitionProperty is present', () => {
      const styles: StyleProps[] = [
        { transitionProperty: 'opacity', transitionDuration: 100 },
      ];
      expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
        expect.any(Object),
        styles[0],
        expect.any(Object),
      ]);
    });

    describe('transition settings', () => {
      it.each([
        ['transitionProperty', 'opacity'],
        ['transitionDuration', '2s'],
        ['transitionTimingFunction', 'easeInOut'],
        ['transitionDelay', '1s'],
      ])(`returns %p setting`, (key, value) => {
        const styles: StyleProps[] = [
          { transitionProperty: value, [key]: value },
        ];
        expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
          null,
          expect.objectContaining({ [key]: value }),
          {},
        ]);
      });
    });
  });

  describe('flattened style', () => {
    it('flattens all style objects into a single object', () => {
      const styles: StyleProps[] = [
        { width: 100, height: 100 },
        { margin: 10, padding: 5 },
        { backgroundColor: 'red', color: 'blue', width: 200 },
      ];
      expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
        expect.any(Object),
        expect.any(Object),
        {
          width: 200,
          height: 100,
          margin: 10,
          padding: 5,
          backgroundColor: 0xffff0000,
          color: 0xff0000ff,
        },
      ]);
    });
  });

  describe('all together', () => {
    it('returns all configs and flattened style', () => {
      const styles: StyleProps[] = [
        {
          width: 100,
          transitionDuration: 100,
          height: 100,
          animationDuration: 100,
          transitionProperty: 'opacity',
          animationName: { from: { opacity: 0 }, to: { opacity: 1 } },
        },
      ];
      expect(extractCSSConfigsAndFlattenedStyles(styles)).toEqual([
        expect.objectContaining({
          animationName: styles[0].animationName,
          animationDuration: styles[0].animationDuration,
        }),
        expect.objectContaining({
          transitionProperty: styles[0].transitionProperty,
          transitionDuration: styles[0].transitionDuration,
        }),
        {
          width: 100,
          height: 100,
        },
      ]);
    });
  });
});
