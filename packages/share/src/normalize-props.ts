import { isArray, isObject, isString } from '.';

export type NormalizedStyle = Record<string, string | number>;

export function normalizeStyle(
  value: unknown,
): NormalizedStyle | string | undefined {
  if (isArray(value)) {
    const res: NormalizedStyle = {};
    for (const item of value) {
      const normalized = isString(item)
        ? parseStringStyle(item)
        : (normalizeStyle(item) as NormalizedStyle);
      if (normalized) {
        for (const [key, _value] of Object.entries(normalized)) {
          res[key] = _value;
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}

const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;

export function parseStringStyle(cssText: string): NormalizedStyle {
  const ret: NormalizedStyle = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}

export function normalizeClass(value: unknown): string {
  let res = '';
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (const element of value) {
      const normalized = normalizeClass(element);
      if (normalized) {
        res += `${normalized} `;
      }
    }
  } else if (isObject(value)) {
    for (const [name, _value] of Object.entries(value)) {
      if (_value) {
        res += `${name} `;
      }
    }
  }
  return res.trim();
}
