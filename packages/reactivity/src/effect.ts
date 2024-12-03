import { type Dep, createDep } from './dep';

type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<any, KeyToDepMap>();

// eslint-disable-next-line import/no-mutable-exports
export let activeEffect: ReactiveEffect | undefined;

export class ReactiveEffect<T = any> {
  active = true;

  constructor(public fn: () => T) {}

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this;

    return this.fn(); // effect 接收的 fn 一般都是读取响应式变量对 ui 做出更改，所以这里必须执行一次触发 getter 行为才能构造出依赖收集的 targetmap 链条。如何自动更改 dom ？
  }

  stop() {
    this.active = false;
  }
}

export function effect<T = any>(fn: () => T) {
  const reactiveEffect = new ReactiveEffect(fn);
  reactiveEffect.run();
}

/**
 * 收集依赖
 * @param target
 * @param key
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
 * @param target
 * @param key
 * @param value
 */
// @ts-ignore
// eslint-disable-next-line unused-imports/no-unused-vars
export function trigger(target: object, key: string | symbol, value: unknown) {
  const depMap = targetMap.get(target);
  if (!depMap) return;

  const deps: (Dep | undefined)[] = [];
  if (key === 'length' && Array.isArray(target)) {
    depMap.forEach((dep, k) => {
      if (k === 'length') {
        deps.push(dep);
      }
    });
  } else if (key !== undefined) {
    deps.push(depMap.get(key));
  } else {
    // TODO:
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
  const effects = Array.isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    triggerEffect(effect);
  }
}

/**
 * 触发指定依赖
 * @param effect
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect !== activeEffect) {
    effect.run();
  }
}
