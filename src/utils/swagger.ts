import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Trading",
      version: "1.0.0",
      description: "Documentación de la API para gestionar portafolios, buscar activos y enviar órdenes al mercado.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
