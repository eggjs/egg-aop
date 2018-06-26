import { setCreateInstanceHook, removeCreateInstanceHook, clearCreateInstanceHook } from '../lib';

'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('setCreateInstanceHook', () => {
  let app: any;
  before(() => {
    app = mm.app({
      baseDir: 'di',
    });
    return app.ready();
  });

  after(() => app.close());

  afterEach(() => {
    mm.restore();
    clearCreateInstanceHook();
  });

  it('normal', () => {
    setCreateInstanceHook((_inst, _app, _ctx) => {
      return {
        sayHi() {
          return 'setCreateInstanceHook';
        }
      };
    });

    return request(app.callback())
      .get('/')
      .expect('setCreateInstanceHook')
      .expect(200);
  });

  it('remove', () => {
    const hook = (_inst: any, _app: any, _ctx: any) => {
      return {
        sayHi() {
          return 'setCreateInstanceHook';
        }
      };
    };
    setCreateInstanceHook(hook);
    removeCreateInstanceHook(hook);

    return request(app.callback())
      .get('/')
      .expect('hi, egg')
      .expect(200);
  });

  it('clear', () => {
    const hook = (_inst: any, _app: any, _ctx: any) => {
      return {
        sayHi() {
          return 'setCreateInstanceHook';
        }
      };
    };
    setCreateInstanceHook(hook);
    clearCreateInstanceHook();

    return request(app.callback())
      .get('/')
      .expect('hi, egg')
      .expect(200);
  });
});
