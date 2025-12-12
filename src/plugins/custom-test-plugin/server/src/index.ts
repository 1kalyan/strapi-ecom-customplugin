/**
 * Application methods
 */
import destroy from './destroy';

/**
 * Plugin server methods
 */
import config from './config';
import contentTypes from './content-types';
import controllers from './controllers';
import middlewares from './middlewares';
import policies from './policies';
import routes from './routes';
import services from './services';

export default {
  // register,
  // bootstrap,
  register({ strapi }) {
    console.log('🔌 Custom Test Plugin Registering...');
    console.log('Routes:', JSON.stringify(routes, null, 2));
  },

  bootstrap({ strapi }) {
    console.log('✅ Custom Test Plugin Bootstrapped');
  },
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares,
};
