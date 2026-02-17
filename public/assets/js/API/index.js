// API/index.js
import fetch from "node-fetch";

/**
 * Base class for APIs
 */
class API {
  static proxy = "https://cors-anywhere.herokuapp.com/";
  client;

  constructor(name, baseUrl, useProxy, resources, headers = {}) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.useProxy = useProxy;
    this.resources = resources;
    this.headers = { accept: "application/json", ...headers };
  }

  setClient(client) {
    this.client = client;
    this.headers["Client-ID"] = this.client.id;
  }

  async refreshToken() {
    if (!this.client) throw new Error("Client not set for API");

    // Request new token from client URL
    const res = await fetch(this.client.url(), { method: this.client.method });
    const data = await res.json();
    this.headers.Authorization = `Bearer ${data.access_token}`;
    return this.headers.Authorization;
  }

  constructUrl(resource, params = []) {
    let url = this.useProxy ? API.proxy : "";
    url += this.baseUrl + resource;
    if (params.length > 0) {
      url += "?" + params.map((p) => `${p.name}=${encodeURIComponent(p.val)}`).join("&");
    }
    return url;
  }

  async getData(resource, subResource = "", subResourceParams = [], params = [], headerOptions = {}, body = null) {
    const url = this.constructUrl(resource, params);
    const headers = { ...this.headers, ...headerOptions };
    const method = body ? "POST" : "GET";
    const options = { method, headers };
    if (body) options.body = body;

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }
}

/**
 * Yelp API
 */
export class YelpAPI extends API {
  constructor() {
    super(
      "Yelp Fusion",
      "https://api.yelp.com/v3/",
      false,
      {
        businesses: {
          location: "businesses/",
          subResources: {
            searchByCategory: {
              method: "GET",
              specifyResource: () => "search",
              params: ["location", "term", "categories", "sort_by", "limit"],
            },
            searchById: {
              method: "GET",
              specifyResource: (id) => id,
              params: ["locale"],
            },
          },
        },
      },
      {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`, // OK in Node
      }
    );
  }

  async fetchBusinessesByCategories(location, categories) {
    const params = [
      { name: "location", val: location },
      ...categories.map((cat) => ({ name: "categories", val: cat })),
      { name: "sort_by", val: "best_match" },
      { name: "limit", val: "20" },
    ];
    return this.getData("businesses/search", "", [], params);
  }

  async fetchBusinessById(id) {
    return this.getData(`businesses/${encodeURIComponent(id)}`, "", [], []);
  }
}

/**
 * IGDB / Games API
 */
export class GamesAPI extends API {
  constructor() {
    super("IGDB", "https://api.igdb.com/v4/", false, { games: { method: "POST", location: "games/" } });
    this.setClient({
      method: "POST",
      url: () =>
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
      id: process.env.IGDB_CLIENT_ID,
      secret: process.env.IGDB_CLIENT_SECRET,
    });
  }

  async fetchGameGenresAndThemes(names, isExact = false) {
    await this.refreshToken();
    const joinedNames = names.map((n) => `"${n}"`).join(",");
    const body = `fields genres, themes, slug, keywords; where name = (${joinedNames});`;

    return this.getData("games", "", [], [], {}, body);
  }
}

/**
 * API Manager to combine APIs
 */
export class APIManager {
  constructor() {
    this.yelp = new YelpAPI();
    this.games = new GamesAPI();
  }

  async getBusinessesFromGames(location, games) {
    const genres = [];
    for (const game of games) {
      const data = await this.games.fetchGameGenresAndThemes([game]);
      if (data && data.length > 0 && data[0].genres) {
        genres.push(...data[0].genres.map((g) => g.name));
      }
    }
    return this.yelp.fetchBusinessesByCategories(location, genres);
  }
}
