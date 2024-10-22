import RouteCards from './routeCards';
import type { RouteNames, Routes } from '../../navigation/types';
import {
  AnimatedProperties,
  AnimationSettings,
  Miscellaneous,
  RealWorldExamples,
  TestExamples,
} from './screens';

const routes = {
  AnimatedProperties: {
    name: 'Animated Properties',
    CardComponent: RouteCards.AnimatedPropertiesCard,
    routes: {
      Dimensions: {
        name: 'Dimensions',
        Component: AnimatedProperties.Dimensions,
      },
      FlexStyles: {
        name: 'Flex Styles',
        Component: AnimatedProperties.FlexStyles,
      },
      Insets: {
        name: 'Insets',
        Component: AnimatedProperties.Insets,
      },
      Transforms: {
        name: 'Transforms',
        Component: AnimatedProperties.Transforms,
      },
      Colors: {
        name: 'Colors',
        Component: AnimatedProperties.Colors,
      },
      Borders: {
        name: 'Borders',
        Component: AnimatedProperties.Borders,
      },
      Margins: {
        name: 'Margins',
        Component: AnimatedProperties.Margins,
      },
      Paddings: {
        name: 'Paddings',
        Component: AnimatedProperties.Paddings,
      },
    },
  },
  AnimationSettings: {
    name: 'Animation Settings',
    CardComponent: RouteCards.AnimationSettingsCard,
    routes: {
      Duration: {
        name: 'Duration',
        Component: AnimationSettings.AnimationDuration,
      },
      TimingFunction: {
        name: 'Timing Function',
        Component: AnimationSettings.AnimationTimingFunction,
      },
      Delay: {
        name: 'Delay',
        Component: AnimationSettings.AnimationDelay,
      },
      IterationCount: {
        name: 'Iteration Count',
        Component: AnimationSettings.AnimationIterationCount,
      },
      Direction: {
        name: 'Direction',
        Component: AnimationSettings.AnimationDirection,
      },
      FillMode: {
        name: 'Fill Mode',
        Component: AnimationSettings.AnimationFillMode,
      },
      PlayState: {
        name: 'Play State',
        Component: AnimationSettings.AnimationPlayState,
      },
    },
  },
  RealWorldExamples: {
    name: 'Real World Examples',
    CardComponent: RouteCards.RealWorldExamplesCard,
    routes: {
      SpinnersAndLoaders: {
        name: 'Spinners and Loaders',
        Component: RealWorldExamples.SpinnersAndLoaders,
      },
      Emojis: {
        name: 'Emojis',
        Component: RealWorldExamples.Emojis,
      },
      Campfire: {
        name: 'Campfire',
        Component: RealWorldExamples.Campfire,
      },
      RocketInSpace: {
        name: 'Rocket In Space',
        Component: RealWorldExamples.RocketInSpace,
      },
      SquishySquashy: {
        name: 'Squishy Squashy',
        Component: RealWorldExamples.SquishySquashy,
      },
    },
  },
  Miscellaneous: {
    name: 'Miscellaneous',
    CardComponent: RouteCards.MiscellaneousCard,
    routes: {
      ChangingAnimation: {
        name: 'Changing Animation',
        Component: Miscellaneous.ChangingAnimation,
      },
      UpdatingAnimationSettings: {
        name: 'Updating Animation Settings',
        Component: Miscellaneous.UpdatingAnimationSettings,
      },
    },
  },
  TestExamples: {
    name: 'Test Examples',
    CardComponent: RouteCards.TestExamplesCard,
    routes: {
      Playground: {
        name: 'Playground',
        Component: TestExamples.Playground,
      },
      IterationCountAndFillMode: {
        name: 'Iteration Count and Fill Mode',
        Component: TestExamples.IterationCountAndFillMode,
      },
    },
  },
} satisfies Routes;

export type AnimationsNavigationRouteName = RouteNames<
  'Animations',
  typeof routes
>;

export default routes;
