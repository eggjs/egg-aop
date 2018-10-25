import mm from 'egg-mock';
import assert = require('power-assert');
import { getInstance, context, application } from '../lib';

describe('getInstance', () => {
  let app: any;
  let ctx: any;

  before(() => {
    app = mm.app({
      baseDir: 'di',
    });
    return app.ready();
  });

  beforeEach(() => {
    ctx = app.createAnonymousContext();
  });

  afterEach(() => {
    mm.restore();
  });

  it('normal', () => {
    @context()
    class AService { }

    const aService = getInstance(AService, app, ctx);
    assert.ok(aService instanceof AService);

    @application()
    class BService { }

    const bService = getInstance(BService, app);
    assert.ok(bService instanceof BService);
  });

  it('fail, no register', () => {
    class AService { }

    assert.throws(() => {
      getInstance(AService, app, ctx);
    });
  });

  it('fail, no ctx', () => {
    @context()
    class AService { }

    assert.throws(() => {
      getInstance(AService, app, undefined);
    });
  });

  it('fail, no app', () => {
    @application()
    class AService { }

    assert.throws(() => {
      getInstance(AService, undefined, undefined);
    });
  });

});
