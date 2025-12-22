import {
  Art,
  Line,
  Column,
  Text,
  Keybind,
  State,
} from '../index.js';
import { BaseStyle } from './constants.js';

export const ControllerBasics = () => {
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
    <Column style={BaseStyle} label="Mobile Controller">

      <Text width="90%" align="center" gap={{ top: 1 }}>
        Mobile Controller
      </Text>
      <Line width="90%" />
      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        The MobileController component lets you handle virtual D-pad and button
        events, making it possible to support touch devices. You can map D-pad
        directions and buttons (A/B/X/Y/Menu) to any actions in your app, just
        like with keybindings.
      </Text>

      <Text width="90%" gap={{ left: 6 }}>
        • dpad — up/down/left/right handlers ¶ • action buttons — a/b/x/y
        handlers ¶ • menu — Handler for the menu button ¶ • enabled —
        Enable/disable the controller (can be reactive) ¶ • priority — which
        input takes priority if multiple are present
      </Text>
    </Column>
  );

  return container;
};
