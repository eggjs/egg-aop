// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import ExtendDApplication from '../../../app/extend/application.d';
declare module 'egg' {
  type ExtendDApplicationType = typeof ExtendDApplication;
  interface Application extends ExtendDApplicationType { }
}