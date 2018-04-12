export * from './decorators';
export { getApp, getCtx } from './appctx';
export * from './getInstance';
export { typeLoader } from './typeLoader';
export * from './aspect';

import 'chair';
declare module 'chair' {
  export interface Context {
    getComponent<T = any>(clsType: any): T;
  }
  export interface Application {
    getComponent<T = any>(clsType: any): T;
  }
}
