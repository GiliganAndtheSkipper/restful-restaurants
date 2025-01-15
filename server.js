require("dotenv").config();  // Import dotenv at the top

const express = require("express");
const app = express();
const starredRestaurantsRouter = require("./backend/routes/starredRestaurants");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Middleware to parse incoming JSON data
app.use(express.json());

// Swagger UI setup for API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount the Starred Restaurants router
app.use("/starredRestaurants", starredRestaurantsRouter);

// Use PORT from .env or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📖 Swagger Docs available at http://localhost:${PORT}/api-docs`);
}).on("error", (err) => {
    console.error("❌ Failed to start server:", err);
});
