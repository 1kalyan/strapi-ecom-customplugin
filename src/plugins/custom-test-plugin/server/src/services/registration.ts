// // server/src/services/registration.ts
// import { RegistrationResponse, UserRegistrationRequest } from '../types';
// import { validatePayload } from '../utils/validate';

// export default ({ strapi }) => ({
//   async register(payload: UserRegistrationRequest): Promise<RegistrationResponse> {
//     const { schema, data } = payload;

//     // 1. Validate
//     const errors = validatePayload(schema, data);
//     if (errors.length > 0) {
//       return { success: false, errors };
//     }

//     // 2. Normalize user data
//     const userData: Record<string, any> = {};

//     for (const field of schema.fields) {
//       if (data[field.name] !== undefined) {
//         userData[field.name] = data[field.name];
//       } else if (field.defaultValue !== undefined) {
//         userData[field.name] = field.defaultValue;
//       }
//     }

//     // 3. Extract auth fields
//     const email = schema.emailField ? data[schema.emailField] : undefined;
//     const password = schema.passwordField ? data[schema.passwordField] : undefined;
//     const username = schema.usernameField ? data[schema.usernameField] : undefined;

//     if (!email || !password) {
//       return {
//         success: false,
//         message: 'Email and password are required',
//       };
//     }

//     // 4. Unique check
//     const existingUser = await strapi
//       .query('plugin::users-permissions.user')
//       .findOne({ where: { email } });

//     if (existingUser) {
//       return {
//         success: false,
//         message: 'User already exists',
//       };
//     }

//     // 5. Create user
//     const user = await strapi
//       .plugin('users-permissions')
//       .service('user')
//       .add({
//         ...userData,
//         email,
//         username: username || email,
//         password,
//         confirmed: true,
//         role: 1, // or whatever role id you want
//       });

//     return {
//       success: true,
//       data: user,
//     };
//   },
// });
// server/src/services/registration.ts
// src/plugins/custom-test-plugin/server/src/services/registration.ts
import type { Core } from '@strapi/strapi';
import {
  RegistrationResponse,
  RegistrationSchema,
  UserRegistrationRequest,
  ValidationError,
} from '../types';
// server/services/registration.ts
import { validatePayload } from '../utils/validate';

type Strapi = Core.Strapi;

const registrationService = ({ strapi }: { strapi: Strapi }) => ({
  /**
   * Returns the "active" schema:
   * 1) from plugin content-type (form-schema) if stored
   * 2) otherwise from plugin config (config/index.ts → registrationSchema)
   */
  async getSchema(): Promise<RegistrationSchema> {
    const existing = await strapi.documents('plugin::custom-test-plugin.form-schema').findFirst();

    if (existing && (existing as any).schema) {
      return (existing as any).schema as RegistrationSchema;
    }

    const pluginConfig = strapi.config.get('plugin::custom-test-plugin', {}) as {
      registrationSchema?: RegistrationSchema;
    };

    if (pluginConfig.registrationSchema) {
      return pluginConfig.registrationSchema;
    }

    throw new Error('No registration schema configured');
  },

  /**
   * Called from admin UI to update the schema.
   * Stores JSON in plugin content-type (singleType).
   */
  async updateSchema(newSchema: RegistrationSchema): Promise<{ success: boolean }> {
    if (!newSchema.fields || !Array.isArray(newSchema.fields)) {
      throw new Error('Schema must have a fields array');
    }

    const existing = await strapi.documents('plugin::custom-test-plugin.form-schema').findFirst();

    if (existing) {
      await strapi.documents('plugin::custom-test-plugin.form-schema').update({
        documentId: (existing as any).documentId,
        data: {
          schema: newSchema,
        } as any,
      } as any);
    } else {
      await strapi.documents('plugin::custom-test-plugin.form-schema').create({
        data: {
          schema: newSchema,
        } as any,
      } as any);
    }

    return { success: true };
  },

  /**
   * Register endpoint:
   * - Uses schema from body if provided
   * - Otherwise falls back to active schema (DB or config)
   * - Creates a users-permissions user
   */
  async register(body: UserRegistrationRequest): Promise<RegistrationResponse> {
    try {
      strapi.log.info('registrationService.register body: ' + JSON.stringify(body));

      const data = body.data ?? {};

      // Prefer schema from body, else active schema
      let schema: RegistrationSchema | null = body.schema ?? null;
      if (!schema) {
        // same service instance – Strapi binds 'this' to the service
        schema = await this.getSchema();
      }

      // 1. Validate
      const errors: ValidationError[] = validatePayload(schema, data);
      if (errors.length > 0) {
        return {
          success: false,
          errors,
        };
      }

      // 2. Normalize user data (apply defaults)
      const userData: Record<string, any> = {};
      for (const field of schema.fields) {
        if (data[field.name] !== undefined) {
          userData[field.name] = data[field.name];
        } else if (field.defaultValue !== undefined) {
          userData[field.name] = field.defaultValue;
        }
      }

      // 3. Extract auth fields (fall back to defaults)
      const emailField = schema.emailField ?? 'email';
      const passwordField = schema.passwordField ?? 'password';
      const usernameField = schema.usernameField ?? 'username';

      const email = data[emailField];
      const password = data[passwordField];
      const username = data[usernameField] ?? email;

      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required',
        };
      }

      // 4. Unique email check
      const existingUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { email } });

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
        };
      }

      // 5. Default authenticated role
      const defaultRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' } });

      // 6. Create user
      const user = await strapi
        .plugin('users-permissions')
        .service('user')
        .add({
          ...userData,
          email,
          username,
          password,
          confirmed: true,
          role: defaultRole?.id,
        });

      return {
        success: true,
        data: user,
      };
    } catch (err: any) {
      strapi.log.error('Error in registrationService.register', err);

      // Surface as a failed result so controller can turn it into a 500
      return {
        success: false,
        message: 'Internal server error in registration service',
      };
    }
  },
});

export default registrationService;
