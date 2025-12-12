/**
 * Callback function type for state change notifications.
 *
 * @typeParam T - The type of value being listened to
 */
type Listener<T> = (value: T) => void;

/**
 * Reactive state management class for asciitorium components.
 *
 * Provides a simple publish-subscribe pattern that notifies listeners
 * whenever the state value changes. Subscribers are immediately notified
 * upon registration with the current value.
 *
 * This class forms the foundation of asciitorium's reactive system, enabling
 * components to automatically re-render when their dependencies change.
 *
 * @example
 * Basic usage with primitive values:
 * ```tsx
 * const count = new State(0);
 * count.subscribe((value) => console.log('Count:', value)); // Logs: "Count: 0"
 * count.value = 42; // Logs: "Count: 42"
 * ```
 *
 * @example
 * Using with components:
 * ```tsx
 * const message = new State('Hello');
 *
 * const text = (
 *   <Text width={20} height={3}>
 *     {message}
 *   </Text>
 * );
 *
 * message.value = 'World'; // Component automatically updates
 * ```
 *
 * @typeParam T - The type of value stored in the state
 */
export class State<T> {
  private listeners: Listener<T>[] = [];
  private _value: T;

  /**
   * Creates a new State instance with an initial value.
   *
   * @param initialValue - The initial value for the state
   */
  constructor(initialValue: T) {
    this._value = initialValue;
  }

  /**
   * Gets the current state value.
   *
   * @returns The current value
   */
  get value(): T {
    return this._value;
  }

  /**
   * Sets a new state value and notifies all subscribers if the value changed.
   *
   * Only triggers notifications if the new value is different from the current
   * value (using strict equality comparison).
   *
   * @param newValue - The new value to set
   */
  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.listeners.forEach((listener) => listener(newValue));
    }
  }

  /**
   * Subscribes to state changes.
   *
   * The callback function will be invoked immediately with the current value,
   * and again whenever the state value changes.
   *
   * @param fn - Callback function to invoke on state changes
   *
   * @example
   * ```tsx
   * const state = new State(5);
   * state.subscribe((value) => {
   *   console.log('Value changed to:', value);
   * });
   * ```
   */
  subscribe(fn: Listener<T>) {
    this.listeners.push(fn);
    // Immediately notify on subscribe
    fn(this._value);
  }

  /**
   * Unsubscribes from state changes.
   *
   * Removes the specified callback function from the list of subscribers.
   * The function will no longer be called when the state changes.
   *
   * @param fn - The callback function to remove
   *
   * @example
   * ```tsx
   * const state = new State(10);
   * const handler = (value) => console.log(value);
   * state.subscribe(handler);
   * state.unsubscribe(handler); // Stop listening
   * ```
   */
  unsubscribe(fn: Listener<T>) {
    this.listeners = this.listeners.filter((l) => l !== fn);
  }
}
