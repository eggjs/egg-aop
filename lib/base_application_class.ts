import {
  Application as EggApplication,
} from './base';
import { getInstanceByClassType } from '.';

export class BaseApplicationClass {

  constructor(
    protected app: EggApplication
  ) {
  }

  public GetComponent<T>(classType: any) {
    return getInstanceByClassType<T>(classType, this.app, undefined);
  }
}
