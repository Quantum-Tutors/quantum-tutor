// api-docs.js
const express = require('express');
const { swaggerUi, swaggerSpec } = require('./swagger');

const router = express.Router();

// Serve Swagger API documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
