import { application } from '../../../../../lib';

@application()
export class AppLevelService {

  private count = 0;

  public async get() {
    return this.count++;
  }
}
