import { setCreateInstanceHook } from '../lib';

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

  afterEach(mm.restore);

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
});
