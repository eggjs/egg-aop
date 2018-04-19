# egg-aop

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
- `@application(keyType?: any)`
- `@inject(keyType?: any)`
- `@lazyInject(keyType?: any)`

#### functions
- `getInstance<T = any>(clsType: any, app: any, ctx: any): T`
- `setCreateInstanceHook(func: CreateInstanceHookFunction)`

#### typeLoader

## AOP

### Quick overview
```ts
function logging(type: string) {
  return aspect({
    // before method running
    before: (inst, args) => { /* log code */ },
    // after method running
    after: (inst, ret) => { /* log code */ },
    // when method throw error
    onError: (inst, err) => { /* log code */ },
  })
}

class DemoService {
  @logging('create')
  createData() {
    /* code */
  }
}
```

### API

#### functions
- `aspect<T = any>(point: AspectPoint<T> = {})`
