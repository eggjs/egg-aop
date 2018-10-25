// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import ExtendDContext from '../../../app/extend/context.d';
declare module 'egg' {
  type ExtendDContextType = typeof ExtendDContext;
  interface Context extends ExtendDContextType { }
}