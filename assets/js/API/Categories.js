/**
 * Game genres and themes keyed by IGDB ID
 *  - title: User friendly name
 *  - yelpCategories: Yelp categories that the genre or theme maps onto
 */
APIManager.GameCategories = {
  Genres: {
    5: { title: "Shooter", yelpCategories: [1, 21, 30, 40, 48, 77] },
    8: { title: "Platform", yelpCategories: [2, 4, 17, 19, 39, 41, 43, 74] },
    10: {
      title: "Racing",
      yelpCategories: [
        5, 10, 11, 28, 36, 42, 52, 53, 54, 55, 58, 60, 61, 62, 73,
      ],
    },
    12: {
      title: "Role-playing (RPG)",
      yelpCategories: [3, 6, 16, 33, 34, 35, 43, 44, 53, 55, 63, 65, 69, 71],
    },
    14: {
      title: "Sport",
      yelpCategories: [
        7, 8, 9, 13, 15, 18, 22, 26, 29, 33, 36, 38, 41, 42, 56, 60, 61, 64, 67,
        68, 75, 81,
      ],
    },
    31: {
      title: "Adventure",
      yelpCategories: [
        1, 3, 5, 6, 10, 11, 14, 15, 16, 17, 18, 21, 23, 25, 26, 27, 31, 33, 34,
        35, 36, 38, 42, 44, 49, 50, 51, 53, 55, 56, 57, 58, 60, 62, 63, 67, 68,
        71, 72, 73, 76, 79, 80, 81,
      ],
    },
    33: { title: "Arcade", yelpCategories: [2, 4, 17, 19, 39, 41, 43, 74] },
  },
  Themes: {
    19: { title: "Horror", yelpCategories: [16, 25, 32, 43, 59, 66, 71] },
    44: {
      title: "Romance",
      yelpCategories: [
        4, 12, 20, 24, 33, 34, 35, 37, 43, 44, 45, 46, 47, 51, 59, 60, 70, 78,
      ],
    },
  },
};

/**
 * Extracts the ids and titles from genres and themes
 * @returns {Object} Genres and themes arrays with ids and titles
 */
APIManager.getGameCategories = function () {
  function getCategoriesObject(obj) {
    return Object.keys(obj).map((id) => {
      return { id, title: obj[id].title };
    });
  }
  return {
    genres: getCategoriesObject(APIManager.GameCategories.Genres),
    themes: getCategoriesObject(APIManager.GameCategories.Themes),
  };
};

/**
 * Yelp categories keyed by local ID
 *  - title: User friendly name
 *  - alias: URL friendly name
 */
