import { Art, Column, Keybind } from '../index.js';

/**
 * Landing Screen
 */
interface LandingScreenProps {
  onComplete?: () => void;
}

export const LandingScreen = ({ onComplete }: LandingScreenProps = {}) => {
  return (
    <Column align="center" width="fill" height="fill">
      {onComplete && <Keybind keyBinding="Enter" action={onComplete} />}
      <Art gap={3} sprite="enter" />
    </Column>
  );
};
