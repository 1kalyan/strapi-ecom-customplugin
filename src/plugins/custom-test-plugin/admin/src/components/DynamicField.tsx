import { NumberInput, TextInput } from '@strapi/design-system';
import React from 'react';

export interface DynamicFieldProps {
  field: {
    name: string;
    label?: string;
    type: 'string' | 'number';
  };
  value: string | number | undefined;
  onChange: (name: string, value: any) => void;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  switch (field.type) {
    case 'string':
      return (
        <TextInput
          label={field.label ?? field.name}
          name={field.name}
          value={String(value ?? '')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(field.name, e.target.value)
          }
        />
      );

    case 'number':
      return (
        <NumberInput
          label={field.label ?? field.name}
          name={field.name}
          value={value as number | undefined}
          onValueChange={(val: number | undefined) =>
            onChange(field.name, val)
          }
        />
      );

    default:
      return null;
  }
};

export default DynamicField;
