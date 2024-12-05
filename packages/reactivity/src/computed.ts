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

export class ComputedRefImpl<T> {
  private _value!: T;
  public dep?: Dep = undefined;
  public readonly __v_isRef = true;
  public readonly effect: ReactiveEffect<T>;
  public _dirty = true;

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this; // effect 绑定 computed effect
  }

  get value() {
    trackRefValue(this);
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
