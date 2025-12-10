// server/src/controllers/registration.ts
export default ({ strapi }) => ({
  async register(ctx) {
    const body = ctx.request.body;

    // Call the service inside the same plugin
    const result = await strapi.service('plugin::custom-test-plugin.registration').register(body);

    // Decide status code
    if (!result.success) {
      ctx.status = 400;
    }

    ctx.body = result;
  },
});
