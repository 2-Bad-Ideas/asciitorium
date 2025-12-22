import {
  Art,
  Line,
  Column,
  Text,
  Keybind,
  State,
} from '../index.js';
import { BaseStyle } from './constants.js';

/**
 * Keybindings Basics
 *
 * Guide to using global keybindings and component hotkeys in asciitorium.
 */
export const KeybindingsBasics = () => {
  const message = new State<string>(
    'Press X on the keyboard'
  );

  const setMessage = (msg: string) => {
    message.value = msg;
    setTimeout(() => {
      message.value =
        'Press X on the keyboard';
    }, 2000);
  };

  const spawnFirework = () => {
    // Random position within a reasonable range
    const x = Math.floor(Math.random() * 60) + 10;
    const y = Math.floor(Math.random() * 20) + 5;

    const firework = new Art({
      sprite: 'firework',
      position: { x, y },
    });

    container.addChild(firework);

    // Remove firework after animation completes (~800ms for 8 frames at 100ms each)
    setTimeout(() => {
      container.removeChild(firework);
    }, 800);
  };

  const handleXButton = () => {
    setMessage('X pressed - Firework launched!');
    spawnFirework();
  };

  const container = (
    <Column style={BaseStyle} label="Keybindings & Mobile Basics">
      <Text width="90%" gap={{ top: 1 }}>
        Keybindings
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        The Keybind component creates global single key shortcuts that execute
        custom logic anywhere in your app.
      </Text>

      <Keybind keyBinding="x" action={handleXButton} />

      <Column width="90%" align="center" border gap={{ bottom: 1 }}>
        <Text
          align="center"
          textAlign="center"
          width="80%"
          gap={{ top: 1, bottom: 1 }}
        >
          {message}
        </Text>
      </Column>

      <Text width="90%">Keybind Properties</Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • keyBinding — Key to bind (e.g., "F12", "j", "Escape") ¶
        • action — Function to execute when key is pressed ¶
        • description — Optional description for documentation ¶
        • disabled — Disable keybinding (supports State for reactive control) ¶
      </Text>

      <Text width="90%">
        Tip: Keybindings are always global and work as long as the Keybind
        component is part of the app tree and not disabled. They automatically
        deactivate when their parent component is removed from the tree or when
        visibility is turned off.
      </Text>

    </Column>
  );

  return container;
};
