import { Component, ComponentProps } from '../core/Component.js';
import { requestRender } from '../core/RenderScheduler.js';

/**
 * Configuration options for the Button component.
 *
 * Extends ComponentProps with button-specific properties like content and click handlers.
 */
export interface ButtonOptions extends Omit<ComponentProps, 'children'> {
  /** Text content to display on the button */
  content?: string;
  /** Callback function invoked when the button is clicked */
  onClick?: () => void;
  /** Child content (for JSX compatibility) */
  children?: string | string[];
}

/**
 * Interactive button component with visual feedback.
 *
 * Features:
 * - Press animation with shadow effects
 * - Focus indicators (> and < brackets)
 * - Keyboard activation (Enter or Space)
 * - Hotkey support with visual indicators
 * - Automatic sizing based on content
 *
 * The button uses a 3D shadow effect that shifts when pressed to provide
 * tactile feedback. Focus state is indicated by brackets around the content.
 *
 * @example
 * Basic button with click handler:
 * ```typescript
 * const button = new Button({
 *   content: 'Click Me',
 *   onClick: () => console.log('Clicked!'),
 *   width: 20,
 *   height: 4
 * });
 * ```
 *
 * @example
 * Button with hotkey:
 * ```typescript
 * const button = new Button({
 *   content: 'Save',
 *   hotkey: 's',
 *   onClick: () => saveFile()
 * });
 * ```
 *
 * @example
 * Using JSX:
 * ```tsx
 * <Button onClick={() => alert('Hello')}>
 *   Click Me
 * </Button>
 * ```
 */
export class Button extends Component {
  /** Public click handler that includes press animation */
  public readonly onClick?: () => void;
  /** Private click handler from options */
  private privateOnClick?: () => void;
  /** Whether the button can receive focus */
  focusable = true;
  /** Whether the button currently has focus */
  hasFocus = false;
  /** Whether the button is currently in pressed state */
  private isPressed = false;
  /** Timer for press animation duration */
  private pressTimer?: NodeJS.Timeout;

