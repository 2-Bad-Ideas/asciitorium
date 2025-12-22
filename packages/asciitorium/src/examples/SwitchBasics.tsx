import {
  Line,
  Column,
  Row,
  Text,
  State,
  Switch,
  Case,
  Default,
  Button,
  Banner,
} from '../index.js';
import { BaseStyle } from './constants.js';

// Simple demo components
const AdminPanel = () => (
  <Column width="fill" height="fill" border label="Admin Panel" align="top">
    <Banner font="pencil" text="Admin Mode" />
    <Text>Welcome, Administrator!</Text>
    <Text>You have full access to the system.</Text>
  </Column>
);

const UserPanel = () => (
  <Column width="fill" height="fill" border label="User Panel" align="top">
    <Banner font="pencil" text="User Mode" />
    <Text>Welcome, User!</Text>
    <Text>You have limited access.</Text>
  </Column>
);

const GuestPanel = () => (
  <Column width="fill" height="fill" border label="Guest Panel" align="top">
    <Banner font="pencil" text="Guest Mode" />
    <Text>Welcome, Guest!</Text>
    <Text>Please log in to access more features.</Text>
  </Column>
);

/**
 * Switch Basics
 *
 * Guide to using Switch component for conditional rendering.
 */
export const SwitchBasics = () => {
  // State to control which panel is shown
  const userRole = new State<string>('');

  return (
    <Column style={BaseStyle} label="Switch Basics">
      <Text width="90%" gap={{ top: 1 }}>
        Switch Component for Conditional Rendering
      </Text>
      <Line width="90%" />
      <Text width="90%" gap={{ bottom: 1 }}>
        The Switch component replaces a component based state.
      </Text>

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • condition — State&lt;string&gt; to match against ¶
        • Case - when [state] then create [component] ¶
        • Default - if no case statements match, create [component] ¶
      </Text>

      <Column width="90%" height={12} gap={{ left: 4 }}>
        <Switch width="100%" height="100%" condition={userRole}>
          <Case when="admin" create={AdminPanel} />
          <Case when="user" create={UserPanel} />
          <Case when="guest" create={GuestPanel} />
          <Default create={GuestPanel} />
        </Switch>
      </Column>

      <Row width="100%" align="center" gap={{ left: 4, bottom: 1 }}>
        <Button hotkey="g" onClick={() => (userRole.value = 'guest')}>
          Guest
        </Button>
        <Button hotkey="u" onClick={() => (userRole.value = 'user')}>
          User
        </Button>
        <Button hotkey="a" onClick={() => (userRole.value = 'admin')}>
          Admin
        </Button>
      </Row>
    </Column>
  );
};
