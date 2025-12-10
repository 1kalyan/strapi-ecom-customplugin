import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;

      // Only admin can set user_id manually
      if (!user) return ctx.unauthorized("User not authenticated");

      if (user.role.name !== "Administrator") {
        ctx.request.body.data.user = user.id;
      }

      const response = await super.create(ctx);
      return response;
    },
  })
);
