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
  readonly companions: State<(GameEntity | null)[]>;

  private maxHealth: number;
  private itemStateCache = new Map<string, State<boolean>>();
  private readonly MAX_COMPANIONS = 2;

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
    this.companions = new State<(GameEntity | null)[]>([null, null]);

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

  /**
   * Add a companion to the first available slot (max 2 companions).
   * Returns true if successful, false if all slots are full.
   */
  addCompanion(companion: GameEntity): boolean {
    const slots = [...this.companions.value];
    const emptySlotIndex = slots.findIndex((slot) => slot === null);

    if (emptySlotIndex === -1) {
      return false; // All slots full
    }

    slots[emptySlotIndex] = companion;
    this.companions.value = slots;
    return true;
  }

  /**
   * Remove a companion from a specific slot (0 or 1).
   * Returns the removed companion, or null if slot was empty.
   */
  removeCompanion(slotIndex: number): GameEntity | null {
    if (slotIndex < 0 || slotIndex >= this.MAX_COMPANIONS) {
      return null;
    }

    const slots = [...this.companions.value];
    const removed = slots[slotIndex];
    slots[slotIndex] = null;
    this.companions.value = slots;
    return removed;
  }

  /**
   * Get companion at a specific slot (0 or 1).
   */
  getCompanion(slotIndex: number): GameEntity | null {
    if (slotIndex < 0 || slotIndex >= this.MAX_COMPANIONS) {
      return null;
    }
    return this.companions.value[slotIndex];
  }

  /**
   * Get a reactive State for a specific companion slot.
   */
  getCompanionState(slotIndex: number): State<GameEntity | null> {
    const slotState = new State<GameEntity | null>(this.getCompanion(slotIndex));

    // Subscribe to companions changes and update this slot's state
    this.companions.subscribe((companions) => {
      if (slotIndex >= 0 && slotIndex < companions.length) {
        slotState.value = companions[slotIndex];
      }
    });

    return slotState;
  }

  /**
   * Check if all companion slots are full.
   */
  hasFullParty(): boolean {
    return this.companions.value.every((slot) => slot !== null);
  }

  /**
   * Get the number of active companions.
   */
  getCompanionCount(): number {
    return this.companions.value.filter((slot) => slot !== null).length;
  }
}
