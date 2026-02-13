/**
 * Master Art Style Prompts
 *
 * Global style and negative prompts prepended to every generation request
 * for visual consistency. Source: docs/design/visual-direction.md
 */

export const MASTER_STYLE_PROMPT = `16-bit JRPG pixel art style. Clean, readable sprites with limited color palette per tile. \
Warm, inviting aesthetic inspired by SNES-era RPGs (Chrono Trigger, Secret of Mana, Final Fantasy VI). \
2-3 head-tall chibi proportions for characters. 32x32 pixel tile grid. \
Subtle shading with 2-3 tone depth per surface. No outlines on tiles, clean edges on sprites. \
Bright, hopeful color philosophy — the world gets MORE vivid as it progresses, never darker. \
Think: watercolor sketch evolving into illuminated manuscript evolving into stained-glass cathedral light.`;

export const MASTER_NEGATIVE_PROMPT = `3D rendering, photorealistic, anime style, neon colors, grimdark, \
desaturated post-apocalyptic, dark souls brown, chibi with huge heads, \
modern technology, sci-fi elements, cyberpunk, blurry, low quality, \
text, watermark, signature, UI elements in the image, \
thick black outlines on tiles, gradient shading on sprites`;
