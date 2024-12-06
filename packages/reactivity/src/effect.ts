import { isArray, merge } from '@vue-mini/share';
import { type Dep, createDep } from './dep';
import type { ComputedRefImpl } from './computed';

type KeyToDepMap = Map<any, Dep>;
/**
 * 收集所有依赖的 WeakMap 实例：
 * 1. `key`：响应性对象
 * 2. `value`：`Map` 对象
 * 		1. `key`：响应性对象的指定属性
 * 		2. `value`：指定对象的指定属性的 执行函数
 */
const targetMap = new WeakMap<any, KeyToDepMap>();
export type EffectScheduler = (...args: any[]) => any;

/**
 * 记录当前的 effect（单例）
 */
// eslint-disable-next-line import/no-mutable-exports
export let activeEffect: ReactiveEffect | undefined;

export class ReactiveEffect<T = any> {
  active = true;
  computed?: ComputedRefImpl<T>;

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
  ) {}

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this;

    return this.fn(); // effect 接收的 fn 一般都是读取响应式变量对 ui 做出更改，所以这里必须执行一次触发 getter 行为才能构造出依赖收集的 targetmap 链条。如何自动更改 dom ？
  }

  stop() {
    if (this.active) {
      // cleanupEffect(this)
      this.active = false;
    }
  }
}

// function cleanupEffect(effect: ReactiveEffect) {
//   const { deps } = effect;
//   if (deps.length) {
//     for (const dep of deps) {
//       dep.delete(effect);
//     }
//     deps.length = 0;
//   }
// }

export interface ReactiveEffectOptions {
  lazy?: boolean;
  scheduler?: EffectScheduler;
  // scope?: EffectScope
  // allowRecurse?: boolean
  // onStop?: () => void
}

export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const reactiveEffect = new ReactiveEffect(fn);

  // 存在 options，则合并配置对象。将 options 挂在对象上方便实时获取做判断，这里主要是将 scheduler 合并为 watch 提供便利
  if (options) {
    merge(reactiveEffect, options);
  }

  if (!options || !options.lazy) {
    reactiveEffect.run();
  }
}

/**
 * 收集依赖
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 */
export function track(target: object, key: string | symbol) {
  if (!activeEffect) return;

  let depMap = targetMap.get(target);
  if (!depMap) {
    targetMap.set(target, (depMap = new Map()));
  }

  let dep = depMap.get(key);
  if (!dep) {
    depMap.set(key, (dep = createDep()));
  }

  trackEffects(dep);
}

/**
 * 利用 dep（set）依次跟踪指定 key 的所有 effect（一个key对多个effect）
 * @param dep
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!);
}

/**
 * 触发依赖
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 * @param value
 */
// @ts-ignore
// eslint-disable-next-line unused-imports/no-unused-vars
export function trigger(target: object, key: string | symbol, value: unknown) {
  // 依据 target 获取存储的 map 实例
  const depMap = targetMap.get(target);
  // 如果 map 不存在，则直接 return
  if (!depMap) return;

  const deps: (Dep | undefined)[] = [];
  if (key === 'length' && isArray(target) && depMap.get(key)) {
    depMap.forEach((dep, k) => {
      if (k === 'length') {
        deps.push(dep);
      }
    });
  } else if (key !== undefined && depMap.get(key)) {
    deps.push(depMap.get(key));
  } else {
    // dep 不存在则直接 return
    return;
  }

  if (deps.length === 1) {
    if (deps[0]) {
      triggerEffects(deps[0]);
    }
  } else {
    const effects: ReactiveEffect[] = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    triggerEffects(createDep(effects));
  }
}

/**
 * 依次触发 dep 中保存的 effect
 * @param dep
 */
export function triggerEffects(dep: Dep | ReactiveEffect[]) {
  const effects = isArray(dep) ? dep : [...dep];

  // 避免 computed effect 缓存执行死循环，这里手动调整执行顺序，保证 computed effect 先执行
  // 不在依次触发，而是先触发所有的计算属性依赖，再触发所有的非计算属性依赖
  for (const effect of effects) {
    if (effect.computed) triggerEffect(effect);
  }

  for (const effect of effects) {
    if (!effect.computed) triggerEffect(effect);
  }
}

/**
 * 触发指定依赖
 * @param effect
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler();
  } else {
    effect.run();
  }
}
