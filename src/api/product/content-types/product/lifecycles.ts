export default {
  // BEFORE creating a product
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate SKU if missing
    if (!data.sku) {
      data.sku = `SKU-${Date.now()}`;
    }

    // Normalize price
    if (data.price && data.price < 0) {
      throw new Error("Price cannot be negative");
    }
  },

  // AFTER creating a product
  async afterCreate(event) {
    const { result } = event;

    strapi.log.info(`Product created: ${result.name} (${result.id})`);
  },

  // BEFORE updating a product
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Prevent accidental unpublish
    if (data.publishedAt === null) {
      strapi.log.warn(`Product ${where.id} was unpublished`);
    }
  },

  // AFTER updating a product
  async afterUpdate(event) {
    const { result } = event;

    strapi.log.info(`Product updated: ${result.name} (${result.id})`);
  },
};
