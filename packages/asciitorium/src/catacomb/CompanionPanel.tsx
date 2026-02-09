import {
  Column,
  Text,
  ProgressBarSlider,
  State,
  GameEntity,
  Switch,
  Case,
  Default,
} from '../index.js';

interface CompanionPanelProps {
  companionState: State<GameEntity | null>;
  width?: number;
  height?: number;
}

export const CompanionPanel = ({
  companionState,
  width = 28,
  height = 10,
}: CompanionPanelProps) => {
  // Create switch state that maps companion presence to "present" or "empty"
  const companionSwitch = new State<string>(
    companionState.value ? 'present' : 'empty'
  );

  // Subscribe to companion changes and update switch state
  companionState.subscribe((c) => {
    companionSwitch.value = c ? 'present' : 'empty';
  });

  return (
    <Switch condition={companionSwitch}>
      <Case
        when="present"
        create={() => {
          const companion = companionState.value;
          if (!companion) return new Column({ width, height, border: true });

          return (
            <Column label={companion.name} width={width} height={height} border>
              <Text gap={{ left: 1, top: 1 }}>Health</Text>
              <ProgressBarSlider
                width={width - 2}
                value={companion.health}
                min={0}
                max={companion.getMaxHealth()}
                readonly
              />
              <Text textAlign="center" width="fill" gap={1}>
                (Solid)
              </Text>
            </Column>
          );
        }}
      />
      <Default
        create={() => (
          <Column
            width={width}
            height={height}
            background="."
            border
          />
        )}
      />
    </Switch>
  );
};
