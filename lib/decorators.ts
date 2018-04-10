import { getClsTypeByDecorator } from 'power-di/lib/helper/decorators';
import { lazyInject as pdLazyInject } from 'power-di/helper';
import { getApp, getCtx } from './appctx';
import { getInstance, InstanceSource } from './getInstance';
import { register as typeRegister } from './typeLoader';

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
 * lazy inject
 * This can new Class and inject app/ctx (need from ctx)
 * @export
 * @param {*} [classType] class or string
 * @returns void
 */
export function lazyInject(classType?: any): any {
  return (target: any, key: any) => {
    pdLazyInject(classType)(target, key);
    classType = getClsTypeByDecorator(classType, target, key);

    return {
      configurable: true,
      get: function (this: any) {
        const ctx = getCtx(this);
        let app = getApp(this);

        if (!app && ctx) {
          app = ctx.app;
        }

        const value = getInstance(classType, app, ctx);

        Object.defineProperty(this, key, {
          configurable: true,
          value: value
        });
        return value;
      }
    };
  };
}

/**
 * inject
 * This can new Class and inject app/ctx (need from ctx)
 * @export
 * @param {*} [classType] class or string
 * @returns void
 */
export function inject(classType?: any) {
  return lazyInject(classType);
}
