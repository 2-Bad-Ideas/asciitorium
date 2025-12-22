import { Line, Column, Row, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Layout Basics
 *
 * Guide to layout approaches in asciitorium.
 */
export const LayoutBasics = () => {
  return (
    <Column style={BaseStyle} label="Layout Basics">

      <Text width="90%" gap={{ top: 1 }}>
        Available Layout Types
      </Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • Row Layout — arranges children horizontally ¶
        • Column Layout — arranges children vertically ¶
      </Text>
      <Column
        width="90%"
        align="center"
        border
        label="Layout Example"
        height={15}
      >
        <Text border width="fill">
          Header
        </Text>
        <Row height="fill">
          <Column width={14} height="fill" border>
            <Text>Nav Item 1</Text>
            <Text>Nav Item 2</Text>
            <Text>Nav Item 3</Text>
          </Column>
          <Column width="fill" height="fill" border>
            <Text>Main Content Area</Text>
          </Column>
        </Row>
        <Text border width="fill">
          Footer
        </Text>
      </Column>

      <Text width="90%" gap={{ top: 1 }}>
        * For absolute positioning you can use the position prop:
      </Text>

      <Text
        width="90%"
        align="center"
        wrap={false}
      >
{`
  <Text position={{ x: 10, y: 5 }}>
    Fixed Position
  </Text>
`}
      </Text>
    </Column>
  );
};
