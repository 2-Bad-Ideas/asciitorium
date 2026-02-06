import {
  AssetManager,
  type MapAsset,
  type LegendEntry,
  type MaterialAsset,
} from '../core/AssetManager.js';

import { State } from '../core/State.js';
import type { Direction, Position } from '../components/MapView.js';
import { SoundManager } from '../core/SoundManager.js';
import { type GameEntity } from './GameEntity.js';

const ALREADY_PLURAL = ['coins', 'grass'];

function articleFor(noun: string): string {
  if (ALREADY_PLURAL.includes(noun)) return '';
  return 'aeiou'.includes(noun[0]?.toLowerCase() ?? '') ? 'an ' : 'a ';
}

export interface MapEngineOptions {
  mapAsset: State<MapAsset | null>;
  message?: State<string>;
}

export class MapEngine {
  private mapState: State<MapAsset | null>;
  private messageState: State<string> | undefined;
  private previousPositions = new Map<GameEntity, { x: number; y: number }>();

  constructor(options: MapEngineOptions) {
    this.mapState = options.mapAsset;
    this.messageState = options.message;
  }

  getMapState(): State<MapAsset | null> {
    return this.mapState;
  }

  getMapData(): string[] {
    return this.mapState.value?.mapData ?? [];
  }

  getLegend(): Record<string, LegendEntry> {
    return this.mapState.value?.legend ?? {};
  }

  isReady(): boolean {
    return this.mapState.value !== null;
  }

  // Legend interpretation methods
  getLegendEntry(char: string): LegendEntry | undefined {
    return this.getLegend()[char];
  }

  getCharAt(x: number, y: number): string | undefined {
    const mapData = this.getMapData();
    if (y < 0 || y >= mapData.length) return undefined;
    if (x < 0 || x >= mapData[y].length) return undefined;
    return mapData[y][x];
  }

  isSolidChar(char: string): boolean {
    const entry = this.getLegend()[char];
    return entry?.solid ?? false;
  }

  isSolid(x: number, y: number): boolean {
    const char = this.getCharAt(x, y);
    if (char === undefined) return true; // Out of bounds = solid
    return this.isSolidChar(char);
  }

  // Movement methods
  moveForward(entity: GameEntity): void {
    const pos = entity.position.value;
    const { dx, dy } = this.getDirectionVector(pos.direction);
    this.moveEntity(entity, dx, dy, pos.direction);
  }

  moveBackward(entity: GameEntity): void {
    const pos = entity.position.value;
    const oppositeDir = this.getOppositeDirection(pos.direction);
    const { dx, dy } = this.getDirectionVector(oppositeDir);
    this.moveEntity(entity, dx, dy, pos.direction);
  }

  turnLeft(entity: GameEntity): void {
    const pos = entity.position.value;
    entity.position.value = {
      ...pos,
      direction: this.getNewDirection(pos.direction, 'left'),
    };
  }

  turnRight(entity: GameEntity): void {
    const pos = entity.position.value;
    entity.position.value = {
      ...pos,
      direction: this.getNewDirection(pos.direction, 'right'),
    };
  }

  pickupItem(entity: GameEntity): boolean {
    const { x, y } = entity.position.value;
    const char = this.getCharAt(x, y);
    const legendEntry = char ? this.getLegendEntry(char) : undefined;

    if (!legendEntry || legendEntry.entity !== 'item') {
      this.setMessage('');
      return false;
    }

    const name = legendEntry.name ?? legendEntry.material;

    entity.addItem({
      id: legendEntry.material,
      name,
    });

    this.setCharAt(x, y, ' ');
    SoundManager.playSound('pickup-item.mp3');
    this.setMessage(`you picked up ${articleFor(name)}${name}`);
    return true;
  }

  // Private helper methods
  private getDirectionVector(direction: Direction): { dx: number; dy: number } {
    switch (direction) {
      case 'north':
        return { dx: 0, dy: -1 };
      case 'south':
        return { dx: 0, dy: 1 };
      case 'east':
        return { dx: 2, dy: 0 }; // 2 units for east/west to match map aspect ratio
      case 'west':
        return { dx: -2, dy: 0 };
    }
  }

