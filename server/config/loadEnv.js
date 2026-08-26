import dotenv from "dotenv";

// Centralized env loader to avoid multiple dotenv logs
dotenv.config({quiet: true}); // Load environment variables from .env file, suppressing logs
