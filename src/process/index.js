import CreateLogger from '../log.js';
const log = CreateLogger('process');

// uncomment for node.js
// import { createRequire } from 'node:module';
// const require = createRequire(import.meta.url);

const DetectableDB = require('./detectable.json');

import * as Natives from './native/index.js';
const Native = Natives[process.platform];


const timestamps = {}, names = {}, pids = {}, cache = {};
export default class ProcessServer {
  constructor(handlers) {
    if (!Native) return; // log('unsupported platform:', process.platform);

    this.handlers = handlers;

    this.scan = this.scan.bind(this);

    this.scan();
    setInterval(this.scan, 5000);

    log('started');
  }

  async scan() {
    // // performance logging
    // const startTime = performance.now();
    const processes = await Native.getProcesses();
    const ids = [];
    const cacheKeys = {};

    // // performance logging
    // const processesTime = (performance.now() - startTime).toFixed(2)
    // log(`got native processes in ${processesTime}ms`);

    for (const [ pid, _path, args ] of processes) {
      const path = _path.toLowerCase().replaceAll('\\', '/').replaceAll('\x00', '');
      
      // the cache key includes every dependency of the DetectableDB scan
      const cacheKey = `${path}\0${args}`;
      cacheKeys[cacheKey] = true;

      var detected = [];
      if (cache[cacheKey] !== undefined) {
        detected = cache[cacheKey];
      }
      else {
        const toCompare = [];
        const splitPath = path.split('/');
        for (let i = 1; i < splitPath.length; i++) {
          toCompare.push(splitPath.slice(-i).join('/'));
        }

        for (const p of toCompare.slice()) { // add more possible tweaked paths for less false negatives
          toCompare.push(p.replace('64', '')); // remove 64bit identifiers-ish
          toCompare.push(p.replace('.x64', ''));
          toCompare.push(p.replace('x64', ''));
          toCompare.push(p.replace('_64', ''));
        }
        
        for (const { executables, id, name } of DetectableDB) {
          if (executables?.some(x => {
            if (x.is_launcher) return false;
            if (x.name[0] === '>' ? x.name.substring(1) !== toCompare[0] : !toCompare.some(y => x.name === y)) return false;
            if (args && x.arguments) return args.join(" ").indexOf(x.arguments) > -1;
            return true;
          })) {
            detected.push({ executables, id, name });
          }
        }
        
        cache[cacheKey] = detected;
      }
      
      for (const { executables, id, name } of detected) {
        names[id] = name;
        pids[id] = pid;

        ids.push(id);
        if (!timestamps[id]) {
          log('detected game!', name);
          timestamps[id] = Date.now();
        }

        // Resending this on evry scan is intentional, so that in the case that arRPC scans processes before Discord, existing activities will be sent
        this.handlers.message({
          socketId: id
        }, {
          cmd: 'SET_ACTIVITY',
          args: {
            activity: {
              application_id: id,
              name,
              timestamps: {
                start: timestamps[id]
              }
            },
            pid
          }
        });
      }
    }

    for (const id in timestamps) {
      if (!ids.includes(id)) {
        log('lost game!', names[id]);
        delete timestamps[id];

        this.handlers.message({
          socketId: id
        }, {
          cmd: 'SET_ACTIVITY',
          args: {
            activity: null,
            pid: pids[id]
          }
        });
      }
    }

    const globalCacheKeys = Object.keys(cache);
    const currentCacheKeys = Object.keys(cacheKeys);
    // log(`gc check: ${globalCacheKeys.length} > ${currentCacheKeys.length * 2.0}`);
    if (globalCacheKeys.length > currentCacheKeys.length * 2.0) {
      const beforeCount = Object.keys(cache).length;

      for (const key in currentCacheKeys) {
        delete globalCacheKeys[key];
      }

      for (const i in globalCacheKeys) {
        delete cache[globalCacheKeys[i]];
      }

      log(`cache gc complete: ${beforeCount} -> ${Object.keys(cache).length}`);
    }

    // // performance logging
    // const scanTime = (performance.now() - startTime).toFixed(2)
    // log(`scanned ${processes.length} processes in ${(scanTime - processesTime).toFixed(2)}ms`);
    // log(`(process took ${scanTime}ms)`);

    // // memory logging
    // const { heapUsed } = process.memoryUsage();
    // const heapUsedMB = (heapUsed / 1024 / 1024).toFixed(2);
    // log(`heap used ${heapUsedMB} MB`);
  }
}
