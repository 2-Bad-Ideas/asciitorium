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
  GridMovement,
  AssetManager,
  type MapAsset,
  type Position,
} from '../index.js';
import { BaseStyle } from './constants.js';

const health = new State(5);
const tableColumnWidth = 20;

// Initialize state containers
const map = new State<MapAsset | null>(null);
const player = new State<Position>({
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

/**
 * First Person View Basics
 *
 * Guide to using first-person perspective rendering in asciitorium games.
 */
export const GameBasics = () => {
  return (
    <Column style={BaseStyle} label="Game Engine Demo">
      <Keybind keyBinding="w" action={() => gridMovement.moveForward()} />
      <Keybind keyBinding="s" action={() => gridMovement.moveBackward()} />
      <Keybind keyBinding="a" action={() => gridMovement.turnLeft()} />
      <Keybind keyBinding="d" action={() => gridMovement.turnRight()} />
      <Column align="top" width="fill" height="fill">
        <Row align="top" width="fill" height={28}>
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
            width={28}
            height={14}
            background="."
          />
        </Row>
      </Column>
    </Column>
  );
};
