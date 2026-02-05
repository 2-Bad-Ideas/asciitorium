import { Component, ComponentProps } from '../core/Component.js';
import type { State } from '../core/State.js';
import { isState } from '../core/environment.js';
import { requestRender } from '../core/RenderScheduler.js';
import { type MapAsset, type LegendEntry } from '../core/AssetManager.js';

export type Direction = 'north' | 'south' | 'east' | 'west';
export type MapMode = 'all' | 'nearby' | 'explored' | 'hidden';

export interface Position {
  x: number;
  y: number;
  direction: Direction;
}

export interface MapData {
  map: string[];
}

export interface MapViewOptions extends Omit<ComponentProps, 'children'> {
  mapAsset: State<MapAsset | null>;
  player: State<Position>;
  mapMode?: MapMode | State<MapMode>;
  mapMemory?: Set<string> | State<Set<string>>;
  hiddenCharacter?: string;
  showDirection?: boolean | State<boolean>;
}

export class MapView extends Component {
  private mapAssetState: State<MapAsset | null>;
  private playerState: State<Position>;
  private mapModeSource: MapMode | State<MapMode>;
  private mapMemorySource?: Set<string> | State<Set<string>>;
  private hiddenCharacter: string;
  private showDirectionSource: boolean | State<boolean>;

  constructor(options: MapViewOptions) {
    const {
      mapAsset,
      player,
      mapMode,
      mapMemory,
      hiddenCharacter,
      showDirection,
      style,
      ...componentProps
    } = options;

    super({
      ...componentProps,
      width: options.width ?? options.style?.width ?? 'fill',
      height: options.height ?? options.style?.height ?? 'fill',
      border: options.border ?? options.style?.border ?? true,
    });

    this.mapAssetState = mapAsset;
    this.playerState = player;
    this.mapModeSource = mapMode ?? 'all';
    this.mapMemorySource = mapMemory;
    this.hiddenCharacter = hiddenCharacter ?? ' ';
    this.showDirectionSource = showDirection ?? true;

    // Subscribe to player state changes
    this.playerState.subscribe(() => {
      requestRender();
    });

    // Subscribe to map state changes (for initial load and hot-reload)
    this.mapAssetState.subscribe(() => {
      requestRender();
    });
  }

  get mapAsset(): MapAsset | null {
    return this.mapAssetState.value;
  }

  get mapData(): string[] {
    return this.mapAsset?.mapData ?? [];
  }

  get legend(): Record<string, LegendEntry> {
    return this.mapAsset?.legend ?? {};
  }

  get player(): Position {
    return this.playerState.value;
  }

  get mapMemory(): Set<string> {
    if (!this.mapMemorySource) {
      return new Set<string>();
    }
    return isState(this.mapMemorySource)
      ? (this.mapMemorySource as State<Set<string>>).value
      : (this.mapMemorySource as Set<string>);
  }

  get mapMode(): MapMode {
    return isState(this.mapModeSource)
      ? (this.mapModeSource as State<MapMode>).value
      : (this.mapModeSource as MapMode);
  }

  get showDirection(): boolean {
    return isState(this.showDirectionSource)
      ? (this.showDirectionSource as State<boolean>).value
      : (this.showDirectionSource as boolean);
  }

  private isPositionVisible(
    x: number,
    y: number,
    playerX: number,
    playerY: number
  ): boolean {
    // 5 width x 3 height grid centered on player (±2 horizontally, ±1 vertically)
    const deltaX = Math.abs(x - playerX);
    const deltaY = Math.abs(y - playerY);
    return deltaX <= 2 && deltaY <= 1;
  }

  private isPositionExplored(x: number, y: number): boolean {
    return this.mapMemory.has(`${x},${y}`);
  }

  private addExploredPosition(x: number, y: number): void {
    const key = `${x},${y}`;
    if (this.mapMemorySource) {
      if (isState(this.mapMemorySource)) {
        const currentSet = (this.mapMemorySource as State<Set<string>>)
          .value;
        if (!currentSet.has(key)) {
          const newSet = new Set(currentSet);
          newSet.add(key);
          (this.mapMemorySource as State<Set<string>>).value = newSet;
        }
      } else {
        (this.mapMemorySource as Set<string>).add(key);
      }
    }
  }

