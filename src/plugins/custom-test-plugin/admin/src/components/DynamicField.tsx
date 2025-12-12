// import { NumberInput, TextInput } from '@strapi/design-system';
// import React from 'react';

// export interface DynamicFieldProps {
//   field: {
//     name: string;
//     label?: string;
//     type: 'string' | 'number' | 'password' | 'email' | 'phone' | 'boolean' | 'date';
//   };
//   value: string | number | undefined;
//   onChange: (name: string, value: any) => void;
// }

// const DynamicField: React.FC<DynamicFieldProps> = ({
//   field,
//   value,
//   onChange,
// }) => {
//   switch (field.type) {
//     case 'string':
//       return (
//         <TextInput
//           label={field.label ?? field.name}
//           name={field.name} placeholder={field.name}
//           value={String(value ?? '')}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             onChange(field.name, e.target.value)
//           }
//         />
//       );
//     case 'password':
//       return (
//         <TextInput
//           label={field.label ?? field.name}
//           name={field.name} placeholder={field.name}
//           value={String(value ?? '')}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             onChange(field.name, e.target.value)
//           }
//         />
//       );
//     case 'email':
//       return (
//         <TextInput
//           label={field.label ?? field.name}
//           name={field.name} placeholder={field.name}
//           value={String(value ?? '')}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             onChange(field.name, e.target.value)
//           }
//         />
//       );
//     case 'number':
//       return (
//         <NumberInput
//           label={field.label ?? field.name}
//           name={field.name} placeholder={field.name}
//           value={value as number | undefined}
//           onValueChange={(val: number | undefined) =>
//             onChange(field.name, val)
//           }
//         />
//       );

//     default:
//       return null;
//   }
// };

// export default DynamicField;

import {
  Box,
  Checkbox,
  DatePicker, Field, NumberInput,
  TextInput
} from '@strapi/design-system';
import React from 'react';

export interface DynamicFieldProps {
  field: {
    name: string;
    label?: string;
    type: 'string' | 'number' | 'password' | 'email' | 'phone' | 'boolean' | 'date';
  };
  value: any;
  onChange: (name: string, value: any) => void;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange }) => {
  const label = field.label ?? field.name;
  console.log(label)
  return (
    <Box paddingBottom={4}>
      {/* STRING */}
      {field.type === 'string' && (
        <><Field.Label>{label}</Field.Label>
          <TextInput
            // label={label}


            name={field.name}
            placeholder={`Enter ${field.name}`}
            value={value ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(field.name, e.target.value)
            }
          />
        </>
      )}

      {/* PASSWORD */}
      {field.type === 'password' && (
        <>
          <Field.Label>{label}</Field.Label>
          <TextInput
            type="password"
            // label={label}
            name={field.name}
            placeholder={`Enter ${field.name}`}
            value={value ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(field.name, e.target.value)
            }
          />
        </>
      )}

      {/* EMAIL */}
      {field.type === 'email' && (
        <>         <Field.Label>{label}</Field.Label>

          <TextInput
            type="email"
            // label={label}
            name={field.name}
            placeholder={`Enter ${field.name}`}
            value={value ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(field.name, e.target.value)
            }
          />
        </>
      )}

      {/* PHONE / NUMBER */}
      {(field.type === 'number' || field.type === 'phone') && (
        <> <Field.Label>{label}</Field.Label>
          <NumberInput
            // label={label}
            name={field.name}
            placeholder={`Enter ${field.name}`}
            value={value ?? undefined}
            onValueChange={(val: number | undefined) => onChange(field.name, val)}
          />
        </>
      )}

      {/* BOOLEAN */}
      {field.type === 'boolean' && (
        <> <Field.Label>{label}</Field.Label>
          <Checkbox
            name={field.name}
            checked={Boolean(value)}
            onCheckedChange={(checked: boolean) => onChange(field.name, checked)}
          >
            {label}
          </Checkbox>
        </>
      )}

      {/* DATE */}
      {field.type === 'date' && (
        <> <Field.Label>{label}</Field.Label>
          <DatePicker
            // label={label}
            name={field.name}
            selectedDate={value ? new Date(value) : undefined}
            onChange={(date: Date | undefined) =>
              onChange(field.name, date ? date.toISOString() : null)
            }
          />
        </>
      )}
    </Box>
  );
};

export default DynamicField;