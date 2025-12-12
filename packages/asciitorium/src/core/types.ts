/**
 * Core type definitions for the asciitorium framework.
 *
 * This module contains fundamental type definitions used throughout the framework
 * for component styling, positioning, and layout.
 *
 * @module types
 */

import { Component } from './Component.js';
import { LayoutOptions, LayoutType } from './layouts/Layout.js';

/**
 * Alignment options for positioning children within a container.
 *
 * Used by Row and Column containers to position all children as a unified group.
 * Supports both full 9-position values and convenient shorthands.
 *
 * **Full 9-position values:**
 * - `'top-left'`, `'top-center'`, `'top-right'`
 * - `'center-left'`, `'center'`, `'center-right'`
 * - `'bottom-left'`, `'bottom-center'`, `'bottom-right'`
 *
 * **Shorthands (auto-center on opposite axis):**
 * - `'left'` → `'center-left'`
 * - `'right'` → `'center-right'`
 * - `'top'` → `'top-center'`
 * - `'bottom'` → `'bottom-center'`
 *
 * @example
 * ```tsx
 * <Row align="center" width={80} height={24}>
 *   <Text>Child content</Text>
 * </Row>
 * ```
 */
export type Alignment =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'left' | 'right' | 'top' | 'bottom';

/**
 * Size value types supporting both absolute and relative sizing.
 *
 * Components can be sized using:
 * - **Absolute**: Exact character count (e.g., `20`)
 * - **Percentage**: Relative to parent size (e.g., `'50%'`)
 * - **Auto**: Size to fit content
 * - **Fill**: Expand to fill available space
 *
 * @example
 * ```tsx
 * // Absolute size
 * <Button width={20} height={3}>Click Me</Button>
 *
 * // Percentage of parent
 * <Button width="50%" height="100%">Click Me</Button>
 *
 * // Auto-size to content
 * <Button width="auto" height="auto">Click Me</Button>
 *
 * // Fill available space
 * <Button width="fill" height={3}>Click Me</Button>
 * ```
 */
export type SizeValue =
  | number                    // Absolute size in characters
  | `${number}%`             // Percentage of parent
  | 'auto'                   // Size to content
  | 'fill';                  // Fill available space

/**
 * Context information used for resolving relative sizes.
 *
 * Provides parent dimensions and available space for calculating
 * percentage-based and fill-based sizing.
 */
export interface SizeContext {
  /** Width of the parent container in characters */
  parentWidth: number;
  /** Height of the parent container in characters */
  parentHeight: number;
  /** Available width after accounting for siblings and gaps */
  availableWidth: number;
  /** Available height after accounting for siblings and gaps */
  availableHeight: number;
}

/**
 * Gap (spacing) configuration for components.
 *
 * Supports multiple formats for convenience:
 * - **Number**: Same gap on all sides
 * - **Object**: Individual control per side with shorthands
 * - **Array**: CSS-style shorthand `[top, right, bottom, left]`
 *
 * @example
 * ```tsx
 * // Same gap on all sides
 * <Row gap={2}>...</Row>
 *
 * // Individual sides
 * <Row gap={{ top: 1, bottom: 2, left: 3, right: 4 }}>...</Row>
 *
 * // Shorthands (x = left+right, y = top+bottom)
 * <Row gap={{ x: 2, y: 1 }}>...</Row>
 *
 * // CSS-style array [top, right, bottom, left]
 * <Row gap={[1, 2, 1, 2]}>...</Row>
 * ```
 */
export type GapValue =
  | number
  | {
      /** Gap above the component */
      top?: number;
      /** Gap below the component */
      bottom?: number;
      /** Gap to the left of the component */
      left?: number;
      /** Gap to the right of the component */
      right?: number;
      /** Shorthand for left + right gap */
      x?: number;
      /** Shorthand for top + bottom gap */
      y?: number;
    }
  | number[]; // CSS-style shorthand: [top, right, bottom, left]

/**
 * Position configuration for exact coordinate placement.
 *
 * When a component has a `position` prop, it uses absolute positioning
 * and is removed from layout flow. Z-index controls rendering order.
 *
 * @example
 * ```tsx
 * <Text position={{ x: 0, y: 0, z: 100 }}>
 *   TOP LEFT
 * </Text>
 * ```
 */
export type PositionValue = {
  /** X coordinate (horizontal position in characters) */
  x?: number;
  /** Y coordinate (vertical position in characters) */
  y?: number;
  /** Z-index for layering (higher values render on top) */
  z?: number;
};

/**
 * Consolidated style properties for components.
 *
 * Components accept style properties either individually or grouped in a `style` object.
 * Individual properties take precedence over the style object.
 *
 * @example
 * ```tsx
 * // Using individual props
 * <Button width={20} height={3} border>Click Me</Button>
 *
 * // Using style object
 * <Button
 *   style={{
 *     width: 20,
 *     height: 3,
 *     border: true,
 *     background: '.',
 *     align: 'center'
 *   }}
 * >
 *   Click Me
 * </Button>
 *
 * // Individual props override style object
 * <Button style={{ width: 20 }} width={30}>
 *   Click Me
 * </Button>
 * ```
 */
export interface ComponentStyle {
  /** Component width */
  width?: SizeValue;
  /** Component height */
  height?: SizeValue;
  /** Whether to render a border */
  border?: boolean;
  /** Character used for background fill */
  background?: string;
  /** Alignment of children within this component */
  align?: Alignment;
  /** Exact coordinate placement (enables absolute positioning) */
  position?: PositionValue;
  /** Spacing around the component */
  gap?: GapValue;
  /** Font name for ASCII art text rendering */
  font?: string;
  /** Layout algorithm to use for positioning children */
  layout?: LayoutType;
}
