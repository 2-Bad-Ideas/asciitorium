import { State } from '../core/State.js';
import type { Position } from '../components/MapView.js';

export interface Item {
  id: string;
  name: string;
  description?: string;
}

export interface DropPayload {
  items: Item[];
  coin: number;
}

export class GameEntity {
  readonly name: State<string>;
  readonly health: State<number>;
  readonly strength: State<number>;
  readonly focus: State<number>;
  readonly inventory: State<Item[]>;
  readonly coin: State<number>;
  readonly score: State<number>;
  readonly position: State<Position>;
  readonly isAlive: State<boolean>;

  private maxHealth: number;
  private itemStateCache = new Map<string, State<boolean>>();

  constructor(options: {
    name: string;
    health: number;
    strength: number;
    focus: number;
    maxHealth?: number;
    position?: Position;
  }) {
    this.name = new State(options.name);
    this.maxHealth = options.maxHealth ?? options.health;
    this.position = new State<Position>(
      options.position ?? { x: 0, y: 0, direction: 'north' }
    );
    this.health = new State(options.health);
    this.strength = new State(options.strength);
    this.focus = new State(options.focus);
    this.inventory = new State<Item[]>([]);
    this.coin = new State(0);
    this.score = new State(0);
    this.isAlive = new State(true);

    this.health.subscribe((hp) => {
      if (hp <= 0 && this.isAlive.value) {
        this.isAlive.value = false;
      }
    });

    this.inventory.subscribe((items) => {
      this.itemStateCache.forEach((state, id) => {
        state.value = items.some((i) => i.id === id);
      });
    });
  }

  getMaxHealth(): number {
    return this.maxHealth;
  }

  takeDamage(amount: number): void {
    this.health.value = Math.max(0, this.health.value - amount);
  }

  heal(amount: number): void {
    if (!this.isAlive.value) return;
    this.health.value = Math.min(this.maxHealth, this.health.value + amount);
  }

  addItem(item: Item): void {
    this.inventory.value = [...this.inventory.value, item];
  }

  removeItem(itemId: string): Item | undefined {
    const index = this.inventory.value.findIndex((i) => i.id === itemId);
    if (index === -1) return undefined;
    const removed = this.inventory.value[index];
    this.inventory.value = this.inventory.value.filter((i) => i.id !== itemId);
    return removed;
  }

  hasItem(itemId: string): boolean {
    return this.inventory.value.some((i) => i.id === itemId);
  }

  hasItemState(itemId: string): State<boolean> {
    let state = this.itemStateCache.get(itemId);
    if (!state) {
      state = new State(this.hasItem(itemId));
      this.itemStateCache.set(itemId, state);
    }
    return state;
  }

  addCoin(amount: number): void {
    this.coin.value = this.coin.value + amount;
  }

  addScore(amount: number): void {
    this.score.value = this.score.value + amount;
  }

  /**
   * Called when an NPC dies. Returns the dropped inventory and coin,
   * then clears them from the entity. No-op if the entity is still alive.
   */
  drop(): DropPayload | null {
    if (this.isAlive.value) return null;
    const payload: DropPayload = {
      items: [...this.inventory.value],
      coin: this.coin.value,
    };
    this.inventory.value = [];
    this.coin.value = 0;
    return payload;
  }
}
