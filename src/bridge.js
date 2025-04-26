import { WebSocketServer } from 'ws';

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

  socket.on('close', () => {
    log('web disconnected');
  });
});

wss.on('listening', () => log('listening on', port));
