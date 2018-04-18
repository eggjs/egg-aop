import { Controller } from 'egg';
import { lazyInject } from '../../../../../lib';
import { TestService } from '../service/Test';

export default class HomeController extends Controller {
  @lazyInject()
  private testService: TestService;

  public async index() {
    this.ctx.body = await this.testService.sayHi('egg');
  }

}
