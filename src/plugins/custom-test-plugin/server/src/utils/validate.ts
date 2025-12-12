// import { RegistrationSchema, ValidationError } from '../types';

// export function validatePayload(
//   schema: RegistrationSchema,
//   data: Record<string, any>
// ): ValidationError[] {
//   const errors: ValidationError[] = [];

//   for (const field of schema.fields) {
//     const value = data[field.name];

//     if (field.required && (value === undefined || value === null)) {
//       errors.push({
//         field: field.name,
//         message: 'Field is required',
//       });
//       continue;
//     }

//     if (value === undefined || value === null) continue;

//     switch (field.type) {
//       case 'string':
//       case 'password':
//       case 'email':
//       case 'phone':
//         if (typeof value !== 'string') {
//           errors.push({
//             field: field.name,
//             message: 'Must be a string',
//           });
//         }
//         break;

//       case 'number':
//         if (typeof value !== 'number') {
//           errors.push({
//             field: field.name,
//             message: 'Must be a number',
//           });
//         }
//         break;

//       case 'boolean':
//         if (typeof value !== 'boolean') {
//           errors.push({
//             field: field.name,
//             message: 'Must be boolean',
//           });
//         }
//         break;

//       case 'date':
//         if (isNaN(Date.parse(value))) {
//           errors.push({
//             field: field.name,
//             message: 'Invalid date format',
//           });
//         }
//         break;
//     }

//     if (typeof value === 'string') {
//       if (field.minLength && value.length < field.minLength) {
//         errors.push({
//           field: field.name,
//           message: `Min length is ${field.minLength}`,
//         });
//       }

//       if (field.maxLength && value.length > field.maxLength) {
//         errors.push({
//           field: field.name,
//           message: `Max length is ${field.maxLength}`,
//         });
//       }

//       if (field.pattern && !new RegExp(field.pattern).test(value)) {
//         errors.push({
//           field: field.name,
//           message: 'Pattern mismatch',
//         });
//       }
//     }
//   }

//   return errors;
// }
import { RegistrationSchema, ValidationError } from '../types';

export function validatePayload(
  schema: RegistrationSchema,
  data: Record<string, any>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of schema.fields) {
    const rawValue = data[field.name];

    // Apply default value if provided and value is missing
    const value =
      rawValue === undefined || rawValue === null ? (field.defaultValue ?? rawValue) : rawValue;

    const isRequired = !!field.required;

    // Treat empty string as missing for required fields
    const isMissing =
      value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

    if (isRequired && isMissing) {
      errors.push({
        field: field.name,
        message: 'Field is required',
      });
      continue;
    }

    // If value is still effectively "empty" and not required, skip other checks
    if (isMissing) {
      continue;
    }

    switch (field.type) {
      case 'string':
      case 'password':
      case 'email':
      case 'phone': {
        if (typeof value !== 'string') {
          errors.push({
            field: field.name,
            message: 'Must be a string',
          });
          break;
        }
        break;
      }

      case 'number': {
        // Accept numbers or numeric strings, but reject NaN
        const num = typeof value === 'number' ? value : Number((value as any).toString());

        if (Number.isNaN(num)) {
          errors.push({
            field: field.name,
            message: 'Must be a number',
          });
          break;
        }

        // Optional: you could normalize back to data[field.name] = num here
        // data[field.name] = num;
        break;
      }

      case 'boolean': {
        if (typeof value !== 'boolean') {
          errors.push({
            field: field.name,
            message: 'Must be boolean',
          });
        }
        break;
      }

      case 'date': {
        if (value instanceof Date) {
          if (Number.isNaN(value.getTime())) {
            errors.push({
              field: field.name,
              message: 'Invalid date',
            });
          }
        } else if (typeof value === 'string') {
          const timestamp = Date.parse(value);
          if (Number.isNaN(timestamp)) {
            errors.push({
              field: field.name,
              message: 'Invalid date format',
            });
          }
        } else {
          errors.push({
            field: field.name,
            message: 'Invalid date value',
          });
        }
        break;
      }
    }

    // Extra validation for string-like values (length + pattern)
    if (typeof value === 'string') {
      if (field.minLength != null && value.length < field.minLength) {
        errors.push({
          field: field.name,
          message: `Min length is ${field.minLength}`,
        });
      }

      if (field.maxLength != null && value.length > field.maxLength) {
        errors.push({
          field: field.name,
          message: `Max length is ${field.maxLength}`,
        });
      }

      if (field.pattern) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          errors.push({
            field: field.name,
            message: 'Pattern mismatch',
          });
        }
      }

      // Optional: extra email/phone-specific checks
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({
            field: field.name,
            message: 'Invalid email address',
          });
        }
      }
    }
  }

  return errors;
}
