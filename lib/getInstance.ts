
import { IocContext } from 'power-di';
import { getGlobalType } from 'power-di/utils';
import { setApp, setCtx } from './appctx';

export type InstanceSource = 'Context' | 'Application';

export type CreateInstanceHookFunction = (instance: any, app: any, ctx?: any) => any;

/** createInstanceHooks */
const ciHooks: CreateInstanceHookFunction[] = [];
export function setCreateInstanceHook(func: CreateInstanceHookFunction) {
  ciHooks.push(func);
}

export const contextTypeSymbol = Symbol('contextType');
export const keyTypeSymbol = Symbol('keyType');

export function getInstance<T = any>(clsType: any, app: any, ctx: any) {
  let ioc: IocContext = undefined;
  const from = clsType[contextTypeSymbol];
  if (from === 'Application') {
    ioc = app.iocContext;
  } else if (from === 'Context') {
    ioc = ctx.iocContext;
  }

  let value = ioc.get<T>(clsType);
  if (!value) {
    if (from === 'Application') {
      if (!app) {
        throw new Error(`inject [${getGlobalType(clsType)}] MUST in Application/Context class instance.`);
      }
      value = ciHooks.reduce((pre, cur) => cur(pre, app), new clsType(app));
      setApp(value, app);
    } else if (from === 'Context') {
      value = ciHooks.reduce((pre, cur) => cur(pre, app, ctx), new clsType(ctx));
      setCtx(value, ctx);
    }
    const keyType = clsType[keyTypeSymbol];
    ioc.register(value, keyType || clsType);
    ioc.inject(value, (_globalType, typeCls) => {
      return getInstance(typeCls, app, ctx);
    });
  }
  return value;
}
