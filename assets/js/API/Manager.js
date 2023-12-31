/**
 * Bridges data between the IGDB API and Yelp Fusion API
 */
class APIManager {
  /**
   * Instantiates a new APIManager and instantiates relevant APIs
   */
  constructor() {
    this.Yelp = new YelpAPI();
    this.Games = new GamesAPI();
    this.Games.refreshToken();
  }

  /**
   * Durstenfeld shuffle algorithm to randomize array elements
   * @param {Array<any>} array Array to be shuffled
   * @returns {Array<any>} Shuffled array
   */
  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Gets the genres and themes for a list of games, calls function to get businesses
   * @param  {Array<string>} names Names of the game(s) with usable genres and themes
   * @returns {Promise<Array<Object>>} Promise that returns businesses or throws an error
   */
  getBusinessesFromGames = async (location, names) => {
    return this.Games.fetchGameGenresAndThemes(names).then(async (data) => {
      if (data.length === 0)
        throw {
          title: "Game Not Found",
          message:
            "We were unable to find a game with that name, please check your spelling and try again.",
          details: `The game "${names[0]}" could not be found.`,
        };
      // Reduces game data into the genres and themes
      let processedData = { genres: [], themes: [] };

      let truncatedData = names.length === 1 ? data.slice(0, 1) : data;
      truncatedData.forEach((game) => {
        processedData.genres = processedData.genres.concat(game.genres);
        processedData.themes = processedData.themes.concat(game.themes);
      });

      return this.getBusinessesFromGameCategories(location, processedData);
    });
  };

  /**
   * Gets the Yelp categories from genres and themes,
   * @param {string} location
   * @param {Object} gameData Data with game genres and themes arrays
   * @param {Array<string>} gameData.genres Array of game genres
   * @param {Array<string>} gameData.themes Array of game themes
   * @returns Promise that returns businesses or throws an error
   */
  getBusinessesFromGameCategories = async (location, gameData) => {
    // Sorts the genres and themes to group duplicates
    let categories = this.mapGenresAndThemesToCategories({
      genres: gameData.genres.sort((a, b) => a - b),
      themes: gameData.themes.sort((a, b) => a - b),
    });

    // Check if any categories match
    if (categories.length === 0)
      throw {
        title: "No Categories Matched",
        message:
          "Your selections did not match with any known Yelp categories, please try again.",
      };

    // Fetches businesses by the categories and returns both
    return await this.Yelp.fetchBusinessesByCategories(
      location,
      categories
    ).catch((error) => {
      throw {
        title: "Unable to Search for Businesses",
        message:
          "An error occurred while searching for businesses, please try again.",
        details: error,
      };
    });
  };

  /**
   * Maps IGDB genres and themes into a weighted, sorted,
   *  and cleaned array of Yelp categories
   *
   * @param {Object} data Data with game genres and themes arrays
   * @param {Array<string>} data.genres Array of game genres
   * @param {Array<string>} data.themes Array of game themes
   * @returns {Array<>}
   */
  mapGenresAndThemesToCategories = (data) => {
    let mappedData = {};

    const weightCategories = (array, typeArray) => {
      array.forEach((obj) => {
        if (!(obj in typeArray)) return;
        typeArray[obj].yelpCategories.forEach(
          (category) =>
            (mappedData[category] =
              category in mappedData ? mappedData[category] + 1 : 1)
        );
      });
    };

    weightCategories(data.genres, APIManager.GameCategories.Genres);
    weightCategories(data.themes, APIManager.GameCategories.Themes);

    // Sorts categories by frequency
    let sortable = [];
    for (let id in mappedData) sortable.push([id, mappedData[id]]);
    sortable.sort((a, b) => b[1] - a[1]);

    // Removes less frequent categories
    let index = 0;
    if (sortable.length > 50) {
      // Gets the total weight of all categories
      let total = sortable.reduce((acc, curr) => acc + parseInt(curr[1]), 0);
      // Gets the index at which categories become less frequent
      let counter = 0;
      while (counter <= total * (2 / 3)) {
        counter += sortable[index][1];
        index++;
      }
    } else index = sortable.length;

    // Returns array of Yelp category IDs
    return sortable
      .slice(0, index)
      .map((id) => APIManager.YelpCategories[id[0]].alias);
  };

  /**
   * Creates a Google Maps link from an address
   * @param {Array<string>} displayAddress Array of address lines
   * @returns {string} Google Maps link
   */
  createGoogleMapsLink = (displayAddress) => {
    let baseUrl = "http://maps.google.com/?q=";
    displayAddress.forEach((line, index) => {
      let newLine = line.split(" ").join("%20");
      baseUrl += newLine;
      if (index < displayAddress.length - 1) baseUrl += ",";
    });
    return baseUrl;
  };
}
