// Import files
import path from 'path';
import express from 'express';
import * as dotenv from 'dotenv';
import bootstrap from './src/app.controller.js';
import { runIo } from './src/modules/chat/chat.socket.controller.js';

// environment variables from .env
dotenv.config({ path: path.resolve('./src/config/.env') });

// Create Express application
const app = express();
const port = process.env.PORT || 5000;

// Initialize application middleware, routes, and configurations
bootstrap(app, express);

// Create HTTP server and start listening on specified port
const httpServer = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Initialize WebSocket/Socket.io functionality with the HTTP server
runIo(httpServer)