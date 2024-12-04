import { hasChanged } from '@vue-mini/share';
import { type Dep, createDep } from './dep';
import { activeEffect, trackEffects, triggerEffects } from './effect';
import { toReactive } from './reactive';

export interface Ref<T = any> {
  value: T;
}

export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>;
export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true);
}

export function ref<T = any>(value: T): Ref<T>;
export function ref(value?: unknown) {
  return createRef(value, false);
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) return rawValue;

  return new RefImpl(rawValue, shallow);
}

class RefImpl<T> {
  private _value: T;
  private _rawValue: T;
  public dep?: Dep = undefined;
  public readonly __v_isRef = true;

  constructor(
    value: T,
    public readonly __v_isShallow: boolean,
  ) {
    this._rawValue = value;
    this._value = __v_isShallow ? value : toReactive(value);
  }

  get value() {
    track(this);
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = toReactive(newValue);
      trigger(this, newValue);
    }
  }
}

function track(ref: Pick<RefImpl<unknown>, 'dep' | 'value'>) {
  if (activeEffect) {
    trackEffects(ref.dep ?? (ref.dep = createDep()));
  }
}

function trigger(
  ref: Pick<RefImpl<unknown>, 'dep' | 'value'>,
  // @ts-ignore
  // eslint-disable-next-line unused-imports/no-unused-vars
  newValue?: unknown,
) {
  if (ref.dep) {
    triggerEffects(ref.dep);
  }
}
