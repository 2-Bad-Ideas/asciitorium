import {
  Column,
  Text,
  ProgressBarSlider,
  GameEntity,
} from '../index.js';

interface CharacterPanelProps {
  character: GameEntity;
  width?: number;
  height?: number;
}

export const CharacterPanel = ({
  character,
  width = 28,
  height = 18,
}: CharacterPanelProps) => {
  return (
    <Column label={character.name} width={width} height={height} border>
      <Text gap={{ left: 1, top: 1 }}>Health</Text>
      <ProgressBarSlider
        width={width - 2}
        value={character.health}
        min={0}
        max={character.getMaxHealth()}
        readonly
      />
      <Text gap={{ left: 1, top: 1 }}>Strength</Text>
      <ProgressBarSlider
        width={width - 2}
        value={character.strength}
        min={0}
        max={20}
        readonly
      />
      <Text gap={{ left: 1, top: 1 }}>Focus</Text>
      <ProgressBarSlider
        width={width - 2}
        value={character.focus}
        min={0}
        max={20}
        readonly
      />
    </Column>
  );
};
