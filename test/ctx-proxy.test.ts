import * as request from 'supertest';
import mm from 'egg-mock';

describe('di normal', () => {
  let app: any;
  before(() => {
    app = mm.app({
      baseDir: 'ctx-proxy',
    });
    return app.ready();
  });

  after(() => app.close());

  afterEach(mm.restore);

  it('get component by method', async () => {
    await request(app.callback())
      .get('/appcount')
      .expect('{"count":0,"inCtx":true}')
      .expect(200);

    return request(app.callback())
      .get('/appcount')
      .expect('{"count":1,"inCtx":true}')
      .expect(200);
  });
});
