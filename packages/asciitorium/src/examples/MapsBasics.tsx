import {
  Line,
  Column,
  Text,
  MapView,
  State,
  Keybind,
  GridMovement,
  AssetManager,
  type MapAsset,
  type Position,
} from '../index.js';
import { BaseStyle } from './constants.js';

// Initialize state containers
const map = new State<MapAsset | null>(null);
const player = new State<Position>({
  x: 15,
  y: 5,
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

/**
 * Maps Basics
 *
 * Guide to creating and using maps in asciitorium games.
 */
export const MapsBasics = () => {
  return (
    <Column style={BaseStyle} label="Maps Basics">
      <Keybind keyBinding="w" action={() => gridMovement.moveForward()} />
      <Keybind keyBinding="s" action={() => gridMovement.moveBackward()} />
      <Keybind keyBinding="a" action={() => gridMovement.turnLeft()} />
      <Keybind keyBinding="d" action={() => gridMovement.turnRight()} />

      <Text width="90%" gap={{ top: 1 }}>
        Maps
      </Text>
      <Line width="90%" />

      <Text width="90%">
        Maps are ASCII layouts that define game environments, combining visual
        representation with legend files that specify gameplay properties.
      </Text>

      <Column width="90%" align="center" gap={{ top: 1, bottom: 1 }}>
        <MapView
          mapAsset={map}
          player={player}
          fogOfWar={false}
          exploredTiles={exploredTiles}
          width="fill"
          height={15}
        />

        <Text>[W] forward • [S] backward • [A] turn left • [D] turn right</Text>
      </Column>

      <Text gap={{ left: 4, top: 1, bottom: 2 }}>
        TIP: Use the map-builder.js script to quickly generate maze-like dungeon
        layouts that you can customize. Maps are stored in art/maps/ with each
        map in its own directory containing map.art and legend.json files.
      </Text>
    </Column>
  );
};
