import { hasChanged } from '@vue-mini/share';
import { type Dep, createDep } from './dep';
import { activeEffect, trackEffects, triggerEffects } from './effect';
import { toReactive } from './reactive';

export enum RefFlags {
  IS_REF = '__v_isRef',
  IS_SHALLOW = '__v_isShallow',
}

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
  // public readonly [RefFlags.IS_REF] = true; ✅

  constructor(
    value: T,
    public readonly __v_isShallow: boolean,
    // public readonly [RefFlags.IS_SHALLOW]: boolean, ❌
  ) {
    this._rawValue = value;
    // 如果 __v_isShallow 为 true，则 value 不会被转化为 reactive 数据，即如果当前 value 为复杂数据类型，则会失去响应性。对应官方文档 shallowRef ：https://cn.vuejs.org/api/reactivity-advanced.html#shallowref
    this._value = __v_isShallow ? value : toReactive(value);
  }

  /**
   * get 语法将对象属性绑定到查询该属性时将被调用的函数。
   * 即：xxx.value 时触发该函数
   */
  get value() {
    track(this);
    return this._value;
  }

  /**
   * newVal 为新数据
   * this._rawValue 为旧数据（原始数据）
   * 对比两个数据是否发生了变化
   */
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = toReactive(newValue);
      trigger(this, newValue);
    }
  }
}

export function track(ref: Pick<RefImpl<unknown>, 'dep' | 'value'>) {
  if (activeEffect) {
    trackEffects(ref.dep ?? (ref.dep = createDep()));
  }
}

export function trigger(
  ref: Pick<RefImpl<unknown>, 'dep' | 'value'>,
  // @ts-ignore
  // eslint-disable-next-line unused-imports/no-unused-vars
  newValue?: unknown,
) {
  if (ref.dep) {
    triggerEffects(ref.dep);
  }
}
