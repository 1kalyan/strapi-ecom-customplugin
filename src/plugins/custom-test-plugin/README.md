# custom-test-plugin

This plugin is used for generic way of user registration

# Custom Test Plugin - Generic User Registration

A flexible Strapi plugin that allows dynamic user registration based on custom schemas/interfaces.

## 🎯 Purpose

This plugin eliminates the need to modify your code every time you want to change user registration fields. Instead of hardcoding fields like `{name, email, password}`, you can define any interface dynamically and the plugin will handle registration accordingly.

## 📁 Folder Structure

```
src/plugins/custom-test-plugin/
├── server/
│   ├── src/
│   │   ├── content-types/
│   │   │   ├── registration-schema/
│   │   │   │   └── schema.json
│   │   │   ├── user-data/
│   │   │   │   └── schema.json
│   │   │   └── index.ts
│   │   ├── controllers/
│   │   │   ├── controller.ts
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── content-api.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── service.ts
│   │   │   ├── validator.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── tsconfig.json
├── admin/
│   └── src/
│       └── ... (admin panel files)
└── package.json
```

## 🚀 Installation

1. The plugin is already generated in your project at `src/plugins/custom-test-plugin`

2. Enable it in `config/plugins.ts`:

```typescript
export default {
  'custom-test-plugin': {
    enabled: true,
    resolve: './src/plugins/custom-test-plugin',
  },
};
```

3. Rebuild and restart Strapi:

```bash
npm run build
npm run develop
```

## 📖 Usage Examples

### Example 1: Simple Registration (Name, Email, Password)

**Define your schema:**

```json
{
  "collectionName": "simple-users",
  "emailField": "email",
  "passwordField": "password",
  "usernameField": "name",
  "fields": [
    {
      "name": "name",
      "type": "string",
      "required": true,
      "minLength": 3
    },
    {
      "name": "email",
      "type": "email",
      "required": true,
      "unique": true
    },
    {
      "name": "password",
      "type": "password",
      "required": true,
      "minLength": 6
    }
  ]
}
```

**Register a user:**

```bash
POST http://localhost:1337/custom-test-plugin/register
Content-Type: application/json

{
  "schema": {
    "collectionName": "simple-users",
    "emailField": "email",
    "passwordField": "password",
    "fields": [...]
  },
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123"
  }
}
```

### Example 2: Advanced Registration (Multiple Fields)

```json
{
  "collectionName": "advanced-users",
  "emailField": "email",
  "passwordField": "pass",
  "usernameField": "username",
  "fields": [
    {
      "name": "username",
      "type": "string",
      "required": true,
      "unique": true,
      "minLength": 4
    },
    {
      "name": "email",
      "type": "email",
      "required": true,
      "unique": true
    },
    {
      "name": "pass",
      "type": "password",
      "required": true,
      "minLength": 8
    },
    {
      "name": "phone",
      "type": "phone",
      "required": true,
      "unique": true
    },
    {
      "name": "age",
      "type": "number",
      "required": false
    },
    {
      "name": "isActive",
      "type": "boolean",
      "required": false
    }
  ]
}
```

**Register with this schema:**

```bash
POST http://localhost:1337/custom-test-plugin/register

{
  "schema": {...},
  "data": {
    "username": "johndoe",
    "email": "john@example.com",
    "pass": "securepass123",
    "phone": "+1234567890",
    "age": 25,
    "isActive": true
  }
}
```

### Example 3: Minimal Registration (Email & Password Only)

```json
{
  "collectionName": "minimal-users",
  "emailField": "email",
  "passwordField": "password",
  "fields": [
    {
      "name": "email",
      "type": "email",
      "required": true,
      "unique": true
    },
    {
      "name": "password",
      "type": "password",
      "required": true,
      "minLength": 6
    }
  ]
}
```

## 🔌 API Endpoints

### 1. Register User

- **URL:** `POST /custom-test-plugin/register`
- **Body:** `{ schema: {...}, data: {...} }`
- **Response:** `{ success: true, data: {...}, message: "..." }`

### 2. Get All Schemas

- **URL:** `GET /custom-test-plugin/schemas`
- **Response:** `{ success: true, data: [...] }`

### 3. Save Schema

- **URL:** `POST /custom-test-plugin/schemas`
- **Body:** `{ collectionName: "...", fields: [...] }`
- **Response:** `{ success: true, data: {...} }`

### 4. Test Endpoint

- **URL:** `GET /custom-test-plugin/test`
- **Response:** Example schema and usage

## 🎨 Field Types

| Type       | Description       | Validation                    |
| ---------- | ----------------- | ----------------------------- |
| `string`   | Text field        | minLength, maxLength, pattern |
| `email`    | Email address     | Email format validation       |
| `password` | Password (hashed) | minLength validation          |
| `phone`    | Phone number      | Phone format validation       |
| `number`   | Numeric value     | Type validation               |
| `boolean`  | True/False        | Type validation               |
| `date`     | Date value        | Date format validation        |

## ⚙️ Field Properties

- `name` (required): Field name
- `type` (required): Field type
- `required` (required): Is field mandatory?
- `unique` (optional): Must value be unique?
- `minLength` (optional): Minimum length
- `maxLength` (optional): Maximum length
- `pattern` (optional): Regex pattern
- `defaultValue` (optional): Default value

## 🧪 Testing

Use the test endpoint to see example usage:

```bash
GET http://localhost:1337/custom-test-plugin/test
```

## 🔒 Security Features

- Automatic password hashing
- Field validation before storage
- Unique constraint checking
- Type validation
- Email format validation
- Phone number validation

## 🐛 Error Handling

The plugin returns detailed error messages:

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "email already exists"
    }
  ],
  "message": "Validation failed"
}
```

## 📝 Notes

- Password fields are automatically hashed before storage
- Unique fields are checked before insertion
- All validations run before database operations
- Schemas can be saved and reused
- Each collection can have its own registration schema

## 🎯 Benefits

✅ No need to modify code for different registration requirements  
✅ Dynamic field validation  
✅ Reusable schemas  
✅ Type-safe with TypeScript  
✅ Automatic password hashing  
✅ Unique constraint validation  
✅ Flexible and extensible

## 📚 Next Steps

1. Create custom admin UI for schema management
2. Add authentication token generation
3. Implement email verification
4. Add role-based registration
5. Create migration tools for existing users

## 👨‍💻 Author

**Kalyan Bhattarai**  
Email: bhabishwor70@gmail.com  
GitHub: https://github.com/1kalyan

## 📄 License

MIT
