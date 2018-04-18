import { Controller } from 'egg';
import { lazyInject, inject } from '../../../../../lib';
import { TestService } from '../service/Test';
import { AppLevelService } from '../service/app';

export default class HomeController extends Controller {
  @lazyInject()
  private testService: TestService;

  @lazyInject(TestService)
  private testService2: any; // without typescript metadata gen.

  @inject()
  private testService3: TestService;

  @lazyInject()
  private appLevelService: AppLevelService;

  public async index() {
    this.ctx.body = await this.testService.sayHi('egg');
  }

  public async inject() {
    this.ctx.body = await this.testService3.sayHi('egg');
  }

  public async notype() {
    this.ctx.body = await this.testService2.sayHi('egg');
  }

  public async getComponent() {
    this.ctx.body = await this.ctx.getComponent<TestService>(TestService).sayHi('service');
  }

  public async appCount() {
    this.ctx.body = await this.appLevelService.get();
  }
}
