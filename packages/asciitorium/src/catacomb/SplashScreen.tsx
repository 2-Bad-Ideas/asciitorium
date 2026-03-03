import {
  Art,
  Banner,
  Line,
  Column,
  Keybind,
  Row,
  SoundManager,
  State,
  Switch,
  Text,
  Case,
} from '../index.js';

/**
 * Splash Screen
 */
interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps = {}) => {
  const showPresents = new State('company');
  const showTagline = new State(false);

  // After 4 seconds, switch to "Presents..." banner
  const timer = setTimeout(() => {
    showPresents.value = 'presents';
    // After 8 seconds, switch to "Title..." banner
    setTimeout(() => {
      showPresents.value = 'title';
      // After 3 more seconds, show the tagline
      setTimeout(() => {
        showTagline.value = true;
        setTimeout(() => {
          showPresents.value = 'prologue';
        }, 6000);
      }, 4000);
    }, 4000);
  }, 4000);

  // Company splash content
  const Company = () => (
    <Row align="center" width={84} height={30}>
      <Art sprite="bulb" gap={{ bottom: 4 }} />
      <Column align="center" gap={1}>
        <Banner font="marker" letterSpacing={1} text="2Bad" />
        <Banner font="marker" letterSpacing={1} text="Ideas" />
        <Line width={24} />
        <Banner font="pencil" text="Studios" />
      </Column>
    </Row>
  );

  // Presents banner content
  const Presents = () => <Banner font="pencil" text="Presents..." />;

  const Title = () => (
    <Column align="center" width={84} height={30}>
      <Art sprite="catacomb" />
      {/* prettier-ignore */}
      <Text visible={showTagline}>T h e   T o m b   o f   T a h a r a</Text>
    </Column>
  );

  const Prologue = () => (
    <Column align="center" width="fill" height="fill">
      <Banner font="marker" letterSpacing={1} text="Prologue" />

      {/* prettier-ignore */}
      <Text width={60} gap={{top: 2}} textAlign="top-left" height="fill" typewriter>
        For hundreds of years the scavenger tribes have lived with the Withering, 
        a plague that has made the land barren and inhospitable. But Tahara was not always this way. 
        Each year, when the land grows weakest, one is chosen to enter in hopes of finding the veilstone. The catacombs do not open. They wait. Someone must enter.

        No one stands with you now.

        The stone shaft yawns at your feet, older than the tribes, older than the stories. You shoulder your satchel—torch, blade, flute packed tight—and take one last breath of the surface air.

        There is no path down.
        Only the drop.

        You step forward.

        The satchel tears free as you fall.

        Cold air roars past. Stone scrapes skin. The world turns.

        Then—

        Impact.

        Darkness. Dust. Pain.

        You are alive.

        Somewhere below, something hums.

        The catacombs have accepted you.
        ¶¶
      </Text>

      <Text textAlign="bottom" gap={2}>
        Press [Enter] ...
      </Text>
    </Column>
  );

  const container = (
    <Row align="center" width="fill" height="fill">
      {onComplete && <Keybind keyBinding="Enter" action={onComplete} />}
      <Switch condition={showPresents}>
        <Case when="company" create={Company} />
        <Case when="presents" create={Presents} />
        <Case when="title" create={Title} />
        <Case when="prologue" create={Prologue} />
      </Switch>
    </Row>
  );

  // Play background music when title screen appears
  SoundManager.playSound('andalusian-reverie.mp3', true).catch(() => {
    console.warn('Failed to play title screen music');
  });

  // Stop music when component is destroyed (screen changes)
  container.registerCleanup(() => {
    clearTimeout(timer);
    SoundManager.fadeToStop('andalusian-reverie.mp3');
  });

  return container;
};
