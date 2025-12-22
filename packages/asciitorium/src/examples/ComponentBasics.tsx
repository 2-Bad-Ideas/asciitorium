import { Line, Column, Component, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Component Basics
 *
 * Guide to creating custom components in asciitorium.
 */
export const ComponentBasics = () => {
  return (
    <Column style={BaseStyle} label="Component Basics">
      <Text width="90%" gap={{ top: 1 }}>
        Common Component Properties
      </Text>
      <Line width="90%" />
      <Text width="90%">
        All components extend the base Component class. It provides a bunch of stuff:
      </Text>

      {/* prettier-ignore */}
      <Text width="90%" gap={{ top: 1, left: 6 }}>
        • width — number | percentage ¶
        • height — number | percentage ¶
        • border — default is false ¶
        • label — title for the component ¶
        • align — align component's children ¶
        • gap — Spacing within the component ¶
        • background — character to use as fill ¶
        • hotkey — keyboard shortcut to focus component ¶
        • visible — component visibility ¶
      </Text>

      <Component
        gap={1}
        width={32}
        height={5}
        label="Component"
        align="center"
        border
      />
    </Column>
  );
};
