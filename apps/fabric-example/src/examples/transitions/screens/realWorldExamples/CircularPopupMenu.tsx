import { useState } from 'react';
import {
  colors,
  flex,
  iconSizes,
  radius,
  sizes,
  spacing,
} from '../../../../theme';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { CSSTransitionConfig } from 'react-native-reanimated';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { ScrollScreen } from '../../../../components';
import {
  faCog,
  faComment,
  faHeart,
  faHome,
  faPhone,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function CircularPopupMenu() {
  return (
    <ScrollScreen contentContainerStyle={styles.container}>
      <CircularMenu />
    </ScrollScreen>
  );
}

const MENU_ITEMS = [
  { icon: faHome },
  { icon: faHeart },
  { icon: faComment },
  { icon: faStar },
  { icon: faPhone },
  { icon: faCog },
];

function CircularMenu() {
  const [open, setOpen] = useState(false);

  return (
    <View style={flex.center}>
      {MENU_ITEMS.map((item, index) => (
        <MenuItem key={index} icon={item.icon} open={open} index={index} />
      ))}
      <Animated.View
        style={[
          styles.menuButtonWrapper,
          {
            transitionProperty: 'all',
            transitionDuration: 400,
            transform: [{ scale: open ? 0.75 : 1 }],
            transitionTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1.275),
            backgroundColor: open ? colors.primaryDark : colors.primary,
          },
        ]}>
        <MenuButton open={open} onPress={setOpen} />
      </Animated.View>
    </View>
  );
}

const BUTTON_SIZE = sizes.xs;

type MenuButtonProps = {
  open: boolean;
  onPress: (isOpen: boolean) => void;
};

function MenuButton({ open, onPress }: MenuButtonProps) {
  const transitionConfig: CSSTransitionConfig = {
    transitionProperty: 'all',
    transitionDuration: 200,
  };
  const lineStyle = [transitionConfig, styles.menuButtonLine];

  return (
    <Pressable style={styles.menuButton} onPress={() => onPress(!open)}>
      <Animated.View
        style={[
          lineStyle,
          {
            transform: open
              ? [{ rotate: '45deg' }]
              : [{ translateY: -0.3 * BUTTON_SIZE }],
          },
        ]}
      />
      <Animated.View
        style={[
          lineStyle,
          {
            opacity: open ? 0 : 1,
          },
        ]}
      />
      <Animated.View
        style={[
          lineStyle,
          {
            transform: open
              ? [{ rotate: '-45deg' }]
              : [{ translateY: 0.3 * BUTTON_SIZE }],
          },
        ]}
      />
    </Pressable>
  );
}

type MenuItemProps = {
  icon: IconDefinition;
  open: boolean;
  index: number;
};

function MenuItem({ icon, open, index }: MenuItemProps) {
  const angle = 180 + (index * 360) / MENU_ITEMS.length;

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.menuItem,
        {
          transitionProperty: 'transform',
          transitionDuration: open ? 180 + index * 100 : 200,
          transitionTimingFunction: cubicBezier(0.935, 0, 0.34, 1.33),
          transform: open
            ? [
                { rotate: `${angle}deg` },
                { translateY: 3.5 * BUTTON_SIZE },
                { rotate: `-${angle}deg` },
                { scale: 1.2 },
              ]
            : [
                { rotate: `${angle}deg` },
                { translateY: 0 },
                { rotate: `-${angle}deg` },
              ],
        },
      ]}>
      <FontAwesomeIcon icon={icon} size={iconSizes.lg} color={colors.white} />
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...flex.center,
  },
  menuButtonWrapper: {
    padding: spacing.lg,
    borderRadius: radius.full,
  },
  menuButton: {
    ...flex.center,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  menuButtonLine: {
    position: 'absolute',
    width: '100%',
    height: 3,
    backgroundColor: colors.white,
    borderRadius: radius.full,
  },
  menuItem: {
    position: 'absolute',
    padding: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
