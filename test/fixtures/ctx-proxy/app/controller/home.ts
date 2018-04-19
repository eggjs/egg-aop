import { Controller } from 'egg';
import { lazyInject } from '../../../../../lib';
import { AppLevelService } from '../service/app';

export default class HomeController extends Controller {

  @lazyInject()
  private appLevelService: AppLevelService;

  public async appCount() {
    this.ctx.body = {
      count: await this.appLevelService.get(),
      inCtx: !!this.ctx.getComponent(AppLevelService),
    };
  }
}
