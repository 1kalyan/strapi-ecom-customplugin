// server/src/routes/admin.ts
const adminRoutes = [
  {
    method: 'GET',
    path: '/schema',
    handler: 'registration.schema',
    config: {
      policies: [],
      auth: false, // or true if you want only logged-in admins
    },
  },
  {
    method: 'PUT',
    path: '/schema',
    handler: 'registration.updateSchema',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/register',
    handler: 'registration.register',
    config: {
      policies: [],
      auth: false,
    },
  },
];

export default adminRoutes;
