import { aspect } from '../lib';
import assert = require('power-assert');

describe('test/aspect.test.js', () => {

  it('normal', () => {
    let a: A;
    let before = false;
    let after = false;
    let order: string[] = [];

    class A {
      @aspect({
        before: (context) => {
          order.push('1');
          before = true;
          assert.equal(context.inst, a);
          assert.deepEqual(context.args, ['test']);
        },
        after: (context) => {
          order.push('3');
          after = true;
          assert.equal(context.inst, a);
          assert.equal(context.ret, 'a:test');
        }
      })
      method(a: string) {
        order.push('2');
        return `a:${a}`;
      }
    }

    a = new A;
    order.push('0');
    a.method('test');
    order.push('4');
    assert.equal(before, true);
    assert.equal(after, true);
    assert.deepEqual(order, ['0', '1', '2', '3', '4']);
  });

  it('async', async () => {
    let a: A;
    let before = false;
    let after = false;
    let order: string[] = [];

    function test() {
      return aspect({
        before: (context) => {
          order.push('1');
          before = true;
          assert.equal(context.inst, a);
          assert.deepEqual(context.args, ['test']);
        },
        after: (context) => {
          order.push('3');
          after = true;
          assert.equal(context.inst, a);
          assert.equal(context.ret, 'a:test');
        }
      });
    }

    class A {
      @test()
      async method(a: string) {
        order.push('2');
        return `a:${a}`;
      }
    }

    a = new A;
    order.push('0');
    await a.method('test');
    order.push('4');
    assert.equal(before, true);
    assert.equal(after, true);
    assert.deepEqual(order, ['0', '1', '2', '3', '4']);
  });

  it('throw error', () => {
    let a: A;
    let error = false;

    class A {
      @aspect({
        error: (context) => {
          assert.equal(context.inst, a);
          error = true;
        }
      })
      method(a: string) {
        throw new Error(a);
      }
    }

    a = new A;
    assert.throws(() => a.method('test'));
    assert.equal(error, true);
  });

  it('replace args', () => {
    class A {
      @aspect({
        before: (context) => {
          assert.deepEqual(context.args, ['test']);
          context.args = ['changeargs'];
        },
      })
      method(a: string) {
        return `a:${a}`;
      }
    }

    assert.equal(new A().method('test'), 'a:changeargs');
  });

  it('replace ret', () => {
    class A {
      @aspect({
        after: (context) => {
          assert.equal(context.ret, 'a:test');
          context.ret = 'changeret';
        },
      })
      method(a: string) {
        return `a:${a}`;
      }
    }

    assert.equal(new A().method('test'), 'changeret');
  });

  it('catch error', () => {
    class A {
      @aspect({
        error: (context) => {
          context.err = undefined;
        },
      })
      method(a: string) {
        return `a:${a}`;
      }
    }

    assert.doesNotThrow(() => new A().method('test'));
  });

  it('replace error', () => {
    let testErr = new Error('test');

    class A {
      @aspect({
        error: (context) => {
          context.err = testErr;
        },
      })
      method(a: string) {
        throw new Error(a);
      }
    }

    assert.throws(() => new A().method('test'), (err: Error) => {
      return err === testErr;
    });
  });

});
