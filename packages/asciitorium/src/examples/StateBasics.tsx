import {
  Line,
  Column,
  Text,
  State,
  PersistentState,
  TextInput,
} from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * State Basics
 *
 * Guide to reactive state management in asciitorium.
 */
export const StateBasics = () => {
  // Regular State - resets when page reloads
  const textValue = new State('Type something here!');

  // PersistentState - persists across page reloads
  const persistentCounter = new PersistentState(0, 'demo-persistent-counter');

  return (
    <Column style={BaseStyle} label="State Basics">

      <Text width="90%" gap={{ top: 1 }}>
        State (In-Memory Reactivity)
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        State provides reactive variables that trigger re-renders when changed.
        Use for temporary values that reset on page reload.
      </Text>

      <Column width="90%" align="center" gap={{ bottom: 1 }}>
        <TextInput width="90%" hotkey="i" value={textValue} />
        <Text gap={{ top: 1, bottom: 1 }}>
          You typed: {textValue}
        </Text>
      </Column>

      <Text width="90%">
        State API
      </Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • new State&lt;T&gt;(initialValue) — Create reactive state ¶
        • state.value — Get or set the current values ¶
      </Text>

      <Text width="90%">
        PersistentState (localStorage Backed)
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Asciitorium also supports PersistentState in the browser which extends State with
        automatic localStorage persistence. Values survive page reloads.
      </Text>

      <Text width="90%">
        Tip: You can also use subscribe() for custom side effects when state changes.
      </Text>
    </Column>
  );
};
