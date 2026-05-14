const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PDF Kitoblar Do'koni API",
      version: "1.0.0",
      description:
        "Node.js + Express + Prisma + Supabase asosida qurilgan PDF kitoblar do'koni backend API",
      contact: {
        name: "API Support",
        email: "support@pdfstore.uz",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development",
      },
      {
        url: "https://your-production-domain.com",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Login qilib olingan JWT tokenni kiriting",
        },
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Ali Valiyev" },
            email: { type: "string", format: "email", example: "ali@example.com" },
            password: { type: "string", minLength: 6, example: "secret123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "ali@example.com" },
            password: { type: "string", example: "secret123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Muvaffaqiyatli kirish." },
            data: {
              type: "object",
              properties: {
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        // ── User ──────────────────────────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "clxyz1234" },
            name: { type: "string", example: "Ali Valiyev" },
            email: { type: "string", example: "ali@example.com" },
            role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // ── Book ──────────────────────────────────────────────────────────────
        Book: {
          type: "object",
          properties: {
            id: { type: "string", example: "clxyz5678" },
            title: { type: "string", example: "Clean Code" },
            description: { type: "string", example: "Robert Martin tomonidan" },
            pdfUrl: { type: "string", format: "uri", example: "https://supabase.co/storage/..." },
            coverUrl: { type: "string", format: "uri", nullable: true },
            price: { type: "number", format: "float", example: 29.99 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BooksListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                books: { type: "array", items: { $ref: "#/components/schemas/Book" } },
                pagination: { $ref: "#/components/schemas/Pagination" },
              },
            },
          },
        },
        // ── Order ─────────────────────────────────────────────────────────────
        Order: {
          type: "object",
          properties: {
            id: { type: "string", example: "clxyz9012" },
            status: {
              type: "string",
              enum: ["PENDING", "PAID", "CANCELLED"],
              example: "PENDING",
            },
            userId: { type: "string" },
            bookId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        OrderWithRelations: {
          allOf: [
            { $ref: "#/components/schemas/Order" },
            {
              type: "object",
              properties: {
                book: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    coverUrl: { type: "string", nullable: true },
                    price: { type: "number" },
                  },
                },
              },
            },
          ],
        },
        // ── Shared ────────────────────────────────────────────────────────────
        Pagination: {
          type: "object",
          properties: {
            total: { type: "integer", example: 42 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            totalPages: { type: "integer", example: 5 },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Xato xabari" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Autentifikatsiya va foydalanuvchi" },
      { name: "Books", description: "Kitoblar CRUD" },
      { name: "Orders", description: "Buyurtmalar boshqaruvi" },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
