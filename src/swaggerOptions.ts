import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Text Justification API",
      version: "1.0.0",
      description: "API documentation for the Text Justification service.",
    },
    servers: [
      {
        url: "http://213.109.147.55:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Path to the API docs
  apis: [
    path.join(__dirname, "/routes/*.js"),
    path.join(__dirname, "/routes/*.ts"),
  ],
};

const swaggerSpec = swaggerJSDoc(options) as Record<string, unknown>;

export default swaggerSpec;
