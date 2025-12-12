// src/plugins/custom-test-plugin/config/index.ts

const registrationSchema = {
  name: 'user-registration',
  title: 'User Registration',
  version: 1,
  // fallback for backend if needed
  collectionName: 'users',
  emailField: 'email',
  passwordField: 'password',
  usernameField: 'email',
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      required: false,
      min: 18,
    },
  ],
};

export default {
  default: {
    registrationSchema,
  },
  validator() {},
};
