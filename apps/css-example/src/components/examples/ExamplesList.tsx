import type { ComponentType } from 'react';
import type { CSSAnimationConfig } from 'react-native-reanimated';

import { Scroll, Section } from '@/components/layout';
import type { LabelType } from '@/components/misc';
import type { AnyRecord } from '@/types';
import { stringifyConfig } from '@/utils';

import type { ExampleCardProps } from './ExampleCard';
import ExampleCard from './ExampleCard';

export type ExamplesListProps<P extends AnyRecord> = {
  renderExample: (props: { config: CSSAnimationConfig } & P) => JSX.Element;
  buildConfig: (props: P) => CSSAnimationConfig;
  CardComponent?: ComponentType<ExampleCardProps>;
  sections: Array<{
    title: string;
    description?: Array<string> | string;
    labelTypes?: Array<LabelType>;
    CardComponent?: ComponentType<ExampleCardProps>;
    examples: Array<
      Omit<ExampleCardProps, 'children' | 'code' | 'collapsedCode'> & P
    >;
  }>;
};

export default function ExamplesList<P extends AnyRecord>({
  CardComponent = ExampleCard,
  buildConfig,
  renderExample,
  sections,
}: ExamplesListProps<P>) {
  return (
    <Scroll withBottomBarSpacing>
      {sections.map(
        (
          { CardComponent: SectionCardComponent, examples, ...sectionProps },
          index
        ) => (
          <Section {...sectionProps} key={index}>
            {examples.map((exampleProps, exampleIndex) => (
              <Example
                {...exampleProps}
                buildConfig={buildConfig}
                CardComponent={SectionCardComponent ?? CardComponent}
                key={exampleIndex}
                renderExample={renderExample}
              />
            ))}
          </Section>
        )
      )}
    </Scroll>
  );
}

type ExampleProps<P> = {
  CardComponent: ComponentType<ExampleCardProps>;
  denseCode?: boolean;
  buildConfig: (props: P) => CSSAnimationConfig;
  renderExample: (props: { config: CSSAnimationConfig } & P) => JSX.Element;
} & Omit<ExampleCardProps, 'code'> &
  P;

function Example<P extends AnyRecord>({
  CardComponent,
  buildConfig,
  collapsedExampleHeight,
  denseCode = true,
  description,
  minExampleHeight,
  renderExample,
  title,
  ...rest
}: ExampleProps<P>) {
  const userProps = rest as P;
  const config = buildConfig(userProps);

  return (
    <CardComponent
      code={stringifyConfig(config)}
      collapsedCode={stringifyConfig(config.animationName, denseCode)}
      collapsedExampleHeight={collapsedExampleHeight}
      description={description}
      minExampleHeight={minExampleHeight}
      title={title}>
      {renderExample({ config, ...userProps })}
    </CardComponent>
  );
}
