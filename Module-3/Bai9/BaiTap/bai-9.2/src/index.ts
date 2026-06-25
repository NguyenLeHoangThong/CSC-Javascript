import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// ── Bài 9.2: API documentation with Swagger UI ───────────────
// Focus: write an OpenAPI 3 spec object and serve interactive docs at /api-docs.

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

interface Item {
  id: number;
  name: string;
}
const items: Item[] = [{ id: 1, name: 'First item' }];
let nextId = 2;

// OpenAPI 3 spec describing the two endpoints below.
const swaggerSpec = {
  openapi: '3.0.3',
  info: { title: 'Items API', version: '1.0.0', description: 'Bài 9.2 — demo of Swagger UI docs' },
  servers: [{ url: '/' }],
  components: {
    schemas: {
      Item: {
        type: 'object',
        properties: { id: { type: 'integer', example: 1 }, name: { type: 'string', example: 'First item' } },
      },
      NewItem: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string', example: 'My item' } },
      },
    },
  },
  paths: {
    '/items': {
      get: {
        tags: ['Items'],
        summary: 'List all items',
        responses: {
          '200': {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Item' } } } },
          },
        },
      },
      post: {
        tags: ['Items'],
        summary: 'Create an item',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NewItem' } } },
        },
        responses: { '201': { description: 'Created' }, '400': { description: 'name is required' } },
      },
    },
  },
};

// Serve interactive docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/items', (req: Request, res: Response) => res.json(items));

app.post('/items', (req: Request, res: Response) => {
  const name = req.body?.name;
  if (!name) return res.status(400).json({ message: 'name is required' });
  const item: Item = { id: nextId++, name };
  items.push(item);
  res.status(201).json(item);
});

app.listen(PORT, () => {
  console.log(`📖 Bài 9.2 swagger running on http://localhost:${PORT}`);
  console.log(`   Docs: http://localhost:${PORT}/api-docs`);
});
