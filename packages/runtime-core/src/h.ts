import { isArray, isObject } from '@vue-mini/share';
import { type VNode, createVNode, isVNode } from './vnode';

export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  // 获取用户传递的参数数量
  const argsLength = arguments.length;

  // 如果用户只传递了两个参数，那么证明第二个参数可能是 props , 也可能是 children
  if (argsLength === 2) {
    // 如果 第二个参数是对象，但不是数组。则第二个参数只有两种可能性：1. VNode 2.普通的 props
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // 如果是 VNode，则 第二个参数代表了 children
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      // 如果不是 VNode， 则第二个参数代表了 props
      return createVNode(type, propsOrChildren, null);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    // 如果用户传递了三个或以上的参数，那么证明第二个参数一定代表了 props
    if (argsLength > 3) {
      // eslint-disable-next-line prefer-rest-params
      children = [...arguments].slice(2);
      // 如果传递的参数只有三个，则 children 是单纯的 children
    } else if (argsLength === 3 && isVNode(children)) {
      children = [children];
    }
    // 触发 createVNode 方法，创建 VNode 实例
    return createVNode(type, propsOrChildren, children);
  }
}
