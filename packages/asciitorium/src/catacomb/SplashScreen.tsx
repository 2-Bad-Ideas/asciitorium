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
} from 'asciitorium';

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
      <Text visible={showTagline}>"When Heros Fall, Legends Rise"</Text>
    </Column>
  );

  const Prologue = () => (
    <Column align="center" width="fill" height="fill">
      <Banner font="marker" letterSpacing={1} text="Prologue" />

      {/* prettier-ignore */}
      <Text width={75} textAlign="top-left" height="fill" typewriter>
        The ruins of an old mining settlement cling to the rim of a deep and broken valley.
        Once beautiful and prosperous, it now leaks monsters through the earth
        like a broken sewer main. Three fissures scar the landscape and seem to be spewing this cesspool of evil: ¶¶

        • The Graveditch ¶
        • The Mine ¶
        • The Tomb ¶¶

        Rumors claim these places promise treasure and glory. Mostly, it's just death. ¶¶

        Into this bleak landscape wanders a recently graduated bard. While having no
        possessions of his own, he does carry a strain of optimism that his mother classifies as a medical concern. ¶¶ Arriving
        at the Lonely Lantern Inn, he spies a sign nailed to the outer wall: BARDS WANTED! ¶¶

        An unusual policy for a place with no visible prospects of commerce... but then again, thats why they need a bard! ¶¶
        Pushing aside a bothersome thought about the need for bards - in plural - he knocks on the door...
      </Text>

      <Text textAlign="bottom" gap={2}>
        Press [Enter] to enter the Lonely Lantern Inn...
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
  SoundManager.playSound('andalusian-reverie.mp3').catch(() => {
    console.warn('Failed to play title screen music');
  });

  // Stop music when component is destroyed (screen changes)
  container.registerCleanup(() => {
    clearTimeout(timer);
    SoundManager.clearCache();
  });

  return container;
};
