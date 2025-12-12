import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async findOneWithDetails(ctx) {
      const { id } = ctx.params;
      const entity = await strapi.entityService.findOne(
        "api::product.product",
        id,
        {
          populate: "*",
          status: "published",
        }
      );
      return entity;
    },

    async findAllWithDetails(ctx) {
      const { slug, name, category, minPrice, maxPrice, ...rest } = ctx.query;

      // Build dynamic filters
      const filters: any = {};

      if (slug) {
        filters.slug = slug; // Exact match
        // Or use: filters.slug = { $containsi: slug }; // Partial match
      }

      if (name) {
        filters.name = { $containsi: name }; // Case-insensitive partial match
      }

      if (category) {
        filters.category = { slug: category };
      }

      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = Number(minPrice);
        if (maxPrice) filters.price.$lte = Number(maxPrice);
      }

      const entities = await strapi.entityService.findMany(
        "api::product.product",
        {
          ...rest,
          filters,
          populate: "*",
          status: "published",
        }
      );

      return entities;
    },

    // New method: Find by slug
    async findBySlug(ctx) {
      const { slug } = ctx.params;

      const entities = await strapi.entityService.findMany(
        "api::product.product",
        {
          filters: { slug },
          populate: "*",
          status: "published",
        }
      );

      if (entities.length === 0) {
        return ctx.notFound("Product not found");
      }

      return entities[0]; // Return the first match
    },

    // New method: Search with filters
    async search(ctx) {
      const { slug, name, minPrice, maxPrice, category } = ctx.query;

      const filters: any = {};

      if (slug) {
        filters.slug = { $contains: slug };
      }

      if (name) {
        filters.name = { $containsi: name }; // Case-insensitive search
      }

      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = minPrice;
        if (maxPrice) filters.price.$lte = maxPrice;
      }

      if (category) {
        filters.category = { slug: category };
      }

      const entities = await strapi.entityService.findMany(
        "api::product.product",
        {
          filters,
          populate: "*",
          status: "published",
        }
      );

      return entities;
    },
  })
);
