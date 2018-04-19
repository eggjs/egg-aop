import { IocContext } from 'power-di';
import { contextTypeSymbol, InstanceSource } from './getInstance';

export const typeLoader = new IocContext;

export function register(clsType: any, keyType: any, from: InstanceSource) {
  Object.defineProperty(clsType, contextTypeSymbol, {
    value: from
  });
  typeLoader.register(clsType, keyType, { autoNew: false });
}
