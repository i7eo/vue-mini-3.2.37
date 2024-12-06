/** 标识当前队列状态，对应 promise 的 pending 状态 */
let isFlushPending = false;
/** 待执行的任务队列 */
const pendingPreFlushCbs: Function[] = [];
/** 使用异步 promise 调度，实际是利用 promise 为微任务的特性改变代码执行规则 */
const resolvedPromise = Promise.resolve() as Promise<any>;
/** 当前的执行任务 */
// @ts-ignore
// eslint-disable-next-line unused-imports/no-unused-vars
let currentFlushPromise: Promise<void> | null = null;

/**
 * 队列预处理函数
 * @param cb
 */
export function queuePreFlushCb(cb: Function) {
  queueCb(cb, pendingPreFlushCbs);
}

/**
 * 队列处理函数
 * @param cb
 * @param pendingQueue
 */
function queueCb(cb: Function, pendingQueue: Function[]) {
  // 将所有的回调函数，放入队列中
  pendingQueue.push(cb);
  queueFlush();
}

/**
 * 依次处理队列中执行函数
 */
function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

/**
 * 处理队列
 */
function flushJobs() {
  isFlushPending = false;
  flushPreFlushCbs();
}

/**
 * 依次处理队列中的任务
 */
function flushPreFlushCbs() {
  if (pendingPreFlushCbs.length > 0) {
    // 去重
    const activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    // 清空就数据
    pendingPreFlushCbs.length = 0;

    for (const cb of activePreFlushCbs) {
      cb();
    }
  }
}
