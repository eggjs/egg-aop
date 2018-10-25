// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import { EggAppConfig } from 'egg';
import ExportConfigDefault from '../../config/config.default';
type ConfigDefault = typeof ExportConfigDefault;
declare module 'egg' {
  type NewEggAppConfig = ConfigDefault;
  interface EggAppConfig extends NewEggAppConfig { }
}