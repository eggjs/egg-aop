export const ctxSymbol = Symbol('ctx');
export function setCtx(target: any, ctx: any) {
  Object.defineProperty(target, ctxSymbol, {
    enumerable: false,
    writable: false,
    value: ctx
  });
}
export function getCtx(target: any) {
  return target[ctxSymbol] || target.ctx;
}

export const appSymbol = Symbol('app');
export function setApp(target: any, app: any) {
  Object.defineProperty(target, appSymbol, {
    enumerable: false,
    writable: false,
    value: app
  });
}
export function getApp(target: any) {
  return target[appSymbol] || target.app;
}
