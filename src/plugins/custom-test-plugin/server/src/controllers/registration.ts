// // server/src/controllers/registration.ts
// export default ({ strapi }) => ({
//   async register(ctx) {
//     const body = ctx.request.body;

//     // Call the service inside the same plugin
//     const result = await strapi.service('plugin::custom-test-plugin.registration').register(body);

//     // Decide status code
//     if (!result.success) {
//       ctx.status = 400;
//     }

//     ctx.body = result;
//   },
// });

// server/src/controllers/registration.ts
// server/controllers/registration.ts
import type { Core } from '@strapi/strapi';

const registrationController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async register(ctx) {
    try {
      strapi.log.info(
        'Incoming /custom-test-plugin/register body: ' + JSON.stringify(ctx.request.body)
      );

      const result = await strapi
        .service('plugin::custom-test-plugin.registration')
        .register(ctx.request.body);

      strapi.log.info('Result from registrationService.register: ' + JSON.stringify(result));

      if (!result.success) {
        // If it's a validation-type error, send 400 with a proper message
        if (result.errors) {
          return ctx.badRequest('Validation failed', {
            errors: result.errors,
          });
        }

        // Generic service failure
        return ctx.internalServerError(result.message || 'Registration failed');
      }

      ctx.body = result;
    } catch (err: any) {
      strapi.log.error('Error in registrationController.register', err);
      ctx.internalServerError('Internal server error');
    }
  },

  async schema(ctx) {
    const schema = await strapi.service('plugin::custom-test-plugin.registration').getSchema();
    strapi.log.info('Schema from service: ' + JSON.stringify(schema));
    ctx.body = schema;
  },

  async updateSchema(ctx) {
    const result = await strapi
      .service('plugin::custom-test-plugin.registration')
      .updateSchema(ctx.request.body);
    strapi.log.info('Schema updated (updateSchema): ' + JSON.stringify(result));
    ctx.body = result;
  },
});

export default registrationController;
