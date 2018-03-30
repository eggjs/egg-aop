# egg-aop

## Quick overview

### DI
```ts
import { Service, Context } from 'egg';
import { context, lazyInject } from 'egg-aop';

@context()
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

## API

#### aspect
```ts
function logging(type: string) {
  return aspect({
    // before method running
    before: (inst, args) => { /* log code */ },
    // after method running
    after: (inst, ret) => { /* log code */ },
  })
}

class DemoService {
  @logging('create')
  createData() {
    /* code */
  }
}
```

#### getInstance

#### setCreateInstanceHook

#### typeLoader
