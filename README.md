# egg-typed-di

## Quick overview


### Service
```ts
import { Service, serviceMetadata, Context } from 'egg-typed';

@context()
export class TestService extends Service {
  get(id: string | number) {
    return {
      id,
      name: this.app.config.test + '_' + id,
    };
  }
}

export class Controller {
  private testService: TestService;
  
}
```