  private getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case 'north':
        return 'south';
      case 'south':
        return 'north';
      case 'east':
        return 'west';
      case 'west':
        return 'east';
    }
  }

  private getNewDirection(
    current: Direction,
    turn: 'left' | 'right'
  ): Direction {
    const directions: Direction[] = ['north', 'east', 'south', 'west'];
    const currentIndex = directions.indexOf(current);
    const offset = turn === 'left' ? -1 : 1;
    const newIndex = (currentIndex + offset + 4) % 4;
    return directions[newIndex];
  }

  private async moveEntity(
    entity: GameEntity,
    dx: number,
    dy: number,
    direction: Direction
  ): Promise<boolean> {
    const pos = entity.position.value;
    const mapData = this.getMapData();
    const mapHeight = mapData.length;
    const mapWidth = mapHeight > 0 ? mapData[0].length : 0;

    if (mapWidth === 0 || mapHeight === 0) return false;

    const newX = Math.max(0, Math.min(mapWidth - 1, pos.x + dx));
    const newY = Math.max(0, Math.min(mapHeight - 1, pos.y + dy));

    // Check intermediate positions for horizontal movement (2 steps)
    if (Math.abs(dx) === 2) {
      const stepX = dx > 0 ? 1 : -1;
      const midX = pos.x + stepX;
      if (this.isSolid(midX, pos.y)) {
        const blockingChar = this.getCharAt(midX, pos.y);
        const blockingEntry = blockingChar ? this.getLegendEntry(blockingChar) : undefined;
        const blockingName = blockingEntry?.name ?? blockingEntry?.material ?? 'obstacle';
        this.setMessage(`you are blocked by ${articleFor(blockingName)}${blockingName}`);
        return false;
      }
    }

    // Check final destination
    if (this.isSolid(newX, newY)) {
      const blockingChar = this.getCharAt(newX, newY);
      const blockingEntry = blockingChar ? this.getLegendEntry(blockingChar) : undefined;
      const blockingName = blockingEntry?.name ?? blockingEntry?.material ?? 'obstacle';
      this.setMessage(`you cannot move forward, blocked by ${articleFor(blockingName)}${blockingName}`);
      return false;
    }

    // Trigger onExit sound for the old tile before moving
    const prev = this.previousPositions.get(entity);
    let soundPlayed = false;
    if (prev) {
      soundPlayed = await this.checkAndPlayExitSound(prev.x, prev.y);
    }

    // Move successful
    entity.position.value = { x: newX, y: newY, direction };

    // Update previous position for this entity
    this.previousPositions.set(entity, { x: newX, y: newY });

    // Clear message by default; checkForItem will set one if relevant
    this.setMessage('');

    // Trigger onEnter sound for the new tile
    const enterSoundPlayed = await this.checkAndPlayTileSound(newX, newY);
    soundPlayed = soundPlayed || enterSoundPlayed;

    // Notify if landing on an item
    this.checkForItem(newX, newY);

    // Play step sound if no other sound was played
    if (!soundPlayed) {
      SoundManager.playSound('step.mp3');
    }

    return true;
  }

  private checkForItem(x: number, y: number): void {
    const char = this.getCharAt(x, y);
    if (!char) return;

    const legendEntry = this.getLegendEntry(char);
    if (!legendEntry || legendEntry.entity !== 'item') return;

    const name = legendEntry.name ?? legendEntry.material;
    this.setMessage(`there is ${articleFor(name)}${name} here`);
  }

  private async checkAndPlayTileSound(x: number, y: number): Promise<boolean> {
    const char = this.getCharAt(x, y);
    if (!char) return false;

    const legendEntry = this.getLegendEntry(char);
    if (!legendEntry) return false;

    try {
      // Load the material asset to check for sound metadata
      const materialAsset: MaterialAsset = await AssetManager.getMaterial(
        legendEntry.material
      );

      // Check for onEnterSound in the material asset
      if (materialAsset.onEnterSound) {
        SoundManager.playSound(materialAsset.onEnterSound);
        return true;
      }
    } catch (error) {
      // Silently ignore errors loading materials or playing sounds
      console.debug('Could not check tile sound:', error);
    }
    return false;
  }

  private async checkAndPlayExitSound(x: number, y: number): Promise<boolean> {
    const char = this.getCharAt(x, y);
    if (!char) return false;

    const legendEntry = this.getLegendEntry(char);
    if (!legendEntry) return false;

    try {
      // Load the material asset to check for sound metadata
      const materialAsset: MaterialAsset = await AssetManager.getMaterial(
        legendEntry.material
      );

      // Check for onExitSound in the material asset
      if (materialAsset.onExitSound) {
        SoundManager.playSound(materialAsset.onExitSound);
        return true;
      }
    } catch (error) {
      // Silently ignore errors loading materials or playing sounds
      console.debug('Could not check exit sound:', error);
    }
    return false;
  }

  private setMessage(msg: string): void {
    if (this.messageState) {
      this.messageState.value = msg;
    }
  }

  private setCharAt(x: number, y: number, char: string): void {
    const mapAsset = this.mapState.value;
    if (!mapAsset) return;

    const row = mapAsset.mapData[y];
    if (!row || x < 0 || x >= row.length) return;

    mapAsset.mapData[y] = row.substring(0, x) + char + row.substring(x + 1);

    // Reassign to trigger reactive update
    this.mapState.value = { ...mapAsset };
  }
}
