/**
 * Mnemonic Realms Game Entry Point
 * Starts RPG-JS server and client
 */

import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Game route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('🎮 Mnemonic Realms Server');
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log('🌍 Procedural world generation active');
});
