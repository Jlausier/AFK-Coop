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
   * Gets the genres and themes for a list of games,
   *  gets the associated yelp categories,
   *  returns a list of businesses based on the categories
   *
   * @param  {Array<string>} names Names of the game(s) with usable genres and themes
   * @returns {Promise<Array<Object>>} Promise that returns businesses or throws an error
   */
  async getBusinessesFromGames(location, names) {
    return this.Games.fetchGameGenresAndThemes(names).then(async (data) => {
      // Reduces game data into the genres and themes
      let processedData = { genres: [], themes: [] };
      data.forEach((game) => {
        processedData.genres = processedData.genres.concat(game.genres);
        processedData.themes = processedData.themes.concat(game.themes);
      });

      // Sorts the genres and themes to group duplicates
      processedData.genres = processedData.genres.sort((a, b) => a - b);
      processedData.themes = processedData.themes.sort((a, b) => a - b);

      // Gets the associated categories
      let categoryIds = this.mapGenresAndThemesToCategories(processedData);
      let categories = categoryIds.map((id) => {
        if (id in APIManager.YelpCategories)
          return APIManager.YelpCategories[id].alias;
      });

      // Fetches businesses by the categories and returns both
      return await this.Yelp.fetchBusinessesByCategories(
        location,
        categories
      ).then((businesses) => {
        return {
          businesses,
          categories,
        };
      });
    });
  }

  /**
   * Maps IGDB genres and themes into a weighted, sorted,
   *  and cleaned array of Yelp categories
   *
   * @param {Object} data Data with game genres and themes arrays
   * @param {Array<string>} data.genres Array of game genres
   * @param {Array<string>} data.themes Array of game themes
   * @returns {Array<>}
   */
  mapGenresAndThemesToCategories(data) {
    let mappedData = {};

    // Extracts related Yelp categories from each genre
    data.genres.forEach((genre) => {
      if (!(genre in APIManager.GameCategories.Genres)) return;
      // Weights each category by frequency
      APIManager.GameCategories.Genres[genre].yelpCategories.forEach(
        (category) => {
          if (category in mappedData) mappedData[category] += 1;
          else mappedData[category] = 1;
        }
      );
    });

    // Extracts related Yelp categories from each theme
    data.themes.forEach((theme) => {
      if (!(theme in APIManager.GameCategories.Themes)) return;
      // Weights each category by frequency
      APIManager.GameCategories.Themes[theme].yelpCategories.forEach(
        (category) => {
          if (category in mappedData) mappedData[category] += 1;
          else mappedData[category] = 1;
        }
      );
    });

    // Sorts categories by frequency
    let sortable = [];
    for (let id in mappedData) sortable.push([id, mappedData[id]]);
    sortable.sort((a, b) => b[1] - a[1]);

    // Removes less frequent categories
    let index = 0;
    if (sortable.length > 10) {
      // Gets the total number of categories multiplied by their frequency
      let total = sortable.reduce((acc, curr) => acc + parseInt(curr[1]), 0);
      // Gets the index at which categories become less frequent
      let counter = 0;
      while (counter <= total * (2 / 3)) {
        counter += sortable[index][1];
        index++;
      }
    } else index = sortable.length;

    // Returns array of Yelp category IDs
    return sortable.slice(0, index).map((id) => id[0]);
  }
}
