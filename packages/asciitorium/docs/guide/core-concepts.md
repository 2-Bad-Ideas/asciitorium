# Core Concepts

Understanding these core concepts will help you build better asciitorium applications.

## Component Hierarchy

All UI elements in asciitorium are components that extend the base `Component` class:

```
Component (abstract)
├── App
├── Text
├── Button
├── Row
├── Column
├── TextInput
└── ... (more components)
```

Every asciitorium application starts with an `App` component as the root.

## Reactive State

asciitorium uses a simple reactive state system with `State<T>`:

```tsx
import { State } from 'asciitorium';

const count = new State(0);

// Subscribe to changes
count.subscribe((value) => {
  console.log('Count changed to:', value);
});

// Update the value
count.value = 42; // Triggers subscriber
```

### State with Components

Components can bind to state for automatic updates:

```tsx
const message = new State('Hello');

const display = (
  <Text width={20}>
    {message}
  </Text>
);

message.value = 'World'; // Text component updates automatically
```

## Layout System

asciitorium provides two positioning modes:

### 1. Relative Positioning (Default)

Components are positioned by layout containers (`Row` and `Column`):

```tsx
<Column gap={2} align="center">
  <Text>First</Text>
  <Text>Second</Text>
  <Text>Third</Text>
</Column>
```

### 2. Absolute Positioning

Components with a `position` prop are removed from layout flow:

```tsx
<Text position={{ x: 10, y: 5, z: 100 }}>
  Overlay
</Text>
```

## Sizing System

Components support multiple sizing modes:

### Absolute Sizing

```tsx
<Button width={20} height={10}>
  Click Me
</Button>
```

### Relative Sizing

```tsx
<Button width="50%" height="100%">
  Click Me
</Button>
```

### Content-Based Sizing

```tsx
<Button width="auto" height="auto">
  Click Me
</Button>
```

### Fill Available Space

```tsx
<Button width="fill" height={3}>
  Click Me
</Button>
```

## Focus Management

The `FocusManager` handles keyboard navigation:

### Tab Navigation

Press `Tab` to move forward, `Shift+Tab` to move backward through focusable components.

```tsx
<Column>
  <Button focusable>First</Button>
  <Button focusable>Second</Button>
</Column>
```

### Hotkeys

Components can have hotkeys for quick access:

```tsx
<Button hotkey="s" onClick={() => save()}>
  Save
</Button>
```

Press `F1` or backtick (`` ` ``) to toggle hotkey visibility.

### Capture Mode

Input components like `TextInput` use capture mode to receive all keystrokes:

```tsx
const inputValue = new State('');

<TextInput
  value={inputValue}
  captureModeActive
/>
```

## Rendering System

### Character-Based Rendering

Components render to 2D character arrays:

```typescript
class MyComponent extends Component {
  override draw(): string[][] {
    // Create buffer
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => ' ')
    );

    // Draw content
    this.buffer[0][0] = 'H';
    this.buffer[0][1] = 'i';

    return this.buffer;
  }
}
```

### Transparency

The transparent character `'‽'` allows components to overlay:

```typescript
// This character won't overwrite what's underneath
this.buffer[y][x] = this.transparentChar;
```

### Z-Index Layering

Higher z-index values render on top:

```tsx
<>
  <Text position={{ x: 0, y: 0, z: 0 }}>
    Background
  </Text>
  <Text position={{ x: 0, y: 0, z: 100 }}>
    Foreground
  </Text>
</>
```

## Dual Renderer Architecture

asciitorium automatically detects the environment:

### DOMRenderer (Web)

- Renders to a `<pre id="screen">` element
- Handles mouse and keyboard events
- Uses browser APIs

### TTYRenderer (CLI)

- Renders to terminal using Node.js TTY
- Handles terminal resize events
- Uses ANSI escape codes

You don't need to choose - asciitorium picks the right one automatically.

## Performance

### Render Scheduling

Components request renders via the `RenderScheduler`:

```typescript
import { requestRender } from 'asciitorium';

// Request a render on next frame
requestRender();
```

Renders are batched and deduplicated for efficiency.

### Performance Monitoring

The `App` class tracks performance metrics:

```tsx
const app = (
  <App>
    <PerfMonitor position={{ x: 0, y: 0, z: 1000 }} />
  </App>
);
```

## Event Handling

### Keyboard Events

Components can handle keyboard events:

```typescript
class MyComponent extends Component {
  handleEvent(event: string): boolean {
    if (event === 'Enter') {
      console.log('Enter pressed!');
      return true;  // Event handled
    }
    return false;  // Event not handled
  }
}
```

### Click Events

Buttons and other interactive components use callbacks:

```tsx
<Button onClick={() => console.log('Clicked!')}>
  Click Me
</Button>
```

## Border System

Components can display borders:

```tsx
<Text border width={20} height={5}>
  Bordered
</Text>
```

Focused components automatically switch to double-line borders:

```
Normal:  ╭──────╮
         │Content│
         ╰──────╯

Focused: ╔══════╗
         ║Content║
         ╚══════╝
```

## Gap (Spacing)

Control spacing around components:

```tsx
{/* Same gap on all sides */}
<Column gap={2}>

{/* Individual sides */}
<Column gap={{ top: 1, bottom: 2, left: 3, right: 4 }}>

{/* Shorthands */}
<Column gap={{ x: 2, y: 1 }}>

{/* CSS-style array [top, right, bottom, left] */}
<Column gap={[1, 2, 1, 2]}>
```

## Custom Components

Create custom components by extending `Component`:

```typescript
import { Component, ComponentProps } from 'asciitorium';

interface MyComponentOptions extends ComponentProps {
  title: string;
}

class MyComponent extends Component {
  private title: string;

  constructor(options: MyComponentOptions) {
    super({
      ...options,
      width: options.width ?? 30,
      height: options.height ?? 10,
      border: true
    });

    this.title = options.title;
  }

  override draw(): string[][] {
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => ' ')
    );

    // Draw title centered
    const startX = Math.floor((this.width - this.title.length) / 2);
    const y = Math.floor(this.height / 2);

    for (let i = 0; i < this.title.length; i++) {
      if (startX + i < this.width) {
        this.buffer[y][startX + i] = this.title[i];
      }
    }

    return this.buffer;
  }
}
```

## Next Steps

- Explore the [API Reference](/api/README) for detailed component documentation
- Check out [examples](https://github.com/tgruby/asciitorium/tree/main/packages/asciitorium/examples) for real-world usage
- Learn about [game development features](https://github.com/tgruby/asciitorium#game-development) for building ASCII games
