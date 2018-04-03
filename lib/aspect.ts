const generatorFuncPrototype = Object.getPrototypeOf(function* (): any { });
function isGeneratorFunction(fn: any) {
  return typeof fn === 'function' && Object.getPrototypeOf(fn) === generatorFuncPrototype;
}

export type Throwable = Error | any;

export interface AspectPoint<T = any> {
  before?: (inst: T, args?: any[]) => any[] | void;
  after?: (inst: T, ret?: any) => any | void;
  onError?: (inst: T, error: Error) => Throwable | void;
}

function funcWrapper(point: AspectPoint, fn: Function) {
  let newFn: any;

  if (isGeneratorFunction(fn)) {
    newFn = function* (...args: any[]) {
      args = point.before && point.before(this, args) || args;
      try {
        const result = yield fn.apply(this, args);
        point.after && point.after(this, result);
        return result;
      } catch (error) {
        if (point.onError) {
          error = point.onError(this, error) || error;
        }
        throw error;
      }
    };
  } else {
    // 非原生支持async的情况下没有有效方法判断async函数
    newFn = function (...args: any[]) {
      args = point.before && point.before(this, args) || args;
      let result = fn.apply(this, args);
      if (result instanceof Promise) {
        result = result.then((ret) => {
          point.after && point.after(this, ret);
          return ret;
        });
        if (point.onError) {
          result = (result as Promise<any>)
            .catch(error => {
              error = point.onError(this, error) || error;
              throw error;
            });
        }
      } else {
        try {
          point.after && point.after(this, result);
        } catch (error) {
          if (point.onError) {
            error = point.onError(this, error) || error;
          }
          throw error;
        }
      }
      return result;
    };
  }

  newFn.__name = (fn as any).__name || fn.name;
  return newFn;
}

export function aspect<T = any>(point: AspectPoint<T> = {}) {
  return (target: any, key: string, descriptor: any) => {
    let fn = funcWrapper(point, descriptor.value || target[key]);

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
