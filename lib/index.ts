export * from './decorators';
export { getApp, getCtx } from './appctx';
export * from './getInstance';
export { typeLoader } from './typeLoader';
export * from './aspect';

import 'egg';
import { GetReturnType } from 'power-di';
declare module 'egg' {
  export interface Context {
    getComponent<T = undefined, KeyType= any>(clsType: KeyType): GetReturnType<T, KeyType>;
  }
  export interface Application {
    getComponent<T = undefined, KeyType= any>(clsType: KeyType): GetReturnType<T, KeyType>;
  }
}
