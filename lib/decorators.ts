export { inject, lazyInject } from 'power-di/helper';
import { InstanceSource } from './getInstance';
import { register as typeRegister } from './typeLoader';

/**
 * register component
 * @export
 * @param {InstanceSource} from 'Context' | 'Application'
 * @param {*} [classType] register component
 * @param {*} [keyType] the key of register component, default component self
 * @returns void
 */
export function register(from: InstanceSource, classType?: any, keyType?: any) {
  return (target: any) => {
    const clsType = classType || target;
    typeRegister(clsType, keyType || clsType, from);
  };
}

/**
 * inject in context
 *
 * @export
 * @param {*} [keyType]
 * @returns
 */
export function context(keyType?: any) {
  return register('Context', undefined, keyType);
}

/**
 * inject in application
 *
 * @export
 * @param {*} [keyType]
 * @returns
 */
export function application(keyType?: any) {
  return register('Application', undefined, keyType);
}
