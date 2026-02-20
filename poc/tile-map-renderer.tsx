"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// -- Types that mirror our gen/assemblage/types.ts --
// These would be imported from the assemblage system in production.
// The point: NO TMX, NO RPG-JS. Just data → pixels.

interface TileRef {
  sheet: string; // tileset image URL
  sx: number; // source x in sprite sheet (pixels)
  sy: number; // source y in sprite sheet (pixels)
}

interface WorldLayer {
  name: string;
  tiles: (TileRef | null)[][]; // [row][col]
}

interface WorldZone {
  id: string;
  name: string;
  width: number; // in tiles
  height: number; // in tiles
  tileSize: number; // pixels per tile
  layers: WorldLayer[];
  collision: number[][]; // 0=pass, 1=block, 2=road
  objects: WorldObject[];
}

interface WorldObject {
  id: string;
  type: "npc" | "chest" | "door" | "trigger";
  x: number; // tile x
  y: number; // tile y
  graphic?: string;
  onInteract?: string;
}

interface PlayerState {
  x: number; // pixel position
  y: number;
  facing: "up" | "down" | "left" | "right";
  frame: number;
  moving: boolean;
}

// -- Tileset helper: compute tile source rect from a sprite sheet --
function tileFromSheet(
  sheetUrl: string,
  col: number,
  row: number,
  tileSize = 16,
): TileRef {
  return { sheet: sheetUrl, sx: col * tileSize, sy: row * tileSize };
}

// -- Demo world data --
// In production this comes from our markdown → assemblage → palette pipeline.
// The ENTIRE point is this is deterministic: same input → same output.

const TILE_SIZE = 16;
const SCALE = 3; // render at 3x for crisp pixels
const RENDERED_TILE = TILE_SIZE * SCALE;

const GROUND_SHEET =
  "https://raw.githubusercontent.com/arcade-cabinet/mnemonic-realms/main/assets/tilesets/village/exteriors/Art/Ground%20Tilesets/Tileset_Ground.png";
const ROAD_SHEET =
  "https://raw.githubusercontent.com/arcade-cabinet/mnemonic-realms/main/assets/tilesets/village/exteriors/Art/Ground%20Tilesets/Tileset_Road.png";
const WATER_SHEET =
  "https://raw.githubusercontent.com/arcade-cabinet/mnemonic-realms/main/assets/tilesets/village/exteriors/Art/Water%20and%20Sand/Tileset_Water.png";
const TREES_SHEET =
  "https://raw.githubusercontent.com/arcade-cabinet/mnemonic-realms/main/assets/tilesets/village/exteriors/Art/Trees%20and%20Bushes/Atlas/Atlas_Trees_Bushes.png";
const PROPS_SHEET =
  "https://raw.githubusercontent.com/arcade-cabinet/mnemonic-realms/main/assets/tilesets/village/exteriors/Art/Props/Atlas/Atlas_Props.png";

// Helper aliases
const grass = (col = 0, row = 0) => tileFromSheet(GROUND_SHEET, col, row);
const road = (col = 0, row = 0) => tileFromSheet(ROAD_SHEET, col, row);
const water = (col = 0, row = 0) => tileFromSheet(WATER_SHEET, col, row);

// Build a 20x15 demo zone — this is what the assemblage system produces
function buildDemoZone(): WorldZone {
  const W = 20;
  const H = 15;

  // Ground layer: all grass with a road strip and some water
  const ground: (TileRef | null)[][] = [];
  const collision: number[][] = [];

  for (let row = 0; row < H; row++) {
    ground[row] = [];
    collision[row] = [];
    for (let col = 0; col < W; col++) {
      // Water pond in top-right
      if (col >= 14 && col <= 17 && row >= 1 && row <= 3) {
        ground[row][col] = water(0, 0);
        collision[row][col] = 1;
      }
      // Road running east-west through middle
      else if (row >= 6 && row <= 7) {
        ground[row][col] = road(0, 0);
        collision[row][col] = 2;
      }
      // Road running north-south
      else if (col >= 9 && col <= 10) {
        ground[row][col] = road(0, 0);
        collision[row][col] = 2;
      }
      // Grass everywhere else — use different variants for visual interest
      else {
        const variant = ((col * 7 + row * 13) % 4);
        ground[row][col] = grass(variant, 0);
        collision[row][col] = 0;
      }
    }
  }

  // Block edges with trees (collision = 1)
  for (let col = 0; col < W; col++) {
    collision[0][col] = 1;
    collision[H - 1][col] = 1;
  }
  for (let row = 0; row < H; row++) {
    collision[row][0] = 1;
    collision[row][W - 1] = 1;
  }

  // Some interior trees as obstacles
  const treePositions = [
    [3, 3], [3, 4], [4, 3],
    [11, 2], [12, 2], [11, 3],
    [3, 11], [4, 11], [4, 12],
    [13, 10], [14, 10], [13, 11],
  ];
  for (const [r, c] of treePositions) {
    collision[r][c] = 1;
  }

  return {
    id: "everwick-demo",
    name: "Everwick",
    width: W,
    height: H,
    tileSize: TILE_SIZE,
    layers: [{ name: "ground", tiles: ground }],
    collision,
    objects: [
      { id: "artun", type: "npc", x: 5, y: 4, graphic: "elder", onInteract: "dialogue" },
      { id: "khali", type: "npc", x: 12, y: 8, graphic: "shopkeep", onInteract: "shop" },
      { id: "chest-01", type: "chest", x: 7, y: 2, onInteract: "loot" },
      { id: "door-south", type: "door", x: 10, y: 14, onInteract: "transition:heartfield" },
    ],
  };
}

