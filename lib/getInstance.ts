
import { IocContext } from 'power-di';
import { getGlobalType } from 'power-di/utils';
import { setApp, setCtx } from './appctx';
import { typeLoader } from './typeLoader';

export type InstanceSource = 'Context' | 'Application';

export type CreateInstanceHookFunction = (instance: any, app: any, ctx?: any) => any;

/** createInstanceHooks */
const ciHooks: CreateInstanceHookFunction[] = [];
export function setCreateInstanceHook(func: CreateInstanceHookFunction) {
  ciHooks.push(func);
}

export const contextTypeSymbol = Symbol('contextType');

export function getInstance<T = any>(clsType: any, app: any, ctx: any) {
  let ioc: IocContext = undefined;

  const targetClsType = typeLoader.get<any>(clsType);
  const from = targetClsType[contextTypeSymbol];

  if (from === 'Application') {
    ioc = app.iocContext;
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
      value = ciHooks.reduce((pre, cur) => cur(pre, app), new targetClsType(app));
      setApp(value, app);
    } else if (from === 'Context') {
      value = ciHooks.reduce((pre, cur) => cur(pre, app, ctx), new targetClsType(ctx));
      setCtx(value, ctx);
    }
    ioc.register(value, clsType);
    ioc.inject(value, (_globalType, typeCls) => {
      return getInstance(typeCls, app, ctx);
    });
  }
  return value;
}
