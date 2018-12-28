import { setCreateInstanceHook, clearCreateInstanceHook } from '../lib';

import * as request from 'supertest';
import mm from 'egg-mock';
import assert = require('assert');

describe('di normal', () => {
  let app: any;
  before(() => {
    app = mm.app({
      baseDir: 'di',
    });
    return app.ready();
  });

  after(() => app.close());

  afterEach(mm.restore);

  it('normal lazyInject', () => {
    const insts: any[] = [];
    setCreateInstanceHook(inst => {
      insts.push(inst);
      return inst;
    });

    return request(app.callback())
      .get('/')
      .expect('hi, egg')
      .expect(200)
      .then(() => {
        clearCreateInstanceHook();
        assert.equal(insts.length, 1);
      });
  });

  it('normal inject', () => {
    return request(app.callback())
      .get('/')
      .expect('hi, egg')
      .expect(200);
  });

  it('without typescript metadata gen', () => {
    return request(app.callback())
      .get('/notype')
      .expect('hi, egg')
      .expect(200);
  });

  it('get component by method', () => {
    return request(app.callback())
      .get('/getcomponent')
      .expect('hi, service')
      .expect(200);
  });

  it('app component', async () => {
    await request(app.callback())
      .get('/appcount')
      .expect('0')
      .expect(200);

    return request(app.callback())
      .get('/appcount')
      .expect('1')
      .expect(200);
  });

  it('get app component by method', () => {
    return request(app.callback())
      .get('/appgetcomponent')
      .expect('2')
      .expect(200);
  });

  it('mutli level lazyInject', () => {
    const insts: any[] = [];
    setCreateInstanceHook(inst => {
      insts.push(inst);
      return inst;
    });

    return request(app.callback())
      .get('/mutli')
      .expect('hi, egg')
      .expect(200)
      .then(() => {
        clearCreateInstanceHook();
        assert.equal(insts.length, 2);
      });
  });
});
