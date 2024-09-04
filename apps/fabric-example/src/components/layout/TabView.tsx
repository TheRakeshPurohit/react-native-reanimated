import type { PropsWithChildren, ReactElement } from 'react';
import {
  Children,
  cloneElement,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { colors, flex, spacing } from '../../theme';
import { TabSelector } from '../inputs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Scroll from './Scroll';

const WINDOW_WIDTH = Dimensions.get('window').width;

type TabProps = PropsWithChildren<{
  name: string;
}>;

type TabPropsInternal = TabProps & {
  index: number;
  rendered: boolean;
  selectedTabIndex: SharedValue<number>;
  previousSelectedTabIndex: SharedValue<number>;
};

const Tab = memo(function Tab({
  children,
  rendered,
  index,
  selectedTabIndex,
  previousSelectedTabIndex,
}: TabPropsInternal): ReactElement {
  const animatedTabStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          Math.sign(index - selectedTabIndex.value) * WINDOW_WIDTH
        ),
      },
      {
        translateY: withTiming(`${+(index !== selectedTabIndex.value) * 5}%`),
      },
      {
        scale: withTiming(index === selectedTabIndex.value ? 1 : 0.9),
      },
    ],
    opacity:
      index === selectedTabIndex.value ||
      index === previousSelectedTabIndex.value
        ? 1
        : 0,
  }));

  return (
    <Animated.View style={[styles.tab, animatedTabStyle]}>
      {rendered ? <Scroll>{children}</Scroll> : null}
    </Animated.View>
  );
});

type TabViewComponent = {
  (props: TabViewProps): ReactElement | null;
  Tab: React.FC<TabProps>;
};

type TabViewProps = {
  children: Array<ReactElement<TabProps>> | ReactElement<TabProps>;
};

const TabView: TabViewComponent = ({ children }: TabViewProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const childrenArray = useMemo(
    () => Children.toArray(children) as Array<ReactElement<TabPropsInternal>>,
    [children]
  );
  const tabNames = useMemo(
    () => childrenArray.map((child) => child.props.name),
    [childrenArray]
  );

  const [selectedTabName, setSelectedTabName] = useState(tabNames[0]);
  // This is used to delay rendering of other tabs until the screen transition is finished
  // (thanks to this, the screen which uses a tab view will render quicker)
  const [screenTransitionFinished, setScreenTransitionFinished] =
    useState(false);

  const previousSelectedTabIndex = useSharedValue(0);
  const selectedTabIndex = useSharedValue(0);

  useAnimatedReaction(
    () => selectedTabName,
    (name) => {
      const index = tabNames.indexOf(name);
      previousSelectedTabIndex.value = selectedTabIndex.value;
      selectedTabIndex.value = index;
    }
  );

  useEffect(() => {
    return navigation.addListener('transitionEnd', () => {
      setScreenTransitionFinished(true);
    });
  }, [navigation]);

  return (
    <>
      <View style={styles.tabBar}>
        <TabSelector
          selectedTab={selectedTabName}
          tabs={tabNames}
          onSelectTab={setSelectedTabName}
        />
      </View>
      <View style={flex.fill}>
        {childrenArray.map((child, index) =>
          cloneElement(child, {
            key: index,
            rendered: index === 0 || screenTransitionFinished,
            selectedTabIndex,
            previousSelectedTabIndex,
            index,
          })
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    zIndex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  tab: {
    ...StyleSheet.absoluteFillObject,
  },
});

TabView.Tab = Tab as unknown as React.FC<TabProps>;

export default TabView;
