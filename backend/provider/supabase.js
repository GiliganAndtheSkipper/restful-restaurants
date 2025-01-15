// backend/provider/supabase.js
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase using environment variables from the .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET;

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
