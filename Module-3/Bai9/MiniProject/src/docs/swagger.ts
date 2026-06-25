// Minimal OpenAPI 3 spec for the School Management API.
// Served by swagger-ui-express at GET /api-docs so consumers get interactive docs.
// (Kept hand-written and compact so students can see the whole shape in one file.)

const bearerAuth = [{ bearerAuth: [] }];

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'School Management API',
    version: '5.0.0',
    description:
      'Production-ready REST API: JWT auth, RBAC + ownership, plus hardening (helmet, rate limiting, request logging).',
  },
  servers: [{ url: '/api/v1', description: 'API v1' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { success: { type: 'boolean', example: false }, message: { type: 'string' } },
      },
      Credentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@school.com' },
          password: { type: 'string', example: 'Admin@123456' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth' },
    { name: 'Classes' },
    { name: 'Students' },
    { name: 'Users' },
    { name: 'Stats' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new account',
        responses: { '201': { description: 'Created' }, '409': { description: 'Email exists' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive access + refresh tokens',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Credentials' } } },
        },
        responses: { '200': { description: 'OK' }, '401': { description: 'Invalid credentials' } },
      },
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: 'Current user', security: bearerAuth, responses: { '200': { description: 'OK' } } },
    },
    '/classes': {
      get: { tags: ['Classes'], summary: 'List classes (public)', responses: { '200': { description: 'OK' } } },
      post: {
        tags: ['Classes'],
        summary: 'Create class (admin only)',
        security: bearerAuth,
        responses: { '201': { description: 'Created' }, '403': { description: 'Forbidden' } },
      },
    },
    '/classes/{id}': {
      get: {
        tags: ['Classes'],
        summary: 'Class detail (public)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } },
      },
    },
    '/students': {
      get: { tags: ['Students'], summary: 'List students (public, filter + paginate)', responses: { '200': { description: 'OK' } } },
      post: {
        tags: ['Students'],
        summary: 'Create student (admin only)',
        security: bearerAuth,
        responses: { '201': { description: 'Created' }, '403': { description: 'Forbidden' } },
      },
    },
    '/users': {
      get: { tags: ['Users'], summary: 'List users (admin only)', security: bearerAuth, responses: { '200': { description: 'OK' } } },
    },
    '/stats': {
      get: { tags: ['Stats'], summary: 'Aggregate statistics', responses: { '200': { description: 'OK' } } },
    },
  },
};
