/**
 * Performance utilities for Globe rendering optimization
 */

// Reusable vector pools to avoid garbage collection
const vectorPool: THREE.Vector3[] = [];
const MAX_POOL_SIZE = 100;

export const getPooledVector = (): THREE.Vector3 => {
  return vectorPool.pop() || new THREE.Vector3();
};

export const returnPooledVector = (vec: THREE.Vector3): void => {
  if (vectorPool.length < MAX_POOL_SIZE) {
    vec.set(0, 0, 0);
    vectorPool.push(vec);
  }
};

/**
 * Throttle function execution to reduce CPU load
 */
export const createThrottle = (interval: number) => {
  let lastCall = 0;
  
  return (callback: () => void): boolean => {
    const now = performance.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      callback();
      return true;
    }
    return false;
  };
};

/**
 * Simple spatial hash for quick proximity queries
 */
export class SpatialHash {
  private cellSize: number;
  private grid: Map<string, Set<string>>;
  
  constructor(cellSize: number = 1.0) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }
  
  private getKey(x: number, y: number, z: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    return `${cx},${cy},${cz}`;
  }
  
  insert(id: string, x: number, y: number, z: number): void {
    const key = this.getKey(x, y, z);
    if (!this.grid.has(key)) {
      this.grid.set(key, new Set());
    }
    this.grid.get(key)!.add(id);
  }
  
  getNearby(x: number, y: number, z: number): Set<string> {
    const result = new Set<string>();
    const key = this.getKey(x, y, z);
    
    // Check cell and immediate neighbors
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const cx = Math.floor(x / this.cellSize) + dx;
          const cy = Math.floor(y / this.cellSize) + dy;
          const cz = Math.floor(z / this.cellSize) + dz;
          const neighborKey = `${cx},${cy},${cz}`;
          
          const cell = this.grid.get(neighborKey);
          if (cell) {
            cell.forEach(id => result.add(id));
          }
        }
      }
    }
    
    return result;
  }
  
  clear(): void {
    this.grid.clear();
  }
}

/**
 * Performance monitoring (dev only)
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private updateInterval = 1000; // Update every second
  
  update(): number {
    this.frameCount++;
    const now = performance.now();
    
    if (now >= this.lastTime + this.updateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
    }
    
    return this.fps;
  }
  
  getFPS(): number {
    return this.fps;
  }
}

import * as THREE from 'three';
