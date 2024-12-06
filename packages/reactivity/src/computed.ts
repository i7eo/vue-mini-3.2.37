import { isFunction, noop } from '@vue-mini/share';
import { ReactiveEffect } from './effect';
import {
  type Ref,
  track as trackRefValue,
  trigger as triggerRefValue,
} from './ref';
import type { Dep } from './dep';

export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T;
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>;
}

export type ComputedGetter<T> = (...args: any[]) => T;
export type ComputedSetter<T> = (v: T) => void;

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

/**
 * computed
 * 1. 收集依赖靠 get 属性，见 line 56
 * 2. 触发依赖靠 ReactiveEffect 第二个参数 scheduler，见 line 48
 */
export class ComputedRefImpl<T> {
  private _value!: T;
  public dep?: Dep = undefined;
  public readonly __v_isRef = true;
  public readonly effect: ReactiveEffect<T>;
  /** 脏：为 false 时，表示需要触发依赖。为 true 时表示需要重新执行 run 方法，获取数据。即：数据脏了 */
  public _dirty = true;

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      // 判断当前脏的状态，如果为 false，表示需要
      if (!this._dirty) {
        this._dirty = true;
        // 触发依赖
        triggerRefValue(this);
      }
    });
    this.effect.computed = this; // effect 绑定 computed effect
  }

  get value() {
    // 收集依赖
    trackRefValue(this);
    // 判断当前脏的状态，如果为 true ，则表示需要重新执行 run，获取最新数据
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run()!;
    }
    return this._value;
  }

  set value(newValue) {
    this._setter(newValue);
  }
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
export function computed<T>(
  options: WritableComputedOptions<T>,
): WritableComputedRef<T>;
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
) {
  return createComputed(getterOrOptions);
}

function createComputed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
) {
  let getter: ComputedGetter<T>;
  let setter: ComputedSetter<T>;

  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = noop;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  const computedRef = new ComputedRefImpl(getter, setter);
  return computedRef;
}
