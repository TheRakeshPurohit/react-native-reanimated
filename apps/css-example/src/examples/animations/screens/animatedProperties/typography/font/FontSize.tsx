import { StyleSheet } from 'react-native';
import type { CSSAnimationKeyframes } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import { ExamplesScreen, VerticalExampleCard } from '@/components';
import { colors } from '@/theme';

export default function FontSize() {
  return (
    <ExamplesScreen<{ keyframes: CSSAnimationKeyframes }>
      CardComponent={VerticalExampleCard}
      buildConfig={({ keyframes }) => ({
        animationDirection: 'alternate',
        animationDuration: '3s',
        animationIterationCount: 'infinite',
        animationName: keyframes,
        animationTimingFunction: 'linear',
      })}
      renderExample={({ config }) => (
        <Animated.Text style={[styles.text, config]}>
          Hello from Reanimated!
        </Animated.Text>
      )}
      sections={[
        {
          examples: [
            {
              description:
                '`fontSize` is a **continuous** property. That means, it **can be smoothly animated** between values.',
              keyframes: {
                '0%': {
                  fontSize: 0,
                },
                '50%': {
                  fontSize: 24,
                },
                '100%': {
                  fontSize: 12,
                },
              },
              title: 'Changing Font Size',
            },
          ],
          title: 'Font Size',
        },
      ]}
    />
  );
}
const styles = StyleSheet.create({
  text: {
    color: colors.foreground1,
    fontFamily: 'Poppins',
  },
});
