// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Express API Documentation', // API title
      version: '1.0.0', // API version
      description: 'API documentation for our Express app.', // Description
    },
    servers: [
      {
        url: 'http://localhost:3000', // Base URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the files containing annotations
};

const swaggerSpecs = swaggerJsdoc(options);

export default swaggerSpecs;
