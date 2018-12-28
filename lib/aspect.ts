const generatorFuncPrototype = Object.getPrototypeOf(function* (): any { });
function isGeneratorFunction(fn: any) {
  return typeof fn === 'function' && Object.getPrototypeOf(fn) === generatorFuncPrototype;
}

export type Throwable = Error | any;

export const FunctionContextSymbol = Symbol('FunctionContextSymbol');

export interface FunctionContext<T = any> {
  readonly inst: T;
  readonly functionName: string;
  args: any[];
  ret: any;
  err: Error;
}

export interface AspectPoint<T = any> {
  before?: (context: FunctionContext<T>) => void;
  after?: (context: FunctionContext<T>) => void;
  error?: (context: FunctionContext<T>) => void;
}

function run(func: any, context: FunctionContext) {
  if (func) func(context);
}

function createContext(inst: any, fn: (a: any) => void, args: any[]) {
  return {
    functionName: (fn as any).__name || fn.name,
    inst,
    args,
  } as FunctionContext;
}

export function funcWrapper(point: AspectPoint, fn: (a: any) => void) {
  let newFn: any;

  if (isGeneratorFunction(fn)) {
    newFn = function* (...args: any[]) {
      const context = createContext(this, fn, args);
      try {
        run(point.before, context);
        context.ret = yield fn.apply(this, context.args);
        run(point.after, context);
        return context.ret;
      } catch (error) {
        context.err = error;
        run(point.error, context);
        if (context.err) {
          throw context.err;
        }
      }
    };
  } else {
    // 非原生支持async的情况下没有有效方法判断async函数
    newFn = function (...args: any[]) {
      const context = createContext(this, fn, args);
      try {
        run(point.before, context);
        context.ret = fn.apply(this, context.args);
        if (context.ret instanceof Promise) {
          context.ret = context.ret.then(ret => {
            context.ret = ret;
            run(point.after, context);
            return context.ret;
          });
          if (point.error) {
            context.ret = (context.ret as Promise<any>)
              .catch(error => {
                context.err = error;
                run(point.error, context);
                if (context.err) {
                  throw context.err;
                }
              });
          }
          Object.defineProperty(context.ret, FunctionContextSymbol, {
            enumerable: false,
            configurable: true,
            value: context,
          });
          return context.ret;
        } else {
          run(point.after, context);
          return context.ret;
        }
      } catch (error) {
        context.err = error;
        run(point.error, context);
        if (context.err) {
          throw context.err;
        }
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
      set(v: (a: any) => void) {
        fn = funcWrapper(point, v);
      },
    };
    Object.defineProperty(target, key, value);
    return value;
  };
}
