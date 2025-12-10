// import { Main } from '@strapi/design-system';
// import { useIntl } from 'react-intl';

// import { getTranslation } from '../utils/getTranslation';

// const HomePage = () => {
//   const { formatMessage } = useIntl();

//   return (
//     <Main>
//       <h1>Welcome to {formatMessage({ id: getTranslation('plugin.name') })}</h1>
//     </Main>
//   );
// };

// export { HomePage };
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { Box, Button, Main } from '@strapi/design-system';
import { useEffect, useState } from 'react';
import DynamicField from '../components/DynamicField';

interface FieldSchema {
  name: string;
  label?: string;
  type: 'string' | 'number';
}

interface Schema {
  title: string;
  fields: FieldSchema[];
}

const HomePage = () => {
  const { get, post } = useFetchClient();
  const [schema, setSchema] = useState<Schema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const onChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    if (!schema) return;

    await post('/custom-test-plugin/register', {
      schema,
      data: formData,
    });
  };

  useEffect(() => {
    async function fetchSchema() {
      const { data } = await get('/custom-test-plugin/schema');
      setSchema(data);
    }

    fetchSchema();
  }, [get]);

  if (!schema) {
    return <Main padding={4}>Loading…</Main>;
  }

  return (
    <Main padding={4}>
      <Box padding={4} background="neutral100">
        <h2>{schema.title}</h2>

        {schema.fields.map((field) => (
          <DynamicField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={onChange}
          />
        ))}

        <Box paddingTop={4}>
          <Button onClick={submit}>Save</Button>
        </Box>
      </Box>
    </Main>
  );
};

export default HomePage;

