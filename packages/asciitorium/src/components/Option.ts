import { Component, ComponentProps } from '../core/Component.js';
import { State } from '../core/State.js';

export interface OptionProps<T = any> extends Omit<ComponentProps, 'children'> {
  value: T;
  children?: string | State<string>;
}

export class Option<T = any> extends Component {
  public readonly value: T;
  declare public readonly label: string;

  constructor(props: OptionProps<T>) {
    const { children: childrenString, ...componentProps } = props;

    // Determine label value: use children if provided, otherwise use value as string
    const labelValue = childrenString || String(props.value);

    super({
      ...componentProps,
      width: 0,
      height: 0,
      visible: new State(false), // Data-only component, not visual
      label: labelValue, // Pass label to parent Component which handles State/string
    });
    this.value = props.value;
  }

  override draw(): string[][] {
    // Option is not rendered directly, it's just a data container
    return [[]];
  }
}
