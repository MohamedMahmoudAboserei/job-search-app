import path from 'path';
import express from 'express';
import * as dotenv from 'dotenv';
import bootstrap from './src/app.controller.js';
import { runIo } from './src/modules/chat/chat.socket.controller.js';

dotenv.config({ path: path.resolve('./src/config/.env') });

const app = express();
const port = process.env.PORT || 5000;

bootstrap(app, express);

const httpServer = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

runIo(httpServer)