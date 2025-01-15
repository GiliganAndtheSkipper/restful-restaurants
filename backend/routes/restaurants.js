const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const supabase = require("../provider/supabase"); // Import Supabase client

/**
 * Feature 1: Getting a list of restaurants from Supabase
 */
router.get("/", async (req, res) => {
    const { data, error } = await supabase.from("restaurants").select("*");
    if (error) {
        return res.status(500).send("Error fetching restaurants: " + error.message);
    }
    res.json(data);
});

/**
 * Feature 2: Getting a specific restaurant from Supabase
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", id)
        .single();  // Fetch a single record
    if (error || !data) {
        return res.status(404).send("Restaurant not found.");
    }
    res.json(data);
});

/**
 * Feature 3: Adding a new restaurant to Supabase
 */
router.post("/", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send("Restaurant name is required.");
    }

    const { data, error } = await supabase
        .from("restaurants")
        .insert([{ id: uuidv4(), name }]);

    if (error) {
        return res.status(500).send("Error adding restaurant: " + error.message);
    }
    res.status(201).json(data);
});

/**
 * Feature 4: Deleting a restaurant from Supabase
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", id);

    if (error) {
        return res.status(500).send("Error deleting restaurant: " + error.message);
    }

    if (data.length === 0) {
        return res.status(404).send("Restaurant not found.");
    }

    res.sendStatus(200);
});

/**
 * Feature 5: Updating the name of a restaurant in Supabase
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).send("New name is required.");
    }

    const { data, error } = await supabase
        .from("restaurants")
        .update({ name: newName })
        .eq("id", id);

    if (error) {
        return res.status(500).send("Error updating restaurant: " + error.message);
    }

    if (data.length === 0) {
        return res.status(404).send("Restaurant not found.");
    }

    res.status(200).send("Restaurant updated successfully.");
});

module.exports = router;