// -- Image loader with caching --
const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) return Promise.resolve(imageCache.get(src)!);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// -- The Renderer --
// This replaces RPG-JS's ENTIRE map rendering pipeline.
// It's ~200 lines of canvas code.

export function TileMapRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zone] = useState(buildDemoZone);
  const [player, setPlayer] = useState<PlayerState>({
    x: 5 * RENDERED_TILE,
    y: 6 * RENDERED_TILE,
    facing: "down",
    frame: 0,
    moving: false,
  });
  const [loaded, setLoaded] = useState(false);
  const [zoneName, setZoneName] = useState<string | null>("Everwick");
  const [dialogue, setDialogue] = useState<string | null>(null);
  const keysRef = useRef(new Set<string>());
  const playerRef = useRef(player);
  playerRef.current = player;

  // Load all tileset images
  useEffect(() => {
    Promise.all([
      loadImage(GROUND_SHEET),
      loadImage(ROAD_SHEET),
      loadImage(WATER_SHEET),
    ]).then(() => setLoaded(true));
  }, []);

  // Zone name placard auto-dismiss
  useEffect(() => {
    if (zoneName) {
      const timer = setTimeout(() => setZoneName(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [zoneName]);

  // Input handling
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      // Action key
      if (e.key === " " || e.key === "Enter") {
        const p = playerRef.current;
        const tileX = Math.round(p.x / RENDERED_TILE);
        const tileY = Math.round(p.y / RENDERED_TILE);
        // Check adjacent tile for objects
        const dx = p.facing === "left" ? -1 : p.facing === "right" ? 1 : 0;
        const dy = p.facing === "up" ? -1 : p.facing === "down" ? 1 : 0;
        const targetX = tileX + dx;
        const targetY = tileY + dy;
        const obj = zone.objects.find((o) => o.x === targetX && o.y === targetY);
        if (obj) {
          if (obj.type === "npc") {
            setDialogue(
              obj.id === "artun"
                ? "Artun: The world grows more vivid with each memory you recover. I can feel it in the stones beneath our feet..."
                : "Khali: Welcome to my shop! I've got potions, blades, and a few curiosities from before the Dissolving.",
            );
          } else if (obj.type === "chest") {
            setDialogue("You found a Flickerblade! Its edge shimmers between solid and sketch.");
          }
        }
      }
      if (e.key === "Escape") setDialogue(null);
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [zone]);

  // Game loop: movement + collision + render
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false; // PIXEL PERFECT

    const SPEED = 3;
    let frameId: number;

    const gameLoop = () => {
      const keys = keysRef.current;
      const p = { ...playerRef.current };
      let dx = 0;
      let dy = 0;

      if (dialogue) {
        // Freeze movement during dialogue
      } else {
        if (keys.has("ArrowUp") || keys.has("w")) { dy = -SPEED; p.facing = "up"; }
        if (keys.has("ArrowDown") || keys.has("s")) { dy = SPEED; p.facing = "down"; }
        if (keys.has("ArrowLeft") || keys.has("a")) { dx = -SPEED; p.facing = "left"; }
        if (keys.has("ArrowRight") || keys.has("d")) { dx = SPEED; p.facing = "right"; }
      }

      p.moving = dx !== 0 || dy !== 0;

      // Collision detection against the tile grid
      if (dx !== 0 || dy !== 0) {
        const newX = p.x + dx;
        const newY = p.y + dy;
        const tileCol = Math.round(newX / RENDERED_TILE);
        const tileRow = Math.round(newY / RENDERED_TILE);

        if (
          tileCol >= 0 &&
          tileCol < zone.width &&
          tileRow >= 0 &&
          tileRow < zone.height &&
          zone.collision[tileRow][tileCol] !== 1
        ) {
          p.x = newX;
          p.y = newY;
        }
      }

      if (p.moving) p.frame = (p.frame + 1) % 30;
      setPlayer(p);

      // -- RENDER --
      const vpW = canvas.width;
      const vpH = canvas.height;

      // Camera centered on player
      const camX = p.x - vpW / 2 + RENDERED_TILE / 2;
      const camY = p.y - vpH / 2 + RENDERED_TILE / 2;

      ctx.clearRect(0, 0, vpW, vpH);

      // Draw tile layers
      for (const layer of zone.layers) {
        for (let row = 0; row < zone.height; row++) {
          for (let col = 0; col < zone.width; col++) {
            const tile = layer.tiles[row][col];
            if (!tile) continue;

            const screenX = col * RENDERED_TILE - camX;
            const screenY = row * RENDERED_TILE - camY;

            // Frustum cull
            if (
              screenX + RENDERED_TILE < 0 ||
              screenX > vpW ||
              screenY + RENDERED_TILE < 0 ||
              screenY > vpH
            )
              continue;

            const img = imageCache.get(tile.sheet);
            if (img) {
              ctx.drawImage(
                img,
                tile.sx,
                tile.sy,
                TILE_SIZE,
                TILE_SIZE,
                screenX,
                screenY,
                RENDERED_TILE,
                RENDERED_TILE,
              );
            }
          }
        }
      }

      // Draw collision debug overlay (subtle)
      for (let row = 0; row < zone.height; row++) {
        for (let col = 0; col < zone.width; col++) {
          const screenX = col * RENDERED_TILE - camX;
          const screenY = row * RENDERED_TILE - camY;
          if (screenX + RENDERED_TILE < 0 || screenX > vpW || screenY + RENDERED_TILE < 0 || screenY > vpH) continue;

          const c = zone.collision[row][col];
          if (c === 1) {
            // Blocked: draw tree-like green squares
            ctx.fillStyle = "rgba(34, 120, 50, 0.7)";
            ctx.fillRect(screenX + 4, screenY + 4, RENDERED_TILE - 8, RENDERED_TILE - 8);
            ctx.fillStyle = "rgba(20, 80, 30, 0.9)";
            ctx.fillRect(screenX + 8, screenY + 2, RENDERED_TILE - 16, RENDERED_TILE - 12);
          }
        }
      }

      // Draw objects (NPCs, chests, doors)
      for (const obj of zone.objects) {
        const screenX = obj.x * RENDERED_TILE - camX;
        const screenY = obj.y * RENDERED_TILE - camY;
        if (screenX + RENDERED_TILE < 0 || screenX > vpW || screenY + RENDERED_TILE < 0 || screenY > vpH) continue;

        if (obj.type === "npc") {
          // Simple NPC sprite placeholder
          ctx.fillStyle = obj.id === "artun" ? "#c4a265" : "#6ba3c4";
          ctx.fillRect(screenX + 8, screenY + 4, RENDERED_TILE - 16, RENDERED_TILE - 8);
          ctx.fillStyle = "#f5e6c8";
          ctx.beginPath();
          ctx.arc(screenX + RENDERED_TILE / 2, screenY + 8, 8, 0, Math.PI * 2);
          ctx.fill();
          // Name tag
          ctx.fillStyle = "white";
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(obj.id === "artun" ? "Artun" : "Khali", screenX + RENDERED_TILE / 2, screenY - 4);
        } else if (obj.type === "chest") {
          ctx.fillStyle = "#8B6914";
          ctx.fillRect(screenX + 6, screenY + 10, RENDERED_TILE - 12, RENDERED_TILE - 16);
          ctx.fillStyle = "#D4A017";
          ctx.fillRect(screenX + 6, screenY + 8, RENDERED_TILE - 12, 6);
        } else if (obj.type === "door") {
          // Transition zone indicator
          ctx.fillStyle = "rgba(100, 200, 255, 0.3)";
          ctx.fillRect(screenX, screenY, RENDERED_TILE, RENDERED_TILE);
          ctx.fillStyle = "rgba(100, 200, 255, 0.8)";
          ctx.font = "9px monospace";
          ctx.textAlign = "center";
          ctx.fillText("EXIT", screenX + RENDERED_TILE / 2, screenY + RENDERED_TILE / 2 + 3);
        }
      }

      // Draw player
      const playerScreenX = p.x - camX;
      const playerScreenY = p.y - camY;
      // Body
      ctx.fillStyle = "#4a7c9b";
      ctx.fillRect(playerScreenX + 10, playerScreenY + 12, RENDERED_TILE - 20, RENDERED_TILE - 16);
      // Head
      ctx.fillStyle = "#f0d9b5";
      ctx.beginPath();
      ctx.arc(playerScreenX + RENDERED_TILE / 2, playerScreenY + 10, 9, 0, Math.PI * 2);
      ctx.fill();
      // Facing indicator
      ctx.fillStyle = "#2a4c6b";
      const eyeX = playerScreenX + RENDERED_TILE / 2 + (p.facing === "left" ? -4 : p.facing === "right" ? 4 : 0);
      const eyeY = playerScreenY + 9 + (p.facing === "up" ? -3 : p.facing === "down" ? 3 : 0);
      ctx.fillRect(eyeX - 2, eyeY - 1, 4, 2);

      // Walk animation bob
      if (p.moving && Math.floor(p.frame / 5) % 2 === 0) {
        ctx.fillStyle = "#4a7c9b";
        ctx.fillRect(playerScreenX + 10, playerScreenY + 11, RENDERED_TILE - 20, RENDERED_TILE - 15);
      }

      frameId = requestAnimationFrame(gameLoop);
    };

    frameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameId);
  }, [loaded, zone, dialogue]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        background: "#0a0a0f",
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: "monospace",
      }}
    >
      {/* Zone Name Placard */}
      {zoneName && (
        <div
          style={{
            position: "absolute",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            background: "linear-gradient(135deg, rgba(20, 15, 10, 0.9), rgba(40, 30, 20, 0.85))",
            border: "1px solid rgba(196, 162, 101, 0.4)",
            borderRadius: 8,
            padding: "8px 32px",
            color: "#c4a265",
            fontSize: 18,
            fontWeight: 300,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            boxShadow: "0 4px 24px rgba(196, 162, 101, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(8px)",
            animation: "slideIn 0.5s ease-out, fadeOut 0.5s ease-in 2.5s forwards",
          }}
        >
          {zoneName}
        </div>
      )}

      {/* Vibrancy Meter */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "#c4a265", fontSize: 11, opacity: 0.8 }}>VIBRANCY</span>
        <div
          style={{
            width: 100,
            height: 8,
            background: "rgba(20, 15, 10, 0.8)",
            borderRadius: 4,
            border: "1px solid rgba(196, 162, 101, 0.3)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "60%",
              height: "100%",
              background: "linear-gradient(90deg, #c4a265, #e8c97a)",
              borderRadius: 4,
              boxShadow: "0 0 8px rgba(196, 162, 101, 0.5)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={480}
        style={{
          display: "block",
          width: "100%",
          imageRendering: "pixelated",
          cursor: "none",
        }}
        tabIndex={0}
        onFocus={() => {}} // ensure keyboard events work
      />

      {/* Dialogue Box */}
      {dialogue && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
            zIndex: 20,
            background: "linear-gradient(135deg, rgba(15, 12, 8, 0.95), rgba(25, 20, 15, 0.92))",
            border: "1px solid rgba(196, 162, 101, 0.3)",
            borderRadius: 8,
            padding: "16px 20px",
            color: "#e8dcc8",
            fontSize: 14,
            lineHeight: 1.6,
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
          }}
        >
          <TypewriterText text={dialogue} />
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              color: "rgba(196, 162, 101, 0.5)",
              textAlign: "right",
            }}
          >
            [ESC to close]
          </div>
        </div>
      )}

      {/* Controls hint */}
      {!dialogue && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(196, 162, 101, 0.4)",
            fontSize: 10,
            zIndex: 5,
          }}
        >
          Arrow keys to move | SPACE/ENTER to interact | Face an NPC and press action
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; box-shadow: 0 0 12px rgba(196, 162, 101, 0.7); }
        }
      `}</style>
    </div>
  );
}

// Typewriter effect for dialogue
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayed("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((i) => i + 1);
      }, 25);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return (
    <span>
      {displayed}
      {index < text.length && (
        <span style={{ opacity: 0.5, animation: "pulse 0.5s infinite" }}>|</span>
      )}
    </span>
  );
}

export default TileMapRenderer;
