#!/usr/bin/env node

console.log("elecord-rpc");

import * as Bridge from './bridge.js';
import Server from './server.js';

(async () => {
  const server = await new Server();

  server.on('activity', data => Bridge.send(data));
})();
