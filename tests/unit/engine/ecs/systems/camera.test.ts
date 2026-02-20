import { describe, it, expect } from 'vitest';
import {
  computeCameraPosition,
  lerpCamera,
} from '../../../../../engine/ecs/systems/camera.js';

// ── Constants for standard 60×60 map ─────────────────────────────────────────

const MAP_PX = 960; // 60 tiles × 16px
const VP_W = 320; // typical viewport width
const VP_H = 240; // typical viewport height

// ── computeCameraPosition ────────────────────────────────────────────────────

describe('computeCameraPosition', () => {
  it('centers camera on player in the middle of the map', () => {
    const pos = computeCameraPosition(480, 480, VP_W, VP_H, MAP_PX, MAP_PX);
    // idealX = 480 - 160 = 320, idealY = 480 - 120 = 360
    expect(pos.x).toBe(320);
    expect(pos.y).toBe(360);
  });

  it('clamps to top-left when player is near origin', () => {
    const pos = computeCameraPosition(10, 10, VP_W, VP_H, MAP_PX, MAP_PX);
    // idealX = 10 - 160 = -150, clamped to 0
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
  });

  it('clamps to bottom-right when player is near map edge', () => {
    const pos = computeCameraPosition(950, 950, VP_W, VP_H, MAP_PX, MAP_PX);
    // idealX = 950 - 160 = 790, maxX = 960 - 320 = 640, clamped to 640
    expect(pos.x).toBe(640);
    // idealY = 950 - 120 = 830, maxY = 960 - 240 = 720, clamped to 720
    expect(pos.y).toBe(720);
  });

  it('clamps to left edge only when player is near left', () => {
    const pos = computeCameraPosition(50, 480, VP_W, VP_H, MAP_PX, MAP_PX);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(360);
  });

  it('clamps to top edge only when player is near top', () => {
    const pos = computeCameraPosition(480, 50, VP_W, VP_H, MAP_PX, MAP_PX);
    expect(pos.x).toBe(320);
    expect(pos.y).toBe(0);
  });

  it('handles viewport larger than map', () => {
    // Viewport 1024×768 on a 960×960 map
    const pos = computeCameraPosition(480, 480, 1024, 768, MAP_PX, MAP_PX);
    // maxX = max(0, 960 - 1024) = 0, maxY = max(0, 960 - 768) = 192
    expect(pos.x).toBe(0);
    // idealY = 480 - 384 = 96, maxY = 192, so 96 is within bounds
    expect(pos.y).toBe(96);
  });

  it('returns (0,0) when viewport is much larger than map', () => {
    const pos = computeCameraPosition(480, 480, 2000, 2000, MAP_PX, MAP_PX);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
  });

  it('handles player at exact center of map', () => {
    const pos = computeCameraPosition(
      MAP_PX / 2, MAP_PX / 2, VP_W, VP_H, MAP_PX, MAP_PX,
    );
    expect(pos.x).toBe(MAP_PX / 2 - VP_W / 2);
    expect(pos.y).toBe(MAP_PX / 2 - VP_H / 2);
  });

  it('handles small map where viewport covers everything', () => {
    // 4×4 map = 64×64 pixels, viewport 320×240
    const pos = computeCameraPosition(32, 32, 320, 240, 64, 64);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
  });

  it('handles player at exact origin (0,0)', () => {
    const pos = computeCameraPosition(0, 0, VP_W, VP_H, MAP_PX, MAP_PX);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
  });

  it('handles player at exact map corner (mapPx, mapPx)', () => {
    const pos = computeCameraPosition(MAP_PX, MAP_PX, VP_W, VP_H, MAP_PX, MAP_PX);
    expect(pos.x).toBe(640); // 960 - 320
    expect(pos.y).toBe(720); // 960 - 240
  });
});

// ── lerpCamera ───────────────────────────────────────────────────────────────

describe('lerpCamera', () => {
  it('returns current position when factor is 0', () => {
    const result = lerpCamera({ x: 100, y: 200 }, { x: 300, y: 400 }, 0);
    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
  });

  it('returns target position when factor is 1', () => {
    const result = lerpCamera({ x: 100, y: 200 }, { x: 300, y: 400 }, 1);
    expect(result.x).toBe(300);
    expect(result.y).toBe(400);
  });

  it('interpolates halfway at factor 0.5', () => {
    const result = lerpCamera({ x: 0, y: 0 }, { x: 100, y: 200 }, 0.5);
    expect(result.x).toBe(50);
    expect(result.y).toBe(100);
  });

  it('interpolates at factor 0.1 (smooth follow)', () => {
    const result = lerpCamera({ x: 0, y: 0 }, { x: 100, y: 100 }, 0.1);
    expect(result.x).toBeCloseTo(10);
    expect(result.y).toBeCloseTo(10);
  });

  it('returns same position when current equals target', () => {
    const result = lerpCamera({ x: 50, y: 50 }, { x: 50, y: 50 }, 0.5);
    expect(result.x).toBe(50);
    expect(result.y).toBe(50);
  });

  it('clamps factor below 0 to 0', () => {
    const result = lerpCamera({ x: 100, y: 200 }, { x: 300, y: 400 }, -0.5);
    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
  });

  it('clamps factor above 1 to 1', () => {
    const result = lerpCamera({ x: 100, y: 200 }, { x: 300, y: 400 }, 1.5);
    expect(result.x).toBe(300);
    expect(result.y).toBe(400);
  });

  it('handles negative coordinates', () => {
    const result = lerpCamera({ x: -100, y: -200 }, { x: 100, y: 200 }, 0.5);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('converges over multiple frames', () => {
    let pos = { x: 0, y: 0 };
    const target = { x: 100, y: 100 };
    // Simulate 60 frames of lerp at 0.1
    for (let i = 0; i < 60; i++) {
      pos = lerpCamera(pos, target, 0.1);
    }
    // After 60 frames at 0.1: 100 * (1 - 0.9^60) ≈ 99.82
    expect(pos.x).toBeCloseTo(100, 0);
    expect(pos.y).toBeCloseTo(100, 0);
  });
});

