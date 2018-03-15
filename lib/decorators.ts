import { BaseContextClass } from './base_context_class';
import { BaseApplicationClass } from './base_application_class';
import { getGlobalTypeByDecorator } from 'power-di/lib/helper/decorators';
import { typeIocContext } from './ioc';
import { IocContext } from 'power-di';
import { lazyInject as pdLazyInject } from 'power-di/helper';

const ctxSymbol = Symbol('ctx');
function setCtx(target: any, ctx: any) {
  Object.defineProperty(target, ctxSymbol, {
    enumerable: false,
    writable: false,
    value: ctx
  });
}
function getCtx(target: any) {
  return target[ctxSymbol] || target.ctx;
}

const appSymbol = Symbol('app');
function setApp(target: any, app: any) {
  Object.defineProperty(target, appSymbol, {
    enumerable: false,
    writable: false,
    value: app
  });
}
function getApp(target: any) {
  return target[appSymbol] || target.app;
}

export type InstanceSource = 'Context' | 'Application';

interface TypeInfo {
  from: InstanceSource;
  key: any;
  type: any;
}

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


function getInstance<T = any>(typeInfo: TypeInfo, app: any, ctx: any) {
  let ioc: IocContext = undefined;
  if (typeInfo.from === 'Application') {
    ioc = app.iocContext;
  } else if (typeInfo.from === 'Context') {
    ioc = ctx.iocContext;
  }

  let value = ioc.get<T>(typeInfo.type);
  if (!value) {
    if (typeInfo.from === 'Application') {
      value = new typeInfo.type(app);
      setApp(value, app);
    } else if (typeInfo.from === 'Context') {
      value = new typeInfo.type(ctx);
      setCtx(value, ctx);
    }
    ioc.register(value, typeInfo.key);
    ioc.inject(value, (globalType) => {
      const ti = typeIocContext.get<TypeInfo>(globalType);
      if (!ti) return;
      return getInstance(ti, app, ctx);
    });
  }
  return value;
}

export function getInstanceByClassType<T>(classType: any, app: any, ctx: any) {
  const typeInfo = typeIocContext.get<TypeInfo>(classType);
  return getInstance<T>(typeInfo, app, ctx);
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
          app = ctx.app;
          if (!ctx) {
            throw new Error(`inject [${classType}] MUST in Context class instance.`);
          }
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
