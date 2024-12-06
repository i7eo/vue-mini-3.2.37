let isFlushPending = false;
const pendingPreFlushCbs: Function[] = [];

const resolvedPromise = Promise.resolve() as Promise<any>;
// @ts-ignore
// eslint-disable-next-line unused-imports/no-unused-vars
let currentFlushPromise: Promise<void> | null = null;

export function queuePreFlushCb(cb: Function) {
  queueCb(cb, pendingPreFlushCbs);
}

function queueCb(cb: Function, pendingQueue: Function[]) {
  pendingQueue.push(cb);
  queueFlush();
}

function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

function flushJobs() {
  isFlushPending = false;
  flushPreFlushCbs();
}

function flushPreFlushCbs() {
  if (pendingPreFlushCbs.length > 0) {
    const activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;

    for (const cb of activePreFlushCbs) {
      cb();
    }
  }
}
