import { objectToString } from './is';

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function isSupport(callback: () => unknown) {
  return Boolean(callback());
}

// export function noop() {}

export function getTypeName(v: any) {
  if (v === null) return 'null';
  const type = objectToString.call(v).slice(8, -1).toLowerCase();
  return typeof v === 'object' || typeof v === 'function' ? type : typeof v;
}

export function randomValue(
  size = 16,
  dict = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict',
): string {
  let id = '';
  let i = size;
  const len = dict.length;
  while (i--) id += dict[Math.trunc(Math.random() * len)];
  return id;
}

export function hashString(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/**
 * compare whether a value has changed, accounting for NaN.
 * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
export function hasChanged(value: any, oldValue: any): boolean {
  return !Object.is(value, oldValue);
}
