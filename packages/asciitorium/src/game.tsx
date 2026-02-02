import {
  App,
  FirstPersonView,
  MapView,
  Row,
  Column,
  Player,
  Text,
  Keybind,
  AssetManager,
  Line,
  MapAsset,
  GridMovement,
  ProgressBarSlider,
  State,
} from './index.js';

const health = new State(5);
const tableColumnWidth = 20;

// Initialize state containers
const map = new State<MapAsset | null>(null);
const player = new State<Player>({
  x: 2,
  y: 1,
  direction: 'east',
});

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

// Fog of war tracking
const exploredTiles = new State(new Set<string>());

const app = (
  <App align="center" font="PrintChar21">
    <Keybind keyBinding="w" action={() => gridMovement.moveForward()} />
    <Keybind keyBinding="s" action={() => gridMovement.moveBackward()} />
    <Keybind keyBinding="a" action={() => gridMovement.turnLeft()} />
    <Keybind keyBinding="d" action={() => gridMovement.turnRight()} />
    <Column align="top" width="fill" height="fill" gap={{ top: 1 }}>
      <Row align="top-left" width={70} height={28}>
        <FirstPersonView
          align="center"
          gap={{ bottom: 2 }}
          mapAsset={map}
          player={player}
        />
        <MapView
          mapAsset={map}
          player={player}
          fogOfWar={true}
          exploredTiles={exploredTiles}
          width={40}
          height={28}
        />
      </Row>
      <Column width={70} border>
        <Row align="left" width={70} height={3}>
          <Text gap={{ left: 1, right: 1 }} width={tableColumnWidth}>
            Name
          </Text>
          <Text gap={{ left: 1, right: 1 }} width={tableColumnWidth}>
            Resolve
          </Text>
          <Text gap={{ left: 1, right: 1 }} width={tableColumnWidth}>
            Health
          </Text>
        </Row>
        <Line />
        <Row align="left" width={70}>
          <Text gap={{ left: 1, right: 1 }} width={tableColumnWidth}>
            Gandalf
          </Text>
          <Text gap={{ left: 1, right: 1 }} width={tableColumnWidth}>
            Stable
          </Text>
          <ProgressBarSlider
            width={tableColumnWidth}
            value={health}
            min={0}
            max={20}
            readonly
          />
        </Row>
        <Row align="left" width={70}>
          <Text gap={{ left: 1, right: 1 }} width={tableColumnWidth}>
            Wolf
          </Text>
          <Text gap={{ left: 1, right: 1 }} width={tableColumnWidth}>
            Scared
          </Text>
          <ProgressBarSlider
            width={tableColumnWidth}
            value={health}
            min={0}
            max={20}
            readonly
          />
        </Row>
      </Column>
    </Column>
  </App>
);

await app.start();
