import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/appcount', (controller as any).home.appCount);
};
