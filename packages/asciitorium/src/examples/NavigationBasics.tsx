import {
  Art,
  Line,
  Column,
  Row,
  Text,
  Button,
  State,
  BarSlider,
  DotSlider,
  ProgressBarSlider,
  GaugeSlider,
} from '../index.js';
import { BaseStyle } from './constants.js';

/**
 * Navigation Basics
 *
 * Guide to keyboard navigation and focus management in asciitorium.
 */
export const NavigationBasics = () => {
  const counter = new State<number>(5);

  return (
    <Column style={BaseStyle} label="Navigation Basics">
      <Text width="90%" gap={{ top: 1 }}>
        Navigation Keys
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ bottom: 1 }}>
        Asciitorium uses [Tab] + [Tab+Shift] to move between components. Focused
        components use a '{'>'}' to indicate they have focus.
      </Text>

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • Tab — focus on next focusable component ¶
        • Shift+Tab — focus on previous focusable component ¶
        • Space — press button ¶
      </Text>

      <Text width="90%" gap={{ bottom: 1 }}>
        Try navigating between these two buttons using [Tab], [Shift+Tab]
      </Text>

      <Column width="90%" align="center" gap={{ bottom: 1 }}>
        <ProgressBarSlider
          width={50}
          align="center"
          gap={{ bottom: 1 }}
          value={counter}
          min={0}
          max={20}
          readonly
        />
        <BarSlider
          width={50}
          align="center"
          gap={{ bottom: 1 }}
          value={counter}
          min={0}
          max={20}
          readonly
        />
        <GaugeSlider
          width={50}
          align="center"
          gap={{ bottom: 1 }}
          value={counter}
          min={0}
          max={20}
          readonly
        />
        <DotSlider
          width={50}
          align="center"
          gap={{ bottom: 1 }}
          value={counter}
          min={0}
          max={20}
          readonly
        />
      </Column>

      <Row width="fill" align="center" gap={{ bottom: 2 }}>
        <Button
          height={6}
          hotkey="a"
          onClick={() => {
            if (counter.value > 0) counter.value--;
          }}
        >
          Decrement
        </Button>
        <Button
          height={6}
          hotkey="s"
          onClick={() => {
            if (counter.value < 20) counter.value++;
          }}
        >
          Increment
        </Button>
      </Row>
    </Column>
  );
};
