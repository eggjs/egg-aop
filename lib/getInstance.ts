
import { IocContext } from 'power-di';
import { getGlobalType } from 'power-di/utils';
import { setApp, setCtx, ctxSymbol } from './appctx';
import { typeLoader, register } from './typeLoader';

export type InstanceSource = 'Context' | 'Application';

export type CreateInstanceHookFunction = (instance: any, app: any, ctx?: any) => any;

/** createInstanceHooks */
const ciHooks: CreateInstanceHookFunction[] = [];
export function setCreateInstanceHook(func: CreateInstanceHookFunction) {
  ciHooks.push(func);
}

export const contextTypeSymbol = Symbol('contextType');

function registerInstance(ioc: IocContext, value: any, clsType: any, app: any, ctx: any) {
  ioc.register(value, clsType);
  ioc.inject(value, (_globalType, typeCls) => {
    return getInstance(typeCls, app, ctx);
  });
}

export function getInstance<T = any>(clsType: any, app: any, ctx: any) {
  let ioc: IocContext = undefined;

  const useCtxProxyForAppComponent = app.config.aop.useCtxProxyForAppComponent;
  const autoRegisterToCtx = app.config.aop.autoRegisterToCtx;

  if (autoRegisterToCtx && !typeLoader.has(clsType)) {
    register(clsType, clsType, 'Context');
  }

  const targetClsType = typeLoader.get<any>(clsType);
  if (!targetClsType) {
    throw new Error(`ClassType [${getGlobalType(clsType)}] NOT found!`);
  }
  const from = targetClsType[contextTypeSymbol];

  if (from === 'Application') {
    ioc = useCtxProxyForAppComponent ? ctx.iocContext : app.iocContext;
  } else if (from === 'Context') {
    ioc = ctx.iocContext;
  } else {
    throw new Error(`ioc context NOT found! [${getGlobalType(clsType)}]`);
  }

  let value = ioc.get<T>(clsType);
  if (!value) {
    if (!targetClsType) {
      throw new Error(`classType NOT registered! [${getGlobalType(clsType)}]`);
    }
    if (from === 'Application') {
      if (!app) {
        throw new Error(`inject [${getGlobalType(clsType)}] MUST in Application/Context class instance.`);
      }

      if (useCtxProxyForAppComponent) {
        value = app.iocContext.get(clsType);
      }

      if (!value) {
        value = ciHooks.reduce((pre, cur) => cur(pre, app), new targetClsType(app));
        setApp(value, app);

        if (useCtxProxyForAppComponent) {
          registerInstance(app.iocContext, value, clsType, app, ctx);
        }
      }

      if (useCtxProxyForAppComponent) {
        value = new Proxy<any>(value, {
          get(target, property) {
            if (property === ctxSymbol) {
              return ctx;
            }
            return target[property];
          }
        });
      }

    } else if (from === 'Context') {
      if (!ctx) {
        throw new Error(`inject [${getGlobalType(clsType)}] MUST in Context class instance.`);
      }
      value = ciHooks.reduce((pre, cur) => cur(pre, app, ctx), new targetClsType(ctx));
      setCtx(value, ctx);
    }
    registerInstance(ioc, value, clsType, app, ctx);
  }
  return value;
}