APIManager.YelpCategories = {
  0: { title: "Airsoft (airsoft, All)", alias: "airsoft" },
  1: { title: "Amusement Parks", alias: "amusementparks" },
  2: { title: "Arcades", alias: "arcades" },
  3: { title: "Archery", alias: "archery" },
  4: { title: "Art Galleries", alias: "galleries" },
  5: { title: "ATV Rentals/Tours", alias: "atvrentals" },
  6: { title: "Axe Throwing", alias: "axethrowing" },
  7: { title: "Basketball Courts", alias: "basketballcourts" },
  8: { title: "Batting Cages", alias: "battingcages" },
  9: { title: "Beach Volleyball", alias: "beachvolleyball" },
  10: { title: "Bicycle Paths", alias: "bicyclepaths" },
  11: { title: "Bike Rentals", alias: "bikerentals" },
  12: { title: "Botanical Gardens", alias: "gardens" },
  13: { title: "Bowling", alias: "bowling" },
  14: { title: "Bungee Jumping", alias: "bungeejumping" },
  15: { title: "Canyoneering", alias: "canyoneering" },
  16: { title: "Castles", alias: "castles" },
  17: { title: "Challenge Courses", alias: "challengecourses" },
  18: { title: "Climbing", alias: "climbing" },
  19: { title: "Comic Books", alias: "comicbooks" },
  20: { title: "Dance Studios", alias: "dancestudio" },
  21: { title: "Dart Arenas", alias: "dartarenas" },
  22: { title: "Disc Golf", alias: "discgolf" },
  23: { title: "Diving", alias: "diving" },
  24: { title: "Drive-In Theater", alias: "driveintheater" },
  25: { title: "Escape Games (escapegames, All)", alias: "escapegames" },
  26: { title: "Flyboarding", alias: "flyboarding" },
  27: { title: "Gliding", alias: "gliding" },
  28: { title: "Go Karts", alias: "gokarts" },
  29: { title: "Golf", alias: "golf" },
  30: { title: "Gun/Rifle Ranges", alias: "gun_ranges" },
  31: { title: "Hang Gliding", alias: "hanggliding" },
  32: { title: "Haunted Houses", alias: "hauntedhouses" },
  33: { title: "Hiking", alias: "hiking" },
  34: { title: "Hot Air Balloons", alias: "hot_air_balloons" },
  35: { title: "Hot Springs", alias: "hotsprings" },
  36: { title: "Jet Skis", alias: "jetskis" },
  37: { title: "Karaoke", alias: "karaoke" },
  38: { title: "Kiteboarding", alias: "kiteboarding" },
  39: { title: "LAN Centers", alias: "lancenters" },
  40: { title: "Laser Tag", alias: "lasertag" },
  41: { title: "Mini Golf", alias: "mini_golf" },
  42: { title: "Mountain Biking", alias: "mountainbiking" },
  43: { title: "Museums", alias: "museums" },
  44: { title: "Observatories", alias: "observatories" },
  45: { title: "Opera & Ballet", alias: "opera" },
  46: { title: "Outdoor Movies", alias: "outdoormovies" },
  47: { title: "Paint & Sip", alias: "paintandsip" },
  48: { title: "Paintball", alias: "paintball" },
  49: { title: "Paragliding", alias: "paragliding" },
  50: { title: "Parasailing", alias: "parasailing" },
  51: { title: "Planetarium", alias: "planetarium" },
  52: { title: "Race Tracks", alias: "racetracks" },
  53: { title: "Races & Competitions", alias: "races" },
  54: { title: "Racing Experience", alias: "racingexperience" },
  55: { title: "Rafting/Kayaking", alias: "rafting" },
  56: { title: "Rock Climbing", alias: "rock_climbing" },
  57: { title: "Rodeo", alias: "rodeo" },
  58: { title: "Scooter Rentals", alias: "scooterrentals" },
  59: { title: "Silent Disco", alias: "silentdisco" },
  60: { title: "Skating Rinks", alias: "skatingrinks" },
  61: { title: "Skiing", alias: "skiing" },
  62: { title: "Skydiving", alias: "skydiving" },
  63: { title: "Snorkeling", alias: "snorkeling" },
  64: { title: "Soccer", alias: "football" },
  65: { title: "Speakeasies", alias: "speakeasies" },
  66: { title: "Supernatural Readings", alias: "psychic_astrology" },
  67: { title: "Surfing", alias: "surfing" },
  68: { title: "Swimming Pools", alias: "swimmingpools" },
  69: { title: "Tabletop Games", alias: "tabletopgames" },
  70: { title: "Tasting Classes", alias: "tastingclasses" },
  71: { title: "Tattoo", alias: "tattoo" },
  72: { title: "Trampoline Parks", alias: "trampoline" },
  73: { title: "Tubing", alias: "tubing" },
  74: {
    title: "Virtual Reality Centers",
    alias: "virtualrealitycenters",
  },
  75: { title: "Volleyball", alias: "volleyball" },
  76: { title: "Water Parks", alias: "waterparks" },
  77: { title: "Wildlife Hunting Ranges", alias: "wildlifehunting" },
  78: { title: "Wineries", alias: "wineries" },
  79: { title: "Ziplining", alias: "zipline" },
  80: { title: "Zoos", alias: "zoos" },
  81: { title: "Zorbing", alias: "zorbing" },
};
