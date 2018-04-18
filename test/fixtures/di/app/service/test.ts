import { Service } from 'egg';
import { context } from '../../../../../lib';

@context()
export class TestService extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }
}
