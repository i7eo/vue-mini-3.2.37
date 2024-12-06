import { isObject } from '@vue-mini/share';
import { mutableHandlers } from './handlers';

export enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
}

export const reactiveMap = new WeakMap<object, any>();

export function reactive<T extends object>(target: T): T;
export function reactive(target: object) {
  return createReactive(target, mutableHandlers, reactiveMap);
}

function createReactive(
  target: object,
  handlers: ProxyHandler<object>,
  proxyMap: WeakMap<object, any>,
) {
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const targetProxy = new Proxy(target, handlers);
  // 为 Reactive 增加标记
  // @ts-ignore
  targetProxy[ReactiveFlags.IS_REACTIVE] = true;
  // 缓存代理对象
  proxyMap.set(target, targetProxy);

  return targetProxy;
}

export function isReadonly(value: any): boolean {
  return !!(value && value[ReactiveFlags.IS_READONLY]);
}

export function isReactive(value: any): boolean {
  // if (isReadonly(value)) {
  //   return isReactive(value[ReactiveFlags.RAW]);
  // }
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}

export function isProxy(value: any): boolean {
  return isReactive(value) || isReadonly(value);
}

export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as any)[ReactiveFlags.RAW];
  return raw ? toRaw(raw) : observed;
}

export function toReactive<T>(value: T): T {
  return isObject(value) ? reactive(value) : value;
}
