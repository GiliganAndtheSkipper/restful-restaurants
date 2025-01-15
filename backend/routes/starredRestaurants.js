const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants stored in memory.
 * In a production application, this data would be stored in a persistent database.
 */
let STARRED_RESTAURANTS = [
    {
        id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
        restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
        comment: "Best pho in NYC",
    }
];

// Middleware to log every incoming request
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

/**
 * Get the complete list of starred restaurants.
 * The results are joined with the ALL_RESTAURANTS list to provide restaurant names.
 */
router.get("/", (req, res) => {
    const joinedStarredRestaurants = STARRED_RESTAURANTS.map((starredRestaurant) => {
        const restaurant = ALL_RESTAURANTS.find(
            (r) => r.id === starredRestaurant.restaurantId
        );
        return {
            id: starredRestaurant.id,
            comment: starredRestaurant.comment,
            name: restaurant ? restaurant.name : "Restaurant not found"
        };
    });
    res.json(joinedStarredRestaurants);
});

/**
 * Retrieve a specific starred restaurant by its unique ID.
 * If the restaurant exists, it will return the restaurant data along with its name.
 * If not, a 404 error is returned.
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const starredRestaurant = STARRED_RESTAURANTS.find((r) => r.id === id);

    if (!starredRestaurant) {
        return res.status(404).send("Starred restaurant not found.");
    }

    const restaurantInfo = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
    );

    const response = {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurantInfo ? restaurantInfo.name : "Restaurant not found"
    };

    res.json(response);
});

/**
 * Add a new starred restaurant to the list.
 * Requires a valid restaurantId and comment in the request body.
 * If the restaurantId is invalid or the comment is missing, an error response is returned.
 */
router.post("/", (req, res) => {
    const { restaurantId, comment } = req.body;

    if (!restaurantId || !comment) {
        return res.status(400).send("Both restaurantId and comment are required.");
    }

    const restaurantExists = ALL_RESTAURANTS.find(r => r.id === restaurantId);
    if (!restaurantExists) {
        return res.status(404).send("Restaurant not found in the main list.");
    }

    const newStarredRestaurant = {
        id: uuidv4(),
        restaurantId,
        comment
    };

    STARRED_RESTAURANTS.push(newStarredRestaurant);
    res.status(201).json(newStarredRestaurant);
});

/**
 * Delete a starred restaurant by its unique ID.
 * If the ID is invalid or doesn't exist, a 404 error is returned.
 */
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = STARRED_RESTAURANTS.length;

    STARRED_RESTAURANTS = STARRED_RESTAURANTS.filter((r) => r.id !== id);

    if (STARRED_RESTAURANTS.length === initialLength) {
        return res.status(404).send("Starred restaurant not found.");
    }

    res.status(200).send("Starred restaurant successfully deleted.");
});

/**
 * Update the comment for a specific starred restaurant.
 * Requires a comment field in the request body.
 * If the restaurant or comment is missing, an error response is returned.
 */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).send("A comment is required.");
    }

    const starredRestaurant = STARRED_RESTAURANTS.find(r => r.id === id);
    if (!starredRestaurant) {
        return res.status(404).send("Starred restaurant not found.");
    }

    starredRestaurant.comment = comment;
    res.status(200).send(`Comment updated for restaurant with id: ${id}`);
});

/**
 * Search restaurants by name using a query string.
 * Example: GET /starredRestaurants/search?name=taco
 * Returns a list of restaurants containing the search term in their name.
 */
router.get("/search", (req, res) => {
    const { name } = req.query;
    const results = ALL_RESTAURANTS.filter(restaurant =>
        restaurant.name.toLowerCase().includes(name.toLowerCase())
    );

    if (results.length === 0) {
        return res.status(404).send("No restaurants found.");
    }

    res.json(results);
});

/**
 * Return a random starred restaurant from the list.
 * If no starred restaurants exist, a 404 error is returned.
 */
router.get("/random", (req, res) => {
    if (STARRED_RESTAURANTS.length === 0) {
        return res.status(404).send("No starred restaurants available.");
    }
    const randomRestaurant = STARRED_RESTAURANTS[Math.floor(Math.random() * STARRED_RESTAURANTS.length)];
    res.json(randomRestaurant);
});

/**
 * Health check endpoint to verify if the server is running correctly.
 * Useful for monitoring and testing server availability.
 */
router.get("/health", (req, res) => {
    res.status(200).send("Server is healthy and running!");
});

module.exports = router;
