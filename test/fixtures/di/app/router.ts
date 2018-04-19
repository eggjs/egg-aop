import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', (controller as any).home.index);
  router.get('/inject', (controller as any).home.notype);
  router.get('/notype', (controller as any).home.notype);
  router.get('/getcomponent', (controller as any).home.getComponent);
  router.get('/appcount', (controller as any).home.appCount);
  router.get('/appgetcomponent', (controller as any).home.appGetComponent);
};
