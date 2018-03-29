import { IocContext } from 'power-di';

const IOC = Symbol('Context#PowerDI');

module.exports = {
  get iocContext() {
    if (!this[IOC]) {
      this[IOC] = new IocContext();
    }
    return this[IOC];
  },
};
