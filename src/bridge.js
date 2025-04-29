import { WebSocketServer } from 'ws';

import { version } from '../package.json';

import CreateLogger from './log.js';
const log = CreateLogger('bridge');

// basic bridge to pass info onto webapp
let lastMsg = {};
export const send = msg => {
  lastMsg[msg.socketId] = msg;
  wss.clients.forEach(x => x.send(JSON.stringify(msg)));
};

let port = 1337;
if (process.env.ARRPC_BRIDGE_PORT) {
  port = parseInt(process.env.ARRPC_BRIDGE_PORT);
  if (isNaN(port)) {
    throw new Error('invalid port');
  }
}
const wss = new WebSocketServer({ port });

wss.on('connection', socket => {
  log('web connected');

  for (const id in lastMsg) { // catch up newly connected
    if (lastMsg[id].activity != null) send(lastMsg[id]);
  }

  // listen for incoming messages
  socket.on('message', async (x) => {
    try {
      // parse message
      const msg = JSON.parse(x);

      // handle getAppVersion
      if (msg.type === 'getAppVersion') {
        log('received message:', msg.type);
        socket.send(JSON.stringify({ type: 'appVersion', data: { version } }));
      }
    } catch (err) {
      log('error processing received message:', err.message);
      socket.send(JSON.stringify({ type: 'error', data: err.message }));
    }
  });

  socket.on('close', () => {
    log('web disconnected');
  });
});

wss.on('listening', () => {
  console.log(`v${version}`);
  log('listening on', port);
});
