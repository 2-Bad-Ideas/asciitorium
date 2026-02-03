import { App, PerfMonitor, State, Keybind, Switch, Case } from 'asciitorium';

import { LandingScreen } from './LandingScreen.js';
import { SplashScreen } from './SplashScreen.js';
import { GameScreen } from './GameScreen.js';

// Single source of truth
const currentScreen = new State('landing');

// Perf monitor toggle
const showPerfMonitor = new State(false);

// Transition helpers
const screen = {
  goToLanding: () => (currentScreen.value = 'landing'),
  goToSplash: () => (currentScreen.value = 'splash'),
  goToMain: () => (currentScreen.value = 'main')
} as const;

// App root
const app = (
  <App font="PrintChar21" width={84}>
    {/* Global perf toggle */}
    <Keybind
      keyBinding="F12"
      action={() => {
        showPerfMonitor.value = !showPerfMonitor.value;
      }}
    />

    {/* Screen state machine */}
    <Switch width={84} height="fill" condition={currentScreen}>
      <Case when="landing" create={LandingScreen} with={{ onComplete: screen.goToSplash }} />
      <Case when="splash" create={SplashScreen} with={{ onComplete: screen.goToMain }} />
      <Case when="main" create={GameScreen} with={{ onComplete: screen.goToLanding }} />
    </Switch>

    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
