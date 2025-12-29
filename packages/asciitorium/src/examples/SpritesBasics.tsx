import { Art, Line, Column, Text, Row } from '../index.js';
import { BaseStyle } from './constants.js';

/**
 * Sprites Basics
 *
 * Guide to using animated ASCII sprites in asciitorium.
 */
export const SpritesBasics = () => {
  const container = (
    <Column style={BaseStyle} label="Sprites Basics">
      <Text width="90%" gap={{ top: 1 }}>
        Sprites
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 2 }}>
        Sprites are stored in the art/sprites/ directory and can be loaded using
        the Art component or referenced in map legends via the asset property.
      </Text>
      <Art sprite="beating-heart" />

      <Text width="90%">
        Using Sprites
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4 }}>
        Display sprites using the Art component:
      </Text>

      <Text
        width={56}
        textAlign="center"
        border
        align="center"
        gap={{ left: 4, top: 1, bottom: 1 }}
      >
        {`<Art sprite="beating-heart" />`}
      </Text>

      <Text width="90%">
        Tip: To learn how to create your own sprites, check out the
        documentation in the public/art/sprites directory.
      </Text>
    </Column>
  );

  return container;
};
