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

function getFinalData(target: any, data: any, func: any) {
  if (!func) {
    return data;
  }
  const newData = func(target, data);
  return newData === undefined ? data : newData;
}

function funcWrapper(point: AspectPoint, fn: Function) {
  let newFn: any;

  if (isGeneratorFunction(fn)) {
    newFn = function* (...args: any[]) {
      try {
        let result = yield fn.apply(this, getFinalData(this, args, point.before));
        return getFinalData(this, result, point.after);
      } catch (error) {
        throw getFinalData(this, error, point.onError);
      }
    };
  } else {
    // 非原生支持async的情况下没有有效方法判断async函数
    newFn = function (...args: any[]) {
      try {
        let result = fn.apply(this, getFinalData(this, args, point.before));
        if (result instanceof Promise) {
          result = result.then((ret) => {
            return getFinalData(this, ret, point.after);
          });
          if (point.onError) {
            result = (result as Promise<any>)
              .catch(error => {
                throw getFinalData(this, error, point.onError);
              });
          }
          return result;
        } else {
          return getFinalData(this, result, point.after);
        }
      } catch (error) {
        throw getFinalData(this, error, point.onError);
      }
    };
  }

  newFn.__name = (fn as any).__name || fn.name;
  return newFn;
}

export function aspect<T = any>(point: AspectPoint<T> = {}) {
  return (target: any, key: string, descriptor: any) => {
    let fn = funcWrapper(point, descriptor.value || target[key]);

    const value = {
      configurable: true,
      get() {
        return fn;
      },
      set(value: Function) {
        fn = funcWrapper(point, value);
      }
    };
    Object.defineProperty(target, key, value);
    return value;
  };
}