  /**
   * Creates a new Button instance.
   *
   * @param options - Button configuration options including content and click handler
   */
  constructor({ onClick, ...options }: ButtonOptions) {
    // Support both new content prop and JSX children
    let actualContent = options.content || options.label; // fallback to label for backward compatibility

    if (!actualContent && options.children) {
      const children = Array.isArray(options.children)
        ? options.children
        : [options.children];
      if (children.length > 0) {
        actualContent = children[0];
      }
    }

    const buttonText = actualContent ?? 'Button';
    const showLabel = false; // Buttons don't show label in border
    const { children, content, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width ?? options.style?.width ?? buttonText.length + 7, // padding + shadow
      height: options.height ?? options.style?.height ?? 4, // height + shadow
      border: options.border ?? options.style?.border ?? true,
      label: buttonText,
      showLabel,
    });
    this.privateOnClick = onClick;
    this.onClick = () => {
      this.privateOnClick?.();
      this.press();
    };
  }

  /**
   * Triggers the press animation.
   *
   * Sets the button to pressed state for 100ms, shifting the shadow effect
   * to provide visual feedback. Automatically returns to normal state after the animation.
   *
   * @private
   */
  private press(): void {
    // Clear any existing timer
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }

    // Set pressed state
    this.isPressed = true;

    // Return to normal state after 100ms
    this.pressTimer = setTimeout(() => {
      this.isPressed = false;
      this.pressTimer = undefined;

      // Use base class method for focus refresh (which also triggers render)
      this.notifyAppOfFocusRefresh();

      // Also try RenderScheduler as additional fallback
      requestRender();
    }, 100);
  }

  /**
   * Handles keyboard events for the button.
   *
   * Activates the button when Enter or Space is pressed.
   *
   * @param event - The keyboard event string (e.g., 'Enter', ' ')
   * @returns `true` if the event was handled, `false` otherwise
   */
  handleEvent(event: string): boolean {
    if (event === 'Enter' || event === ' ') {
      this.press();
      this.onClick?.();
      return true;
    }
    return false;
  }

  /**
   * Renders the button to a 2D character buffer.
   *
   * Draws the button with:
   * - 3D shadow effect (position shifts based on press state)
   * - Border with rounded corners
   * - Centered text content
   * - Focus indicators (> and < brackets)
   * - Hotkey label (when hotkey visibility is enabled)
   *
   * @returns 2D array of characters representing the button
   */
  override draw(): string[][] {
    // Create buffer filled with transparent chars
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => this.transparentChar)
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    // Shadow dimensions (button area is 1 less in each dimension to make room for shadow)
    const buttonWidth = this.width - 1;
    const buttonHeight = this.height - 1;

    // Draw shadow based on press state
    if (this.isPressed) {
      // Pressed: shadow on top and left
      for (let x = 0; x < buttonWidth; x++) {
        drawChar(x, 0, ' '); // top shadow
      }
      for (let y = 0; y < buttonHeight; y++) {
        drawChar(0, y, ' '); // left shadow
      }
    } else {
      // Normal: shadow on bottom and right
      for (let x = 1; x < this.width - 1; x++) {
        drawChar(x, buttonHeight, '─'); // bottom shadow
      }
      for (let y = 1; y < this.height - 2; y++) {
        drawChar(buttonWidth, y, '│'); // right shadow
      }
      drawChar(buttonWidth, buttonHeight - 1, '│');
      drawChar(1, buttonHeight, '╰');
      drawChar(buttonWidth, buttonHeight, '╯');
      drawChar(buttonWidth, 1, '╮');
    }

    // Calculate button area offset based on press state
    const offsetX = this.isPressed ? 1 : 0;
    const offsetY = this.isPressed ? 1 : 0;

    // Draw button border
    if (this.border) {
      const bw = buttonWidth;
      const bh = buttonHeight;
      const focused = this.focusable && this.hasFocus;

      // Draw corners
      drawChar(offsetX + 0, offsetY + 0, '╭');
      drawChar(offsetX + bw - 1, offsetY + 0, '╮');
      drawChar(offsetX + 0, offsetY + bh - 1, '╰');
      drawChar(offsetX + bw - 1, offsetY + bh - 1, '╯');

      // Draw horizontal and vertical lines
      for (let x = 1; x < bw - 1; x++) {
        drawChar(offsetX + x, offsetY + 0, '─');
        drawChar(offsetX + x, offsetY + bh - 1, '─');
      }
      for (let y = 1; y < bh - 1; y++) {
        drawChar(offsetX + 0, offsetY + y, '│');
        drawChar(offsetX + bw - 1, offsetY + y, '│');
      }
    }

    // Draw button content
    const padX = this.border ? 1 : 0;
    const padY = this.border ? 1 : 0;
    const contentWidth = buttonWidth - padX * 2;
    const contentHeight = buttonHeight - padY * 2;

    // Calculate label placement (centered)
    const label = this.label || 'Button';
    const totalLabelWidth = label.length + 4; // label + 2 indicators + 2 spaces
    const labelStartX =
      offsetX +
      padX +
      Math.max(Math.floor((contentWidth - totalLabelWidth) / 2), 0);
    const labelX = labelStartX + 2; // space for left indicator + space
    const labelY = offsetY + padY + Math.floor(contentHeight / 2);

    // Write the label centered
    for (
      let i = 0;
      i < label.length && labelX + i < offsetX + buttonWidth - padX;
      i++
    ) {
      drawChar(labelX + i, labelY, label[i]);
    }

    // Draw focus indicator
    // Determine indicator characters based on state
    let leftIndicator: string, rightIndicator: string;
    if (this.isPressed) {
      leftIndicator = '◆';
      rightIndicator = '◆';
    } else if (this.hasFocus) {
      leftIndicator = '>';
      rightIndicator = '<';
    } else {
      leftIndicator = ' ';
      rightIndicator = ' ';
    }

    // Draw left and right indicators at text level
    if (this.hasFocus || this.isPressed) {
      drawChar(offsetX + padX, labelY, leftIndicator);
      drawChar(offsetX + buttonWidth - padX - 1, labelY, rightIndicator);
    }

    // Draw hotkey indicator at position (1, 0) if border is enabled and hotkey visibility is on
    if (this.border && this.hotkey && this.isHotkeyVisibilityEnabled()) {
      const hotkeyDisplay = `[${this.hotkey.toUpperCase()}]`;
      for (let i = 0; i < hotkeyDisplay.length && i + 1 < this.width - 1; i++) {
        drawChar(offsetX + i + 1, offsetY + 0, hotkeyDisplay[i]);
      }
    }

    return this.buffer;
  }
}
