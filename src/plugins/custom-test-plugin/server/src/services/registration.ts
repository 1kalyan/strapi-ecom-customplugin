// server/src/services/registration.ts
import { RegistrationResponse, UserRegistrationRequest } from '../types';
import { validatePayload } from '../utils/validate';

export default ({ strapi }) => ({
  async register(payload: UserRegistrationRequest): Promise<RegistrationResponse> {
    const { schema, data } = payload;

    // 1. Validate
    const errors = validatePayload(schema, data);
    if (errors.length > 0) {
      return { success: false, errors };
    }

    // 2. Normalize user data
    const userData: Record<string, any> = {};

    for (const field of schema.fields) {
      if (data[field.name] !== undefined) {
        userData[field.name] = data[field.name];
      } else if (field.defaultValue !== undefined) {
        userData[field.name] = field.defaultValue;
      }
    }

    // 3. Extract auth fields
    const email = schema.emailField ? data[schema.emailField] : undefined;
    const password = schema.passwordField ? data[schema.passwordField] : undefined;
    const username = schema.usernameField ? data[schema.usernameField] : undefined;

    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
      };
    }

    // 4. Unique check
    const existingUser = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { email } });

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    // 5. Create user
    const user = await strapi
      .plugin('users-permissions')
      .service('user')
      .add({
        ...userData,
        email,
        username: username || email,
        password,
        confirmed: true,
        role: 1, // or whatever role id you want
      });

    return {
      success: true,
      data: user,
    };
  },
});
