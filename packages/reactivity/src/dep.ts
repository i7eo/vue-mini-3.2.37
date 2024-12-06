import type { ReactiveEffect } from './effect';

export type Dep = Set<ReactiveEffect>;

/**
 * 依据 effects 生成 dep 实例
 * 使用 set 对地址未发生变化的引用进行去重
 * @param effects
 * @returns
 */
export function createDep(effects?: ReactiveEffect[]): Dep {
  const dep = new Set<ReactiveEffect>(effects) as Dep;
  return dep;
}
