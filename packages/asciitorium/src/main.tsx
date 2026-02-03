import {
  App,
  Banner,
  Select,
  Option,
  OptionGroup,
  Switch,
  Case,
  Row,
  Column,
  PerfMonitor,
  PersistentState,
  State,
  Keybind,
  MobileController,
} from './index.js';

import {
  GettingStarted,
  ComponentBasics,
  LayoutBasics,
  NavigationBasics,
  StateBasics,
  LifecycleBasics,
  SwitchBasics,
  AlignmentBasics,
  TextBasics,
  KeybindingsBasics,
  SpritesBasics,
  BannerBasics,
  GameBasics,
} from './examples/index.js';

// Main state for component selection with persistence
const selectedKey = new PersistentState<string>(
  'start',
  'asciitorium.document.tutorial.selected'
);

// State for PerfMonitor visibility (F12 toggle)
const showPerfMonitor = new State(true);

// toggle PerfMonitor with "F12" key
const togglePerfMonitor = () => {
  showPerfMonitor.value = !showPerfMonitor.value;
};

// Create Select instance so we can reference it in keybindings
const docSelect = (
  <Select
    label="Documentation"
    width={28}
    height="fill"
    hotkey="d"
    selected={selectedKey}
  >
    <Option value="start">Getting Started</Option>
    <OptionGroup label="Components">
      <Option value="components">Component Basics</Option>
      <Option value="text">Text</Option>
      <Option value="layout">Layouts</Option>
      <Option value="align">Align & Gaps</Option>
      <Option value="navigation">Navigation</Option>
      <Option value="keybindings">Keybindings</Option>
      <Option value="state">State Management</Option>
      <Option value="lifecycle">Lifecycle & Cleanup</Option>
      <Option value="switch">Switch Component</Option>
    </OptionGroup>
    <OptionGroup label="ASCII Art Assets">
      <Option value="sprites">Sprites</Option>
      <Option value="banners">Banners</Option>
      <Option value="game">Game Engine</Option>
    </OptionGroup>
  </Select>
);

const app = (
  <App align="top-center">
    <Keybind keyBinding="F12" action={togglePerfMonitor} />

    <Banner font="shadows" text="asciitorium" gap={1} />
    <Row height="fill">
      <Column width={28} height="fill">
        {/* Explicit keybindings for Select navigation */}
        <Keybind keyBinding="ArrowDown" action={() => docSelect.moveNext()} />
        <Keybind keyBinding="ArrowUp" action={() => docSelect.movePrevious()} />
        <Keybind keyBinding="Enter" action={() => docSelect.select()} />
        <Keybind keyBinding="PageDown" action={() => docSelect.pageDown()} />
        <Keybind keyBinding="PageUp" action={() => docSelect.pageUp()} />
        <Keybind keyBinding="Home" action={() => docSelect.moveToStart()} />
        <Keybind keyBinding="End" action={() => docSelect.moveToEnd()} />

        {/* Mobile controls for Select */}
        <MobileController
          dpad={{
            up: () => docSelect.movePrevious(),
            down: () => docSelect.moveNext(),
          }}
          buttons={{
            a: () => docSelect.select(),
          }}
        />

        {docSelect}
      </Column>
      <Switch width="fill" height="fill" condition={selectedKey}>
        <Case when="start" create={GettingStarted} />
        <Case when="components" create={ComponentBasics} />
        <Case when="text" create={TextBasics} />
        <Case when="layout" create={LayoutBasics} />
        <Case when="align" create={AlignmentBasics} />
        <Case when="navigation" create={NavigationBasics} />
        <Case when="keybindings" create={KeybindingsBasics} />
        <Case when="state" create={StateBasics} />
        <Case when="lifecycle" create={LifecycleBasics} />
        <Case when="switch" create={SwitchBasics} />
        <Case when="sprites" create={SpritesBasics} />
        <Case when="banners" create={BannerBasics} />
        <Case when="game" create={GameBasics} />
      </Switch>
    </Row>
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
