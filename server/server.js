 // Plik server/server.js - Główny plik startowy serwera
 import dotenv from 'dotenv';
 import path from 'path';
 import { fileURLToPath } from 'url';
 
 // Ładujemy zmienne środowiskowe z pliku .env, jeśli istnieje.
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
 dotenv.config({ path: path.resolve(__dirname, '.env') });
 
 import app from './app.js';
 
 // Używamy bardziej specyficznej zmiennej, aby uniknąć konfliktów z globalnym `PORT`
 // Na platformach takich jak Render, aplikacja musi nasłuchiwać na porcie zdefiniowanym w zmiennej środowiskowej `PORT`.
 // Używamy `process.env.PORT` dla zgodności z produkcją, a `process.env.API_PORT` jako fallback dla lokalnego rozwoju.
 const PORT = process.env.PORT || process.env.API_PORT || 3000;
 
 const server = app.listen(PORT, '0.0.0.0', () => {
   console.log(`🚀 Server is running on port ${PORT} and is accessible from your network.`);
 });
 
 // Ulepszona obsługa błędów serwera
 server.on('error', (error) => {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   if (error.code === 'EADDRINUSE') {
     console.error(`❌ Error: Port ${PORT} is already in use.`);
     console.error('Another application (maybe another instance of this server) is running on this port.');
     process.exit(1);
   }
 });