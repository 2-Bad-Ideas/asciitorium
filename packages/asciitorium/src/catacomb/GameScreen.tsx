import {
  Column,
  Row,
  Art,
  Keybind,
  Text,
  State,
  MapAsset,
  AssetManager,
  MapEngine,
  GameEntity,
  FirstPersonView,
  MapView,
} from '../index.js';
import { CompanionPanel } from './CompanionPanel.js';
import { CharacterPanel } from './CharacterPanel.js';

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

// Add initial companions to PC
const wolfCompanion = new GameEntity({
  name: 'Wolf Companion',
  health: 15,
  maxHealth: 25,
  strength: 8,
  focus: 14,
});

const hawkCompanion = new GameEntity({
  name: 'Hawk Scout',
  health: 8,
  maxHealth: 15,
  strength: 5,
  focus: 18,
});

// Add companions with delays to test reactivity
setTimeout(() => {
  console.log('Adding Wolf Companion after 5 seconds...');
  pc.addCompanion(wolfCompanion);
}, 5000);

setTimeout(() => {
  console.log('Adding Hawk Scout after 10 seconds...');
  pc.addCompanion(hawkCompanion);
}, 10000);

// Get reactive states for each companion slot
const companion1 = pc.getCompanionState(0);
const companion2 = pc.getCompanionState(1);

// Initialize state containers
const map = new State<MapAsset | null>(null);
const mapMode = new State<'all' | 'nearby' | 'explored' | 'hidden'>('hidden');
const mapMemory = new State(new Set<string>());
const message = new State<string>('It is pitch black. You are likely to be eaten by a grue.');

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

// Create a computed state that maps direction to compass sprite
const compassSprite = new State<string>('compass-unknown');

// Update compass based on both position and inventory
const updateCompass = () => {
  if (pc.hasItemState('compass').value) {
    compassSprite.value = `compass-${pc.position.value.direction}`;
  } else {
    compassSprite.value = 'compass-unknown';
  }
};

// Subscribe to both position and compass inventory changes
pc.position.subscribe(updateCompass);
pc.hasItemState('compass').subscribe(updateCompass);

// Initialize compass sprite
updateCompass();

// Create render distance state that depends on torch inventory
const renderDistance = new State<'none' | 'here' | 'near' | 'middle' | 'far'>('none');

// Update render distance based on torch inventory
const updateRenderDistance = () => {
  if (pc.hasItemState('torch').value) {
    renderDistance.value = 'near';
  } else {
    renderDistance.value = 'none';
  }
};

// Subscribe to torch inventory changes
pc.hasItemState('torch').subscribe(updateRenderDistance);

// Initialize render distance
updateRenderDistance();

export const GameScreen = ({ onComplete }: MainScreenProps) => {
  console.log('help')
  return (
    <Column align="center" width="fill" height="fill">
      <Keybind keyBinding="w" action={() => mapEngine.moveForward(pc)} />
      <Keybind keyBinding="s" action={() => mapEngine.moveBackward(pc)} />
      <Keybind keyBinding="a" action={() => mapEngine.turnLeft(pc)} />
      <Keybind keyBinding="d" action={() => mapEngine.turnRight(pc)} />
      <Keybind keyBinding="e" action={() => mapEngine.pickupItem(pc)} />
      <Row width="fill" height={7} align="right" border>
        <Art sprite={compassSprite} border />
      </Row>
      <Row align="top-left" height={28}>
        <Column>
          <CharacterPanel character={pc} />
          <CompanionPanel companionState={companion1} />
        </Column>
        <FirstPersonView
          label="View"
          align="center"
          gap={{ bottom: 2 }}
          mapAsset={map}
          renderDistance={renderDistance}
          player={pc.position}
        />
        <Column>
          <MapView
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
          <CompanionPanel companionState={companion2} />
        </Column>
      </Row>
      <Text textAlign="center" width="fill" height={7} border>
        {message}
      </Text>
    </Column>
  );
};
