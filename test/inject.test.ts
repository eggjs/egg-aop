import mm from 'egg-mock';
import assert = require('assert');
import { inject, context } from '../lib';
import { setApp, setCtx } from '../lib/appctx';

describe('inject', () => {
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
    class BService { }

    class AService {
      @inject()
      bService: BService;
    }

    const aService = new AService();
    setApp(aService, app);
    setCtx(aService, ctx);
    assert.ok(aService.bService instanceof BService);

  });

});
