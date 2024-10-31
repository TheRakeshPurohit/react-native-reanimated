import { StyleSheet, View } from 'react-native';
import type { CSSTransitionConfig, StyleProps } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import { colors, radius, sizes } from '@/theme';

import { ExampleScreen } from './components';

export default function TransitionDuration() {
  const sharedConfig: CSSTransitionConfig = {
    transitionProperty: 'width',
    transitionTimingFunction: 'linear',
  };

  const renderExample = (
    exampleConfig: CSSTransitionConfig,
    style: StyleProps
  ) => (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.box, exampleConfig, style]} />
    </View>
  );

  return (
    <ExampleScreen
      renderExample={renderExample}
      sharedConfig={sharedConfig}
      transitionStyles={[{ width: 0 }, { width: '100%' }]}
      cards={[
        {
          items: [
            { label: '800ms', transitionDuration: '800ms' },
            { label: '2s', transitionDuration: '2s' },
            { label: '3500', transitionDuration: 3500 },
          ],
          title: 'Positive Duration',
        },
        {
          description: (
            <>
              If duration is not specified or is set to 0 (0s, 0ms, 0), style
              change will be applied immediately with no animation.
            </>
          ),
          items: [
            {
              label: '0s (default)',
              transitionDuration: '0s',
            },
          ],
          title: 'Zero Duration',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    height: sizes.sm,
  },
  wrapper: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
