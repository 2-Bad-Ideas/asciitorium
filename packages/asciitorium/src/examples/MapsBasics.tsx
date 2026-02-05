import {
  Line,
  Column,
  Text,
  MapView,
  State,
  Keybind,
  MapEngine,
  GameEntity,
  AssetManager,
  type MapAsset,
} from '../index.js';
import { BaseStyle } from './constants.js';

const player = new GameEntity({
  name: 'Player',
  health: 20,
  strength: 10,
  focus: 10,
  position: { x: 15, y: 5, direction: 'east' },
});

// Initialize state containers
const map = new State<MapAsset | null>(null);

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
});

// Map memory tracking
const mapMemory = new State(new Set<string>());

/**
 * Maps Basics
 *
 * Guide to creating and using maps in asciitorium games.
 */
export const MapsBasics = () => {
  return (
    <Column style={BaseStyle} label="Maps Basics">
      <Keybind keyBinding="w" action={() => mapEngine.moveForward(player)} />
      <Keybind keyBinding="s" action={() => mapEngine.moveBackward(player)} />
      <Keybind keyBinding="a" action={() => mapEngine.turnLeft(player)} />
      <Keybind keyBinding="d" action={() => mapEngine.turnRight(player)} />

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
          player={player.position}
          mapMode="all"
          mapMemory={mapMemory}
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
