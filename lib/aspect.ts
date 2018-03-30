const generatorFuncPrototype = Object.getPrototypeOf(function* (): any { });
function isGeneratorFunction(fn: any) {
  return typeof fn === 'function' && Object.getPrototypeOf(fn) === generatorFuncPrototype;
}

export interface AspectPoint<T = any> {
  before?: (inst: T) => void;
  after?: (inst: T) => void;
}

function funcWrapper(point: AspectPoint, fn: Function) {
  let newFn: any;

  if (isGeneratorFunction(fn)) {
    newFn = function* (...args: any[]) {
      point.before && point.before(this);
      const result = yield fn.apply(this, args);
      point.after && point.after(this);
      return result;
    };
  } else {
    // 非原生支持async的情况下没有有效方法判断async函数
    newFn = function (...args: any[]) {
      point.before && point.before(this);
      const result = fn.apply(this, args);
      if (result instanceof Promise) {
        result.then(() => {
          point.after && point.after(this);
        });
      } else {
        point.after && point.after(this);
      }
      return result;
    };
  }

  newFn.__name = (fn as any).__name || fn.name;
  return newFn;
}

export function aspect<T = any>(point: AspectPoint<T> = {}) {
  return (target: any, key: string, descriptor: any) => {
    let fn = funcWrapper(point, descriptor.value);

    Object.defineProperty(target, key, {
      configurable: true,
      get() {
        return fn;
      },
      set(value) {
        fn = funcWrapper(point, value);
      }
    });
  };
}
