import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::product.product", {
  config: {
    find: { auth: false },
    findOne: { auth: false },
    create: { policies: ["api::product.is-admin"] },
    update: { policies: ["api::product.is-admin"] },
    delete: { policies: ["api::product.is-admin"] },
  },
});
