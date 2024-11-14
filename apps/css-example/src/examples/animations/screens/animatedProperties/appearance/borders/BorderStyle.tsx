import { StyleSheet } from 'react-native';
import type { CSSAnimationKeyframes } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import { ExamplesScreen, VerticalExampleCard } from '@/components';
import { colors, radius, sizes, spacing } from '@/theme';

export default function BorderStyle() {
  return (
    <ExamplesScreen<{ keyframes: CSSAnimationKeyframes }>
      CardComponent={VerticalExampleCard}
      buildConfig={({ keyframes }) => ({
        animationDuration: '3s',
        animationIterationCount: 'infinite',
        animationName: keyframes,
        animationTimingFunction: 'linear',
      })}
      renderExample={({ config }) => (
        <Animated.View style={[styles.box, config]} />
      )}
      sections={[
        {
          examples: [
            {
              description:
                "`borderStyle` is a **discrete** property. That means, it **can't be smoothly animated** between values. However, we can still change this property in the animation keyframes but the change will be **abrupt**.",
              keyframes: {
                '0%': {
                  borderStyle: 'solid',
                },
                '33.3%': {
                  borderStyle: 'dotted',
                },
                '66.6%': {
                  borderStyle: 'dashed',
                },
                '100%': {
                  borderStyle: 'solid',
                },
              },
              title: 'Changing Border Style',
            },
          ],
          title: 'Border Style',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    borderRadius: radius.sm,
    borderWidth: spacing.xxs,
    height: sizes.xl,
    width: sizes.xl,
  },
});
