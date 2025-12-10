export default {
  routes: [
    {
      method: "GET",
      path: "/products/:id/details",
      handler: "product.findOneWithDetails",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/products/details",
      handler: "product.findAllWithDetails",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/products/slug/:slug",
      handler: "product.findBySlug",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/products/search",
      handler: "product.search",
      config: {
        auth: false,
      },
    },
  ],
};
