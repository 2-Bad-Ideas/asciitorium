import {
  Column,
  Row,
  Button,
  State,
  Text,
} from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Dynamic Label Example
 *
 * Demonstrates how to use State<string> for component labels that update reactively.
 * This is particularly useful for game characters, companions, or any UI element
 * where the label needs to change based on game state.
 */
export const DynamicLabelExample = () => {
  // Create dynamic labels using State
  const playerName = new State<string>('Hero');
  const companionName = new State<string>('Companion');
  const changeCount = new State<number>(0);

  // Function to change the names
  const changeName = () => {
    const names = ['Warrior', 'Mage', 'Rogue', 'Paladin', 'Ranger'];
    const companions = ['Wolf', 'Eagle', 'Bear', 'Dragon', 'Phoenix'];

    changeCount.value += 1;
    playerName.value = names[changeCount.value % names.length];
    companionName.value = companions[changeCount.value % companions.length];
  };

  return (
    <Column style={BaseStyle} label="Dynamic Label Example">
      <Text width="90%" gap={{ top: 1 }}>
        Dynamic Labels with State
      </Text>

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Component labels can be State objects that update reactively.
        Click the button below to see the labels change!
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>
        {/* Column with dynamic label from State */}
        <Column label={playerName} width={30} height={10} border gap={{ right: 2 }}>
          <Text textAlign="center" gap={{ top: 2 }}>
            Player Panel
          </Text>
          <Text textAlign="center" gap={{ top: 1 }}>
            Health: 100/100
          </Text>
        </Column>

        {/* Another column with dynamic label */}
        <Column label={companionName} width={30} height={10} border>
          <Text textAlign="center" gap={{ top: 2 }}>
            Companion Panel
          </Text>
          <Text textAlign="center" gap={{ top: 1 }}>
            Health: 80/100
          </Text>
        </Column>
      </Row>

      <Button
        width={40}
        hotkey="c"
        onClick={changeName}
      >
        Change Names
      </Button>

      <Text width="90%" gap={{ top: 2 }}>
        Usage Example
      </Text>

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        // Create a State for the label ¶
        const name = new State&lt;string&gt;('Hero'); ¶
        ¶
        // Use it as a label prop ¶
        &lt;Column label=&#123;name&#125; border&gt; ¶
          ... ¶
        &lt;/Column&gt; ¶
        ¶
        // Update it anywhere ¶
        name.value = 'New Name';
      </Text>

      <Text width="90%" gap={{ top: 1 }}>
        This works with all components that accept a label prop, including
        Column, Button, and data components like Option and OptionGroup.
      </Text>
    </Column>
  );
};
