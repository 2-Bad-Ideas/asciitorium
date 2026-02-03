import {
  App,
  Row,
  Text,
  State,
  Column,
  MapView,
  Keybind,
  Position,
  MapAsset,
  AssetManager,
  GridMovement,
  FirstPersonView,
  ProgressBarSlider,
} from './index.js';

const health = new State(5);

// Initialize state containers
const map = new State<MapAsset | null>(null);
const player = new State<Position>({
  x: 2,
  y: 1,
  direction: 'east',
});
const compass = new State<boolean>(false);
const mapMode = new State<'all' | 'nearby' | 'explored' | 'hidden'>('all');
const mapMemory = new State(new Set<string>());

// Load map asset asynchronously
AssetManager.getMap('example')
  .then((mapAsset) => {
    map.value = mapAsset;
  })
  .catch((error) => {
    console.error('Failed to load map:', error);
  });

// Create GridMovement controller
const gridMovement = new GridMovement({
  mapAsset: map,
  player: player,
});

const app = (
  <App align="center" font="PrintChar21" width={84}>
    <Keybind keyBinding="w" action={() => gridMovement.moveForward()} />
    <Keybind keyBinding="s" action={() => gridMovement.moveBackward()} />
    <Keybind keyBinding="a" action={() => gridMovement.turnLeft()} />
    <Keybind keyBinding="d" action={() => gridMovement.turnRight()} />
    <Text label="Stats" width="fill" height={7} border></Text>
    <Row align="top-left" height={28}>
      <Column>
        <Column label="Tom Bomberdil" width={28} height={18} border>
          <Text gap={{ left: 1, top: 1 }}>Health</Text>
          <ProgressBarSlider
            width={26}
            value={health}
            min={0}
            max={20}
            readonly
          />
          <Text gap={{ left: 1, top: 1 }}>Strength</Text>
          <ProgressBarSlider
            width={26}
            value={health}
            min={0}
            max={20}
            readonly
          />
          <Text gap={{ left: 1, top: 1 }}>Focus</Text>
          <ProgressBarSlider
            width={26}
            value={health}
            min={0}
            max={20}
            readonly
          />
        </Column>
        <Column label="Companion 1" width={28} height={10} border>
          <Text gap={{ left: 1, top: 1 }}>Health</Text>
          <ProgressBarSlider
            width={26}
            value={health}
            min={0}
            max={20}
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
        player={player}
      />
      <Column>
        <MapView
          label="Map"
          mapAsset={map}
          player={player}
          mapMode={mapMode}
          mapMemory={mapMemory}
          width={28}
          height={18}
          background="·"
          hiddenCharacter="·"
          showDirection={compass}
        />

        <Column width={28} height={10} label="Companion 2" background='.' border>
          
        </Column>
      </Column>
    </Row>
    <Text label="Messages" width="fill" height={7} border></Text>
  </App>
);

await app.start();
