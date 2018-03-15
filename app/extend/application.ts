'use strict';
import { IocContext } from 'power-di';
import { BaseApplicationClass } from '../../lib';

const IOC = Symbol('Application#PowerDI');

module.exports = {
  get iocContext() {
    if (!this[IOC]) {
      const ioc = this[IOC] = new IocContext();
      ioc.register(this, BaseApplicationClass);
    }
    return this[IOC];
  },
};
