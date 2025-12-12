// src/api/order/policies/is-owner.ts
export default async (ctx, next) => {
  const { id } = ctx.params;
  const user = ctx.state.user;

  // If not logged in, block
  if (!user) {
    return ctx.unauthorized("You must be authenticated");
  }

  // Find the order
  const order = await strapi.entityService.findOne("api::order.order", id, {
    populate: ["users_permissions_user"],
  });

  if (!order) {
    return ctx.notFound("Order not found");
  }

  // Check ownership: order.users_permissions_user.id === logged in user id
  const owner = (order as any).users_permissions_user;

  if (!owner || owner.id !== user.id) {
    return ctx.forbidden("You are not the owner of this order");
  }
  // Continue to controller
  return next();
};
