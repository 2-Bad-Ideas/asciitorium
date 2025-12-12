# Getting Started

This guide will help you get up and running with asciitorium.

## Installation

Install asciitorium via npm:

```bash
npm install asciitorium
```

## Your First Application

Create a simple "Hello World" application:

```tsx
import { App, Text } from 'asciitorium';

const app = (
  <App>
    <Text width={40} height={10} border>
      Hello, World!
    </Text>
  </App>
);
```

This creates an application with a single text component inside a bordered box.

## Web vs CLI

asciitorium automatically detects whether it's running in a web browser or terminal:

### Web (Browser)

```tsx
// index.tsx
import { App, Button } from 'asciitorium';

const app = (
  <App>
    <Button onClick={() => alert('Clicked!')}>
      Click Me
    </Button>
  </App>
);
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>asciitorium App</title>
  </head>
  <body>
    <pre id="screen"></pre>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

### CLI (Terminal)

```tsx
// main.tsx
import { App, Button } from 'asciitorium';

const app = (
  <App>
    <Button onClick={() => console.log('Button pressed!')}>
      Press Enter
    </Button>
  </App>
);
```

Run with:

```bash
tsx main.tsx
```

## Using Components

asciitorium provides many built-in components:

### Button

```tsx
import { Button } from 'asciitorium';

const button = (
  <Button hotkey="s" onClick={() => save()}>
    Save
  </Button>
);
```

### TextInput

```tsx
import { TextInput, State } from 'asciitorium';

const nameState = new State('');

const input = (
  <TextInput
    value={nameState}
    placeholder="Enter your name..."
    width={30}
  />
);
```

### Layout Components

```tsx
import { Row, Column, Text } from 'asciitorium';

const layout = (
  <Column align="center" gap={2}>
    <Text>Header</Text>
    <Row gap={4}>
      <Text>Left</Text>
      <Text>Right</Text>
    </Row>
  </Column>
);
```

## Reactive State

Use `State` for reactive updates:

```tsx
import { State, Text } from 'asciitorium';

const counter = new State(0);

// Updates automatically when state changes
const display = (
  <Text width={20}>
    Count: {counter}
  </Text>
);

setInterval(() => {
  counter.value += 1;
}, 1000);
```

## Using JSX

asciitorium supports JSX with a custom runtime:

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "asciitorium"
  }
}
```

```tsx
import { App, Button, Column } from 'asciitorium';

const app = (
  <App>
    <Column align="center">
      <Button onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
    </Column>
  </App>
);
```

## Next Steps

- Read [Core Concepts](/guide/core-concepts) to understand the framework architecture
- Explore the [API Reference](/api/README) for detailed component documentation
- Check out the [examples](https://github.com/tgruby/asciitorium/tree/main/packages/asciitorium/examples) in the repository

## Common Patterns

### Centering Content

```tsx
<Row align="center" width="100%" height="100%">
  {/* content */}
</Row>
```

### Responsive Sizing

```tsx
<Button width="50%" height="auto">
  Click Me
</Button>
```

### Absolute Positioning

```tsx
<Text position={{ x: 60, y: 0, z: 100 }}>
  Top Right
</Text>
```

### Focus Management

```tsx
// Press Tab to cycle through focusable components
<Column>
  <Button focusable>First</Button>
  <Button focusable>Second</Button>
  <Button focusable>Third</Button>
</Column>
```
