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
      <Text visible={showTagline}>T h e T o m b o f T a h a r a</Text>
    </Column>
  );

  const Prologue = () => (
    <Column align="center" width="fill" height="fill">
      <Banner font="marker" letterSpacing={1} text="Prologue" />

      {/* prettier-ignore */}
      <Text width={60} gap={{top: 2}} textAlign="top-left" height="fill" typewriter>
        Long ago, Tahara was a land of perfect balance, 
        sustained by a living relic known as the Veilstone.¶¶

        When an ancient force of chaos shattered that balance, 
        and guardians who protected it were lost, 
        the catacombs beneath Tahara were corrupted.¶¶
        
        Now the Veilstone weakens, feeding a spreading rot known as the Withering. 
        Drawn by fate or some other force, you've stumbled and fell into the catacombs below.¶¶
        Restore the balance… or be consumed by the dark.¶¶
        your story begins now.
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
