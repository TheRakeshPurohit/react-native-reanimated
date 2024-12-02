import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  CSSAnimationProperties,
  CSSAnimationSettings,
} from 'react-native-reanimated';
import Animated, { LinearTransition } from 'react-native-reanimated';

import {
  Button,
  CodeBlock,
  ScrollScreen,
  Section,
  Stagger,
  Text,
} from '@/components';
import { colors, flex, radius, sizes, spacing } from '@/theme';
import { stringifyConfig } from '@/utils';

const sharedConfig: CSSAnimationSettings = {
  animationDuration: '1s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'easeInOut',
};

const wiggleAnimation: CSSAnimationProperties = {
  animationName: {
    '0, 100%': {
      transform: [{ rotate: '-15deg' }],
    },
    '50%': {
      transform: [{ rotate: '15deg' }],
    },
  },
  ...sharedConfig,
  animationDuration: '0.5s',
};

const fadeAnimation: CSSAnimationProperties = {
  animationName: {
    to: {
      opacity: 0,
    },
  },
  ...sharedConfig,
};

const colorAnimation: CSSAnimationProperties = {
  animationName: {
    to: {
      backgroundColor: colors.primaryDark,
    },
  },
  ...sharedConfig,
};

const jumpAnimation: CSSAnimationProperties = {
  animationName: {
    '50%': {
      top: '-50%',
      transform: [{ translateY: '50%' }],
    },
  },
  ...sharedConfig,
};

const rollAnimation: CSSAnimationProperties = {
  animationName: {
    to: {
      transform: [{ rotate: '360deg' }],
    },
  },
  ...sharedConfig,
};

const ANIMATIONS = [
  { animation: wiggleAnimation, name: 'Wiggle' },
  { animation: fadeAnimation, name: 'Fade' },
  { animation: colorAnimation, name: 'Color' },
  { animation: jumpAnimation, name: 'Jump' },
  { animation: rollAnimation, name: 'Roll' },
];

export default function ChangingAnimation() {
  const [selectedIndex, setSelectedIndex] = useState<null | number>(0);

  const animation =
    selectedIndex !== null ? ANIMATIONS[selectedIndex].animation : null;

  return (
    <ScrollScreen>
      <Stagger>
        <Section
          description="Select **one of** the predefined **animations** and see that the box **animation changes** to the selected one."
          title="Changing Animation">
          <View style={styles.content}>
            <View style={styles.buttonRow}>
              <Text variant="label1">Remove animation</Text>
              <Button
                disabled={!animation}
                title="Remove"
                onPress={() => setSelectedIndex(null)}
              />
            </View>

            <View style={styles.buttons}>
              {ANIMATIONS.map((item, index) => (
                <Button
                  disabled={selectedIndex === index}
                  key={index}
                  style={flex.grow}
                  title={item.name}
                  onPress={() => setSelectedIndex(index)}
                />
              ))}
            </View>

            <View style={styles.preview}>
              <Animated.View style={[styles.box, animation]} />
            </View>
          </View>
        </Section>

        <Section
          description="Selected animation configuration"
          title="Animation Configuration">
          <Animated.View layout={LinearTransition} style={styles.codeWrapper}>
            {animation ? (
              <CodeBlock code={stringifyConfig(animation)} />
            ) : (
              <Text variant="subHeading2">No animation selected</Text>
            )}
          </Animated.View>
        </Section>
      </Stagger>
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    height: sizes.md,
    width: sizes.md,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxs,
    justifyContent: 'space-between',
  },
  codeWrapper: {
    backgroundColor: colors.background2,
    borderRadius: radius.sm,
    padding: spacing.xs,
  },
  content: {
    gap: spacing.xs,
  },
  preview: {
    ...flex.center,
    backgroundColor: colors.background2,
    borderRadius: radius.md,
    height: sizes.xxl,
  },
});
