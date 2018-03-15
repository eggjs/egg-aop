import { IocContext } from 'power-di';
import { BaseContextClass } from '../../lib';
import { BaseContextClass as EGGBaseContextClass } from '../../lib/base';

const IOC = Symbol('Context#PowerDI');

module.exports = {
  get iocContext() {
    if (!this[IOC]) {
      const ioc = this[IOC] = new IocContext();
      ioc.register(this, BaseContextClass);
      ioc.register(this, EGGBaseContextClass);
    }
    return this[IOC];
  },
};
