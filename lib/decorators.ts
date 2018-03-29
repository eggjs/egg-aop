import { getGlobalTypeByDecorator } from 'power-di/lib/helper/decorators';
import { lazyInject as pdLazyInject } from 'power-di/helper';
import { getApp, getCtx } from './appctx';
import { getInstance, InstanceSource } from './getInstance';
import { contextTypeSymbol } from './getInstance';

/**
 * register component
 * @export
 * @param {InstanceSource} from 'Context' | 'Application'
 * @param {*} [classType] register component
 * @param {*} [key] the key of register component, default component self
 * @returns void
 */
export function register(from: InstanceSource, classType?: any) {
  return (target: any) => {
    Object.defineProperty(classType || target, contextTypeSymbol, {
      value: from
    });
  };
}

export function context(classType?: any) {
  return register('Context', classType);
}

export function application(classType?: any) {
  return register('Application', classType);
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
    classType = getGlobalTypeByDecorator(classType, target, key);

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
