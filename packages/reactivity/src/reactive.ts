import { mutableHandlers } from './handlers';

export const reactiveMap = new WeakMap<object, any>();

export function reactive<T extends object>(target: T): T;
export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap);
}

function createReactiveObject(
  target: object,
  handlers: ProxyHandler<object>,
  proxyMap: WeakMap<object, any>,
) {
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const targetProxy = new Proxy(target, handlers);
  proxyMap.set(target, targetProxy);

  return targetProxy;
}
