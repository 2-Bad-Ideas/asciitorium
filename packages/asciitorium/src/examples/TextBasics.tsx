import { Line, Column, Row, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Text Component Basics
 *
 * Guide to using the Text component with textAlign and other properties.
 */
export const TextBasics = () => {
  return (
    <Column style={BaseStyle} label="Text Component Basics">
      <Text width="90%" gap={{ top: 1 }}>Common Properties</Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }} typewriter>
        • textAlign — Position text within component (9-point grid) ¶
        • wrap — Enable/disable text wrapping (default: true) ¶
        • scrollable — Enable scrolling for long content (default: false) ¶
        • typewriter — Enable typewriter effect (default: false) ¶
        • typewriterSpeed — Speed of typewriter effect (chars per second) ¶
        • typewriterPauseFactor — Pause multiplier after periods (default: 10) ¶
        • \¶ — use \¶ to insert a line break within text ¶
      </Text>

      <Text width="90%">Text Alignment</Text>
      <Line width="90%" />

      <Row width={15} align="center">
        <Text height={5} width={5} border textAlign="top-left">
          A
        </Text>
        <Text width={5} height={5} border textAlign="top">
          B
        </Text>
        <Text width={5} height={5} border textAlign="top-right">
          C
        </Text>
      </Row>

      <Row width={15} align="center">
        <Text height={5} width={5} border textAlign="left">
          D
        </Text>
        <Text width={5} height={5} border textAlign="center">
          E
        </Text>
        <Text width={5} height={5} border textAlign="right">
          F
        </Text>
      </Row>

      <Row width={15} align="center">
        <Text height={5} width={5} border textAlign="bottom-left">
          G
        </Text>
        <Text width={5} height={5} border textAlign="bottom">
          H
        </Text>
        <Text width={5} height={5} border textAlign="bottom-right">
          I
        </Text>
      </Row>
    </Column>
  );
};
