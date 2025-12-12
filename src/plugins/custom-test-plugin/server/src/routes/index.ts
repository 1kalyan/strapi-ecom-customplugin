import adminRoutes from './admin';
import contentAPIRoutes from './content-api';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: [...contentAPIRoutes],
  },
  admin: {
    type: 'admin',
    routes: [...adminRoutes],
  },
};

export default routes;
