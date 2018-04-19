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
        before: (inst, args) => {
          order.push('1');
          before = true;
          assert.equal(inst, a);
          assert.deepEqual(args, ['test']);
        },
        after: (inst, ret) => {
          order.push('3');
          after = true;
          assert.equal(inst, a);
          assert.equal(ret, 'a:test');
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
        before: (inst, args) => {
          order.push('1');
          before = true;
          assert.equal(inst, a);
          assert.deepEqual(args, ['test']);
        },
        after: (inst, ret) => {
          order.push('3');
          after = true;
          assert.equal(inst, a);
          assert.equal(ret, 'a:test');
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

  it('onError', () => {
    let a: A;
    let error = false;

    class A {
      @aspect({
        onError: (inst, _err) => {
          assert.equal(inst, a);
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
});
