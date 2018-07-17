import { Service } from 'egg';
import { context, lazyInject } from '../../../../../lib';
import { TestService } from './test';

@context()
export class Test2Service extends Service {

  @lazyInject()
  private testService: TestService;

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return this.testService.sayHi(name);
  }
}
