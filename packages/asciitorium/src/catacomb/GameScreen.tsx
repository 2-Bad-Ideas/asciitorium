import {
  Column,
  Row,
  Keybind,
  Text,
  ProgressBarSlider,
  State,
  MapAsset,
  AssetManager,
  MapEngine,
  GameEntity,
  FirstPersonView,
  MapView,
} from '../index.js';

interface MainScreenProps {
  onComplete: () => void;
}

const pc = new GameEntity({
  name: 'Tom Bomberdil',
  health: 20,
  maxHealth: 25,
  strength: 12,
  focus: 10,
  position: { x: 2, y: 1, direction: 'east' },
});

const companion1 = new GameEntity({
  name: 'Wolf Companion',
  health: 15,
  maxHealth: 25,
  strength: 8,
  focus: 14,
});

// Initialize state containers
const map = new State<MapAsset | null>(null);
const mapMode = new State<'all' | 'nearby' | 'explored' | 'hidden'>('hidden');
const mapMemory = new State(new Set<string>());
const message = new State<string>('');

// Load map asset asynchronously
AssetManager.getMap('example')
  .then((mapAsset) => {
    map.value = mapAsset;
  })
  .catch((error) => {
    console.error('Failed to load map:', error);
  });

// Create MapEngine
const mapEngine = new MapEngine({
  mapAsset: map,
  message,
});

export const GameScreen = ({ onComplete }: MainScreenProps) => {
  console.log('help')
  return (
    <Column align="center" width="fill" height="fill">
      <Keybind keyBinding="w" action={() => mapEngine.moveForward(pc)} />
      <Keybind keyBinding="s" action={() => mapEngine.moveBackward(pc)} />
      <Keybind keyBinding="a" action={() => mapEngine.turnLeft(pc)} />
      <Keybind keyBinding="d" action={() => mapEngine.turnRight(pc)} />
      <Keybind keyBinding="e" action={() => mapEngine.pickupItem(pc)} />
      <Text width="fill" height={7} border></Text>
      <Row align="top-left" height={28}>
        <Column>
          <Column label={pc.name.value} width={28} height={18} border>
            <Text gap={{ left: 1, top: 1 }}>Health</Text>
            <ProgressBarSlider
              width={26}
              value={pc.health}
              min={0}
              max={pc.getMaxHealth()}
              readonly
            />
            <Text gap={{ left: 1, top: 1 }}>Strength</Text>
            <ProgressBarSlider
              width={26}
              value={pc.strength}
              min={0}
              max={20}
              readonly
            />
            <Text gap={{ left: 1, top: 1 }}>Focus</Text>
            <ProgressBarSlider
              width={26}
              value={pc.focus}
              min={0}
              max={20}
              readonly
            />
          </Column>
          <Column label={companion1.name.value} width={28} height={10} border>
            <Text gap={{ left: 1, top: 1 }}>Health</Text>
            <ProgressBarSlider
              width={26}
              value={companion1.health}
              min={0}
              max={companion1.getMaxHealth()}
              readonly
            />
            <Text textAlign="center" width="fill" gap={1}>
              (Solid)
            </Text>
          </Column>
        </Column>
        <FirstPersonView
          label="View"
          align="center"
          gap={{ bottom: 2 }}
          mapAsset={map}
          player={pc.position}
        />
        <Column>
          <MapView
            label="Map"
            mapAsset={map}
            player={pc.position}
            mapMode={mapMode}
            mapMemory={mapMemory}
            width={28}
            height={18}
            background="·"
            hiddenCharacter="·"
            showDirection={pc.hasItemState('compass')}
          />

          <Column
            width={28}
            height={10}
            label="Companion 2"
            background="."
            border
          ></Column>
        </Column>
      </Row>
      <Text textAlign="center" width="fill" height={7} border>
        {message}
      </Text>
    </Column>
  );
};
