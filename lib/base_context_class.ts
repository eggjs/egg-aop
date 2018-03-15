import {
  BaseContextClass as EggBCC,
} from './base';
import { getInstanceByClassType } from './decorators';

export class BaseContextClass extends EggBCC {

  public GetComponent<T>(classType: any) {
    return getInstanceByClassType<T>(classType, this.app, this.ctx);
  }
}
