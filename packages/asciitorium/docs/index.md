---
layout: home

hero:
  name: asciitorium
  text: ASCII-based UI Framework
  tagline: Build green-screen text interfaces for web and CLI
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/README
    - theme: alt
      text: View on GitHub
      link: https://github.com/tgruby/asciitorium

features:
  - icon: 🖥️
    title: Dual Environment
    details: Runs seamlessly in both web browsers and terminal environments with the same codebase. Write once, deploy anywhere.

  - icon: 🧩
    title: Component-Based
    details: Build UIs with reusable components using a custom JSX runtime. Familiar React-like syntax without the overhead.

  - icon: ⚡
    title: Zero Dependencies
    details: No runtime dependencies - just pure TypeScript. Lightweight, fast, and easy to integrate into any project.

  - icon: 🎮
    title: Game Development
    details: Built-in support for ASCII games with MapView, FirstPersonView, collision detection, and asset management.

  - icon: 🎨
    title: Flexible Layouts
    details: Powerful layout system with Row/Column containers, alignment options, and both relative and absolute positioning.

  - icon: ⌨️
    title: Keyboard Navigation
    details: Full keyboard navigation support with Tab/Shift-Tab, hotkeys, and focus management built-in.
---

## Quick Example

```tsx
import { App, Button, Row } from 'asciitorium';

const app = (
  <App>
    <Row align="center">
      <Button onClick={() => console.log('Hello, asciitorium!')}>
        Click Me
      </Button>
    </Row>
  </App>
);
```

## Why asciitorium?

- **🚀 Fast**: Character-based rendering with minimal overhead
- **📦 Portable**: Same code runs in browsers and terminals
- **🛠️ TypeScript**: Full type safety and excellent IDE support
- **🎯 Focused**: Designed for text UIs, not trying to be everything
- **🔧 Extensible**: Create custom components by extending the base class

## Getting Started

Install asciitorium via npm:

```bash
npm install asciitorium
```

Then create your first application:

```tsx
import { App, Text } from 'asciitorium';

const app = (
  <App>
    <Text>Hello, World!</Text>
  </App>
);
```

[Read the full guide](/guide/getting-started) to learn more.
