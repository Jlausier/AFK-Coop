import express from "express";
import 'dotenv/config';
import { YelpAPI, GamesAPI } from "./API/index.js";
import cors from "cors";

const app = express();

// Enable CORS for your frontend
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const yelp = new YelpAPI();
const games = new GamesAPI();

// API route
app.get("/api/businesses", async (req, res) => {
  const { game, location } = req.query;

  if (!game || !location) {
    return res.status(400).json({ message: "Missing game or location" });
  }

  try {
    // Fetch genres/themes for the game
    const gameData = await games.fetchGameGenresAndThemes([game]);
    const genres = gameData?.[0]?.genres?.map(g => g.name) || ["arcades", "bars"]; // fallback

    // Fetch businesses from Yelp using those categories
    const businesses = await yelp.fetchBusinessesByCategories(location, genres);

    res.json(businesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend (optional, if you serve index.html from Node)
app.use(express.static("public"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
