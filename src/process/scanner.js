const rgb = (r, g, b, msg) => `\x1b[38;2;${r};${g};${b}m${msg}\x1b[0m`;
const log = (...args) => console.log(`[${rgb(88, 101, 242, 'RPC')} > ${rgb(237, 66, 69, 'process')}]`, ...args);

import { Observable, Subject } from 'threads/observable';
import { expose } from 'threads/worker';

let subject = new Subject();

import * as Natives from './native/index.js';
const Native = Natives[process.platform];

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const DetectableDB = require('./detectable.json');

const timestamps = {}, names = {}, pids = {}, cache = {};
const scanner = {
  finish() {
    subject.complete();
    subject = new Subject();
  },

  async scan() {
    // const startTime = performance.now();
    const processes = await Native.getProcesses();
    const ids = [];
    const cacheKeys = {};

    // log(`got processed in ${(performance.now() - startTime).toFixed(2)}ms`);

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
        subject.next({
          id,
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

        subject.next({
          id,
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

    // log(`finished scan in ${(performance.now() - startTime).toFixed(2)}ms`);
    // process.stdout.write(`\r${' '.repeat(100)}\r[${rgb(88, 101, 242, 'RPC')} > ${rgb(237, 66, 69, 'process')}] scanned (took ${(performance.now() - startTime).toFixed(2)}ms)`);
  },
  processes() {
    return Observable.from(subject);
  },
};

expose(scanner);