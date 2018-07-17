import { inject as pdInject, lazyInject as pdLazyInject } from 'power-di/helper';
import { InstanceSource, getInstance } from './getInstance';
import { register as typeRegister } from './typeLoader';
import { getApp, getCtx } from './appctx';
import { getClsTypeByDecorator } from 'power-di/utils';

/**
 * register component
 * @export
 * @param {InstanceSource} from 'Context' | 'Application'
 * @param {*} [classType] register component
 * @param {*} [keyType] the key of register component, default component self
 * @returns void
 */
export function register(from: InstanceSource, classType?: any, keyType?: any) {
  return (target: any) => {
    const clsType = classType || target;
    typeRegister(clsType, keyType || clsType, from);
  };
}

/**
 * inject in context
 *
 * @export
 * @param {*} [keyType]
 * @returns
 */
export function context(keyType?: any) {
  return register('Context', undefined, keyType);
}

/**
 * inject in application
 *
 * @export
 * @param {*} [keyType]
 * @returns
 */
export function application(keyType?: any) {
  return register('Application', undefined, keyType);
}

/**
 * inject
 * type: class or string
 */
export function inject(type?: any) {
  return (target: any, key: string) => {
    pdInject({ type })(target, key);
    const clsType = getClsTypeByDecorator(type, target, key);

    let value: any;
    Object.defineProperty(target, key, {
      configurable: true,
      get() {
        if (value !== undefined) {
          return value;
        }
        const ctx = getCtx(this);
        const app = getApp(this) || (ctx && ctx.app);
        value = getInstance(clsType, app, ctx);
        return target[key];
      }
    });
  };
}

/**
 * lazy inject
 * type: class or string
 */
export function lazyInject(type?: any) {
  return (target: any, key: string) => {
    pdLazyInject({ type })(target, key);
    const clsType = getClsTypeByDecorator(type, target, key);

    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    const defaultValue = descriptor && descriptor.value;
    Object.defineProperty(target, key, {
      configurable: true,
      get: function () {
        const ctx = getCtx(this);
        const app = getApp(this) || (ctx && ctx.app);
        const value = getInstance(clsType, app, ctx);
        return value !== undefined ? value : defaultValue;
      },
    });
  };
}
