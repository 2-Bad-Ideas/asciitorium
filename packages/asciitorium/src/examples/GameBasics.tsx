import {
  Line,
  Column,
  Row,
  Text,
  FirstPersonView,
  MapView,
  ProgressBarSlider,
  State,
  Keybind,
  MapEngine,
  GameEntity,
  AssetManager,
  type MapAsset,
} from '../index.js';
import { BaseStyle } from './constants.js';

const health = new State(5);
const tableColumnWidth = 20;

const player = new GameEntity({
  name: 'Player',
  health: 20,
  strength: 10,
  focus: 10,
  position: { x: 2, y: 1, direction: 'east' },
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
 * First Person View Basics
 *
 * Guide to using first-person perspective rendering in asciitorium games.
 */
export const GameBasics = () => {
  return (
    <Column style={BaseStyle} label="Game Engine Demo">
      <Keybind keyBinding="w" action={() => mapEngine.moveForward(player)} />
      <Keybind keyBinding="s" action={() => mapEngine.moveBackward(player)} />
      <Keybind keyBinding="a" action={() => mapEngine.turnLeft(player)} />
      <Keybind keyBinding="d" action={() => mapEngine.turnRight(player)} />
      <Column align="top" width="fill" height="fill">
        <Row align="top" width="fill" height={28}>
          <FirstPersonView
            align="center"
            gap={{ bottom: 2 }}
            mapAsset={map}
            player={player.position}
          />
          <MapView
            mapAsset={map}
            player={player.position}
            mapMode="explored"
            mapMemory={mapMemory}
            width={28}
            height={14}
            background="."
          />
        </Row>
      </Column>
    </Column>
  );
};
