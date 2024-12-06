import { hasChanged, isFunction, isObject, noop } from '@vue-mini/share';
import {
  type ComputedRef,
  type EffectScheduler,
  ReactiveEffect,
  type Ref,
  isReactive,
} from '@vue-mini/reactivity';
import { queuePreFlushCb } from './scheduler';

type OnCleanup = (cleanupFn: () => void) => void;

export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T);
export interface WatchOptionsBase {
  flush?: 'pre' | 'post' | 'sync';
}
export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate;
  deep?: boolean;
}
export type WatchStopHandle = () => void;
export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup?: OnCleanup,
) => any;

export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>,
) {
  if (!isFunction(cb)) {
    console.warn(
      `\`watch(fn, options?)\` signature has been moved to a separate API. ` +
        `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
        `supports \`watch(source, cb, options?) signature.`,
    );
  }

  return createWatch(source as any, cb, options);
}

function createWatch<T>(
  source: T | WatchSource<T>,
  cb: WatchCallback | null,
  { immediate, deep }: WatchOptions = {},
) {
  let getter: () => any;

  if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else {
    getter = noop;
  }

  if (cb && deep) {
    const baseGetter = getter;
    // getter = () => baseGetter; // 无法自动触发 source getter 行为
    getter = () => traverse(baseGetter()); // 手动递归触发 source getter 行为
  }

  let oldValue = {};
  function job() {
    if (!effect.active) {
      return;
    }

    if (cb) {
      const newValue = effect.run();
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue);
        oldValue = newValue;
      }
    } else {
      // watchEffect
      effect.run();
    }
  }

  const scheduler: EffectScheduler = () => queuePreFlushCb(job);

  const effect = new ReactiveEffect(getter, scheduler);

  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else {
    effect.run();
  }

  return () => {
    effect.stop();
  };
}

function traverse(value: any) {
  if (!isObject(value)) return value;

  for (const [, v] of Object.entries(value)) {
    traverse(v);
  }

  return value;
}
