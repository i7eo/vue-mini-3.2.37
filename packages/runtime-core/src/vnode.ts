import {
  ShapeFlags,
  isArray,
  isFunction,
  isObject,
  isString,
} from '@vue-mini/share';

export interface VNode {
  __v_isVNode: boolean;
  type: any;
  props: any;
  children: any;
  shapeFlag: number;
}

export function createVNode(type: any, props: any, children: any): VNode {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;

  return createBaseVNode(type, props, children, shapeFlag);
}

function createBaseVNode(
  type: any,
  props: any,
  children: any,
  shapeFlag: number,
) {
  const vnode: VNode = {
    __v_isVNode: true,
    type,
    props,
    children,
    shapeFlag,
  };

  // 处理 children
  normalizeChildren(vnode, children);

  return vnode;
}

export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0;

  if (children === null) {
    children = null;
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else if (isObject(children)) {
    // eslint-disable-next-line no-empty
  } else if (isFunction(children)) {
  } else {
    // children 为 string
    children = String(children);
    // 为 type 指定 Flags
    type = ShapeFlags.TEXT_CHILDREN;
  }

  // 修改 vnode 的 chidlren
  vnode.children = children;
  // 按位或赋值
  vnode.shapeFlag |= type;
}

export function isVNode(value: any) {
  return value ? value.__v_isVNode === true : false;
}
