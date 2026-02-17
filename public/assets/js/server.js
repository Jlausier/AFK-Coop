import express from "express";
import 'dotenv/config';
import { YelpAPI, GamesAPI } from "./API/index.js";
import { APIManager } from "./API/Manager.js";
import "./API/Categories.js";
import cors from "cors";

const app = express();

// Enable CORS for your frontend
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const yelp = new YelpAPI();
const games = new GamesAPI();

// Optional: run without API keys; search will return a friendly error
const hasApiKeys = !!(
  process.env.YELP_API_KEY &&
  process.env.IGDB_CLIENT_ID &&
  process.env.IGDB_CLIENT_SECRET
);

// API route
app.get("/api/businesses", async (req, res) => {
  const { game, location } = req.query;

  if (!game || !location) {
    return res.status(400).json({ message: "Missing game or location" });
  }

  if (!hasApiKeys) {
    return res.status(503).json({
      error: "Server is not configured with API keys",
      message: "Add YELP_API_KEY, IGDB_CLIENT_ID, and IGDB_CLIENT_SECRET to a .env file (see .env.example) and restart the server.",
    });
  }

  try {
    let yelpCategories;

    if (game === "categorySearch" && (req.query.genres || req.query.themes)) {
      // Genre search: use selected genre/theme IDs from the UI
      const genreIds = req.query.genres ? req.query.genres.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const themeIds = req.query.themes ? req.query.themes.split(",").map((s) => s.trim()).filter(Boolean) : [];
      yelpCategories = APIManager.mapGenreAndThemeIdsToYelpAliases(genreIds, themeIds);
    } else if (game && game !== "categorySearch") {
      // Game search: get genres/themes from IGDB, then map to Yelp aliases
      try {
        const gameData = await games.fetchGameGenresAndThemes([game]);
        if (gameData?.length > 0) {
          const toId = (x) => (typeof x === "object" && x != null && "id" in x ? String(x.id) : String(x));
          const genreIds = (gameData[0].genres || []).map(toId);
          const themeIds = (gameData[0].themes || []).map(toId);
          yelpCategories = APIManager.mapGenreAndThemeIdsToYelpAliases(genreIds, themeIds);
        }
      } catch (igdbErr) {
        console.warn("IGDB lookup failed, using default categories:", igdbErr.message);
      }
    }

    if (!yelpCategories?.length) {
      yelpCategories = ["arcades", "bars", "videogamestores"];
    }

    const yelpResponse = await yelp.fetchBusinessesByCategories(location, yelpCategories);
    // Yelp returns { businesses: [...], total, region }; frontend expects an array
    const businesses = Array.isArray(yelpResponse?.businesses) ? yelpResponse.businesses : [];

    res.json(businesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend (optional, if you serve index.html from Node)
app.use(express.static("public"));

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
