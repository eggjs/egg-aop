# egg-aop

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-aop.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-aop
[travis-image]: https://img.shields.io/travis/eggjs/egg-aop.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-aop
[codecov-image]: https://codecov.io/github/eggjs/egg-aop/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/eggjs/egg-aop?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-aop.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-aop
[snyk-image]: https://snyk.io/test/npm/egg-aop/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-aop
[download-image]: https://img.shields.io/npm/dm/egg-aop.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-aop

Add DI, AOP support for eggjs.

## DI

### Quick overview
```ts
import { Service, Context } from 'egg';
import { context, lazyInject } from 'egg-aop';

@context() // or @application()
export class TestService extends Service {
  get() {
    /* code */
  }
}

export class Controller {
  @lazyInject()
  private testService: TestService;
  
  demo() {
    this.testService.get();
  }
}
```

### API

#### decoratros
- `@context(keyType?: any)`

  Declaration life cycle of instance, is context level. You can provide a class type or from metadata by TypeScript emit.
  
- `@application(keyType?: any)`

  Declaration life cycle of instance, is context level. You can provide a class type or from metadata by TypeScript emit.

- `@inject(keyType?: any)`

  Inject component when the class instantiation.

- `@lazyInject(keyType?: any)`

  Inject component when access the property.

#### functions
- `getInstance<T = any>(clsType: any, app: any, ctx: any): T`

  You can use this function to manually get the component instance.

- `setCreateInstanceHook(func: CreateInstanceHookFunction)`

  You can use this function to interception every new component instance.

  `type CreateInstanceHookFunction = (instance: any, app: any, ctx?: any) => any;`

#### typeLoader

`typeLoader` is a instance of IocContext, this stored all type's classes. You can use this to affect DI behavior.

## AOP

### Quick overview
```ts
function logging(type: string) {
  return aspect({
    // before method running
    before: (context) => { /* log code */ },
    // after method running
    after: (context) => { /* log code */ },
    // when method throw error
    onError: (context) => { /* log code */ },
  })
}

class DemoService {
  @logging('create')
  createData() {
    /* code */
  }
}

/* FunctionContext type define */
export interface FunctionContext<T = any> {
  readonly inst: T;
  readonly functionName: string;
  args: any[];
  ret: any;
  err: Error;
}
```

### API

#### functions
- `aspect<T = any>(point: AspectPoint<T> = {})`

  You can use this to interception method, this function provide `before` / `after` / `error` cross-section.

  ```ts
  interface AspectPoint<T = any> {
    before?: (context: FunctionContext<T>) => void;
    after?: (context: FunctionContext<T>) => void;
    error?: (context: FunctionContext<T>) => void;
  }
  ```

  The param `context` is the function's execution context. It include `inst` / `args` / `ret`. You can replace them to affect the function execute.
