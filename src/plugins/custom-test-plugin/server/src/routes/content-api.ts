// server/src/routes/content-api.ts
const contentApiRoutes = [
  {
    method: 'POST',
    path: '/register',
    handler: 'registration.register',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/schema',
    handler: 'registration.schema',
  },
];

export default contentApiRoutes;
