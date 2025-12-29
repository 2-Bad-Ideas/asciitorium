import { Banner, Column, Text, Line } from '../index.js';
import { BaseStyle } from './constants.js';

/**
 * Guide to using Asciitorium Fonts.
 */
export const BannerBasics = () => {
  return (
    <Column style={BaseStyle} label="Banners">
      <Banner font="pencil" text="pencil" letterSpacing={0} align="center" />
      <Banner font="marker" text="marker" letterSpacing={1} align="center" />
      <Banner font="pixel" text="pixel" letterSpacing={1} align="center" />

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
        {`<Banner font="marker" text="marker" />`}
      </Text>

      <Text width="90%" gap={{ bottom: 2 }}>
        TIP: Fonts for banners are stored in the public/art/fonts/ directory with the
        .art extension.
      </Text>
    </Column>
  );
};
