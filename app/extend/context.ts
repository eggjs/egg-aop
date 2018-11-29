import { IocContext } from 'power-di';
import { getInstance } from '../../lib';

const IOC = Symbol('Context#PowerDI');

export default {
  get iocContext() {
    if (!this[IOC]) {
      this[IOC] = new IocContext();
    }
    return this[IOC];
  },
  get getComponent() {
    return function <T = any>(clsType: any) {
      return getInstance<T>(clsType, this.app, this);
    };
  },
};
