import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Text } from '@/components/core';
import { Label, type LabelType } from '@/components/misc';
import { colors, radius, spacing } from '@/theme';

type RouteCardProps = PropsWithChildren<{
  title: string;
  route: string;
  disabled?: boolean;
  labelTypes?: Array<LabelType>;
  description?: string;
  showcaseScale?: number;
}>;

export type RouteCardComponent = (
  props: Omit<RouteCardProps, 'children'>
) => JSX.Element;

export default function RouteCard({
  children,
  description,
  disabled = false,
  labelTypes,
  route,
  showcaseScale = 1,
  title,
}: RouteCardProps) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled}
      style={styles.card}
      onPress={() => {
        navigation.navigate(route as never);
      }}>
      <View style={[styles.content, { opacity: disabled ? 0.6 : 1 }]}>
        <View style={styles.textColumn}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title} variant="label1">
              {title}
            </Text>
            {labelTypes?.map((type) => (
              <Label key={type} size="small" type={type} />
            ))}
          </View>
          {description && <Text variant="body1">{description}</Text>}
        </View>
        <View style={styles.showcaseWrapper}>
          {children && (
            <View
              style={[
                styles.showcase,
                { transform: [{ scale: showcaseScale }] },
              ]}>
              {children}
            </View>
          )}
          <FontAwesomeIcon color={colors.foreground3} icon={faChevronRight} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background1,
    borderRadius: radius.md,
    gap: spacing.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  showcase: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexBasis: 85,
    justifyContent: 'center',
    minHeight: 110,
  },
  showcaseWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  textColumn: {
    flexShrink: 1,
    gap: spacing.xxs,
    justifyContent: 'space-evenly',
    paddingVertical: spacing.md,
  },
  title: {
    color: colors.foreground1,
    flexShrink: 1,
  },
  titleWrapper: {
    alignItems: 'center',
    columnGap: spacing.xs,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
