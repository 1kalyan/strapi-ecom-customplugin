import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::order.order", {
  config: {
    findOne: {
      policies: ["api::order.is-owner"],
    },
    update: {
      policies: ["api::order.is-owner"],
    },
    delete: {
      policies: ["api::order.is-owner"],
    },
    // create route can be open, ownership handled in controller
  },
});
