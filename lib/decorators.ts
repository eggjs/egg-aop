import { BaseContextClass } from './base_context_class';
import { BaseApplicationClass } from './base_application_class';
import { getGlobalTypeByDecorator } from 'power-di/lib/helper/decorators';
import { typeIocContext } from './ioc';
import { lazyInject as pdLazyInject } from 'power-di/helper';
import { getApp, getCtx } from './appctx';
import { getInstance, TypeInfo, InstanceSource } from './getInstance';

/**
 * register component
 * @export
 * @param {InstanceSource} from 'Context' | 'Application'
 * @param {*} [classType] register component
 * @param {*} [key] the key of register component, default component self
 * @returns void
 */
export function register(from: InstanceSource, classType?: any, key?: any) {
  return (target: any) => {
    const info = {
      from,
      key: key || classType || target,
      type: target,
    };
    typeIocContext.register(info, info.key);
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
      get: function (this: BaseContextClass | BaseApplicationClass | any /* for IDE noerror */) {
        const typeInfo = typeIocContext.get<TypeInfo>(classType);
        let app: any = undefined;
        let ctx: any = undefined;
        if (typeInfo.from === 'Application') {
          app = getApp(this);
          if (!app) {
            throw new Error(`inject [${classType}] MUST in Application/Context class instance.`);
          }
        } else if (typeInfo.from === 'Context') {
          ctx = getCtx(this);
          if (!ctx) {
            throw new Error(`inject [${classType}] MUST in Context class instance.`);
          }
          app = ctx.app;
        }

        const value = getInstance(typeInfo, app, ctx);

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
