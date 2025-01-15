const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const supabase = require("../provider/supabase"); // Import Supabase client

/**
 * Feature 1: Get all starred restaurants from Supabase
 */
router.get("/", async (req, res) => {
    const { data, error } = await supabase.from("starred_restaurants").select("*");
    if (error) {
        return res.status(500).send("Error fetching starred restaurants: " + error.message);
    }
    res.json(data);
});

/**
 * Feature 2: Get a specific starred restaurant by ID from Supabase
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from("starred_restaurants")
        .select("*")
        .eq("id", id)
        .single(); // Fetch a single record
    if (error || !data) {
        return res.status(404).send("Starred restaurant not found.");
    }
    res.json(data);
});

/**
 * Feature 3: Add a new starred restaurant to Supabase
 */
router.post("/", async (req, res) => {
    const { restaurantId, comment } = req.body;

    if (!restaurantId || !comment) {
        return res.status(400).send("Both restaurantId and comment are required.");
    }

    const { data, error } = await supabase
        .from("starred_restaurants")
        .insert([{ id: uuidv4(), restaurantId, comment }]);

    if (error) {
        return res.status(500).send("Error adding starred restaurant: " + error.message);
    }
    res.status(201).json(data);
});

/**
 * Feature 4: Delete a starred restaurant by ID from Supabase
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("starred_restaurants")
        .delete()
        .eq("id", id);

    if (error) {
        return res.status(500).send("Error deleting starred restaurant: " + error.message);
    }

    if (!data.length) {
        return res.status(404).send("Starred restaurant not found.");
    }

    res.status(200).send("Starred restaurant deleted successfully.");
});

/**
 * Feature 5: Update a comment for a starred restaurant in Supabase
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).send("A comment is required.");
    }

    const { data, error } = await supabase
        .from("starred_restaurants")
        .update({ comment })
        .eq("id", id);

    if (error) {
        return res.status(500).send("Error updating starred restaurant: " + error.message);
    }

    if (!data.length) {
        return res.status(404).send("Starred restaurant not found.");
    }

    res.status(200).send("Starred restaurant updated successfully.");
});

module.exports = router;
