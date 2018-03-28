
import { IocContext } from 'power-di';
import { typeIocContext } from './ioc';
import { setApp, setCtx } from './appctx';

export type InstanceSource = 'Context' | 'Application';

export interface TypeInfo {
  from: InstanceSource;
  key: any;
  type: any;
}

export type CreateInstanceHookFunction = (instance: any, app: any, ctx?: any) => any;

/** createInstanceHooks */
const ciHooks: CreateInstanceHookFunction[] = [];
export function setCreateInstanceHook(func: CreateInstanceHookFunction) {
  ciHooks.push(func);
}

export function getInstance<T = any>(typeInfo: TypeInfo, app: any, ctx: any) {
  let ioc: IocContext = undefined;
  if (typeInfo.from === 'Application') {
    ioc = app.iocContext;
  } else if (typeInfo.from === 'Context') {
    ioc = ctx.iocContext;
  }

  let value = ioc.get<T>(typeInfo.type);
  if (!value) {
    if (typeInfo.from === 'Application') {
      value = ciHooks.reduce((pre, cur) => cur(pre, app), new typeInfo.type(app));
      setApp(value, app);
    } else if (typeInfo.from === 'Context') {
      value = ciHooks.reduce((pre, cur) => cur(pre, app, ctx), new typeInfo.type(ctx));
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
