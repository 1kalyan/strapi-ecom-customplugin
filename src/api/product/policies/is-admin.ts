import type { Core } from "@strapi/strapi";
import type { Context } from "koa";

export default (strapi: Core.Strapi) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const user = ctx.state.user;

    if (!user) return ctx.unauthorized("User not authenticated");

    if (user.role.name !== "Administrator") {
      return ctx.forbidden("Only admin can perform this action");
    }

    await next();
  };
};
