import { RegistrationSchema, ValidationError } from '../types';

export function validatePayload(
  schema: RegistrationSchema,
  data: Record<string, any>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of schema.fields) {
    const value = data[field.name];

    if (field.required && (value === undefined || value === null)) {
      errors.push({
        field: field.name,
        message: 'Field is required',
      });
      continue;
    }

    if (value === undefined || value === null) continue;

    switch (field.type) {
      case 'string':
      case 'password':
      case 'email':
      case 'phone':
        if (typeof value !== 'string') {
          errors.push({
            field: field.name,
            message: 'Must be a string',
          });
        }
        break;

      case 'number':
        if (typeof value !== 'number') {
          errors.push({
            field: field.name,
            message: 'Must be a number',
          });
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({
            field: field.name,
            message: 'Must be boolean',
          });
        }
        break;

      case 'date':
        if (isNaN(Date.parse(value))) {
          errors.push({
            field: field.name,
            message: 'Invalid date format',
          });
        }
        break;
    }

    if (typeof value === 'string') {
      if (field.minLength && value.length < field.minLength) {
        errors.push({
          field: field.name,
          message: `Min length is ${field.minLength}`,
        });
      }

      if (field.maxLength && value.length > field.maxLength) {
        errors.push({
          field: field.name,
          message: `Max length is ${field.maxLength}`,
        });
      }

      if (field.pattern && !new RegExp(field.pattern).test(value)) {
        errors.push({
          field: field.name,
          message: 'Pattern mismatch',
        });
      }
    }
  }

  return errors;
}