  private getVisiblePositions(
    playerX: number,
    playerY: number
  ): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    for (let y = playerY - 1; y <= playerY + 1; y++) {
      for (let x = playerX - 2; x <= playerX + 2; x++) {
        positions.push({ x, y });
      }
    }
    return positions;
  }

  draw(): string[][] {
    super.draw(); // fills buffer, draws borders, etc.

    const mapData = this.mapData;
    const player = this.player;
    const legend = this.legend;

    if (!mapData || mapData.length === 0) {
      return this.buffer;
    }

    const innerWidth = this.width - (this.border ? 2 : 0);
    const innerHeight = this.height - (this.border ? 2 : 0);

    const offsetX = this.border ? 1 : 0;
    const offsetY = this.border ? 1 : 0;

    // Calculate viewport centering
    const centerX = Math.floor(innerWidth / 2);
    const centerY = Math.floor(innerHeight / 2);

    // Calculate map bounds
    const mapHeight = mapData.length;
    const mapWidth = mapHeight > 0 ? mapData[0].length : 0;

    if (mapWidth === 0 || mapHeight === 0) {
      return this.buffer;
    }

    // If map mode is 'nearby' or 'explored', mark visible positions as explored
    if (this.mapMode === 'nearby' || this.mapMode === 'explored') {
      const visiblePositions = this.getVisiblePositions(player.x, player.y);
      for (const visPos of visiblePositions) {
        if (
          visPos.x >= 0 &&
          visPos.x < mapWidth &&
          visPos.y >= 0 &&
          visPos.y < mapHeight
        ) {
          this.addExploredPosition(visPos.x, visPos.y);
        }
      }
    }

    // Calculate the starting position in the map based on player position
    const startMapY = Math.max(0, player.y - centerY);
    const endMapY = Math.min(mapHeight, startMapY + innerHeight);

    const startMapX = Math.max(0, player.x - centerX);
    const endMapX = Math.min(mapWidth, startMapX + innerWidth);

    // Draw the map portion
    for (let mapY = startMapY; mapY < endMapY; mapY++) {
      const line = mapData[mapY];
      if (!line) continue;

      const bufferY = mapY - startMapY + offsetY;
      if (bufferY >= this.height) break;

      for (let mapX = startMapX; mapX < endMapX; mapX++) {
        const char = line[mapX];
        if (char === undefined) continue;

        const bufferX = mapX - startMapX + offsetX;
        if (bufferX >= this.width) break;

        // Check if this is the player position
        if (mapX === player.x && mapY === player.y) {
          // Draw player based on showDirection setting
          const directionChar = this.showDirection
            ? this.getDirectionChar(player.direction)
            : '◈';
          this.buffer[bufferY][bufferX] = directionChar;
        } else {
          // Check legend visibility (defaults to true if not specified)
          let displayChar = char;
          if (legend && legend[char]) {
            const legendEntry = legend[char];
            // If showOnMap is explicitly set to false, render as space
            if (legendEntry.showOnMap === false) {
              displayChar = ' ';
            }
          }

          // Apply map mode visibility logic
          if (this.mapMode === 'hidden') {
            // Hidden mode: show only hidden character
            this.buffer[bufferY][bufferX] = this.hiddenCharacter;
          } else if (this.mapMode === 'nearby') {
            // Nearby mode: show only visible area
            const isVisible = this.isPositionVisible(
              mapX,
              mapY,
              player.x,
              player.y
            );
            if (isVisible) {
              this.buffer[bufferY][bufferX] = displayChar;
            } else {
              this.buffer[bufferY][bufferX] = this.hiddenCharacter;
            }
          } else if (this.mapMode === 'explored') {
            // Explored mode: show visible + explored areas
            const isVisible = this.isPositionVisible(
              mapX,
              mapY,
              player.x,
              player.y
            );
            const isExplored = this.isPositionExplored(mapX, mapY);

            if (isVisible || isExplored) {
              this.buffer[bufferY][bufferX] = displayChar;
            } else {
              this.buffer[bufferY][bufferX] = this.hiddenCharacter;
            }
          } else {
            // 'all' mode: show entire map
            this.buffer[bufferY][bufferX] = displayChar;
          }
        }
      }
    }

    // Add focus indicator at position (0,0) if focused and has border
    if (this.hasFocus && this.border) {
      this.buffer[0][0] = '>';
    }

    return this.buffer;
  }

  private getDirectionChar(direction: Direction): string {
    switch (direction) {
      case 'north':
        return '↑';
      case 'south':
        return '↓';
      case 'east':
        return '→';
      case 'west':
        return '←';
      default:
        return '@';
    }
  }

  handleEvent(event: string): boolean {
    // MapView is display-only, movement handled by MapEngine
    return false;
  }
}
