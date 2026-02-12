/**
 * Static client validation errors
 */
const clientErrors = {
  gameAndLocation: {
    title: "Enter a Game and Location",
    message: "Please enter the name of a game and a location to proceed.",
  },
  game: {
    title: "Enter a Game",
    message: "Please enter the name of a game to proceed.",
  },
  categoryAndLocation: {
    title: "Select a Category and Enter a Location",
    message:
      "Please select one of the categories above and enter a location to proceed.",
  },
  category: {
    title: "Select a Category",
    message: "Please select one of the categories above to proceed.",
  },
  location: {
    title: "Enter a Location",
    message: "Please enter a location to proceed.",
  },
  noFavorites: {
    title: "No Favorites",
    message:
      "You haven't favorited any businesses yet, click the heart icon to save a business to your favorites.",
  },
};

// Global API Manager
import { APIManager } from "./API/Manager.js";
let Manager = new APIManager();

$(() => {
  /* ===== SELECTORS ============================================================== */

  let gameLabelEl = $("#game-label");
  let gameSearchEl = $("#game-search");
  let genreGrid = $("#genre-grid");

  let resultsContainer = $("#results-container");

  let recentSearchButton = $("#reveal-recent-btn");
  let recentSearchesEl = $("#recently-searched");

  $("#afk").on("click", () => location.reload());

  /* ===== GLOBAL STATE =========================================================== */

  let open = false;
  let searchType = "game";
  let isDisplayingFavorites = false;

  let selectedCategories = {
    genres: [],
    themes: [],
  };

  /* ===== API CALLS ============================================================== */

  /**
   * Checks if inputs are valid and gets the calls getBusinesses
   * @returns {null} Return if conditons for search are not met
   */
  function getBusinessesFromForm(e) {
    e.stopPropagation();
    let locationName = $("#location-search").val().trim();
    if (searchType === "game") {
      validateBusinessesByGame(locationName);
    } else if (searchType === "genres") {
      validateBusinessesByGameCategories(locationName);
    }
  }

  /**
   * Displays result cards or shows an error modal
   * @param {Promise<Object>} promise API call
   * @param {function} saveFunction Saves search
   * @param {Array<any>} saveFunctionArgs Arguments for saveFunction
   */
  const handleResponse = (
    promise,
    saveFunction = () => {},
    saveFunctionArgs = []
  ) => {
    promise
      .then((businesses) => {
        isDisplayingFavorites = false;
        saveFunction(...saveFunctionArgs);
        displayCards(businesses);
      })
      .catch((error) => {
        showErrorModal(error);
      });
  };

  /**
   * Validates location and game name inputs
   * @param {string} locationName
   * @returns {null} Exits function if inputs are invalid
   */
  function validateBusinessesByGame(locationName) {
    // Get game name input
    let gameName = gameSearchEl.val().trim();
    // Check input validity
    if (gameName === "" && locationName === "")
      return showErrorModal(clientErrors.gameAndLocation);
    else if (gameName === "") return showErrorModal(clientErrors.game);
    else if (locationName === "") return showErrorModal(clientErrors.location);
    // Fetch businesses
    getBusinessesByGame(locationName, gameName);
  }

  /**
   * Fetches businesses data based on a game's categories
   * @param {string} locationName Geographic area to search for businesses
   * @param {string} gameName Name of the game to search with
   */
  function getBusinessesByGame(locationName, gameName) {
    handleResponse(
      Manager.getBusinessesFromGames(locationName, [gameName]),
      saveSearches,
      [locationName, gameName]
    );
  }

  /**
   * Validates location and game category inputs
   * @param {string} locationName
   * @returns {null} Exits function if inputs are invalid
   */
  function validateBusinessesByGameCategories(locationName) {
    // Compute categories' validity
    let categoriesEmpty =
      selectedCategories.genres.length === 0 &&
      selectedCategories.themes.length === 0;
    // Check input validity
    if (categoriesEmpty && locationName === "")
      return showErrorModal(clientErrors.categoryAndLocation);
    else if (categoriesEmpty) return showErrorModal(clientErrors.category);
    else if (locationName === "") return showErrorModal(clientErrors.location);
    // Fetch businesses
    getBusinessesByGameCategories(locationName);
  }

  /**
   * Validates location and selected categories inputs, fetches businesses data
   * @param {string} locationName Geographic area to search for businesses

   */
  function getBusinessesByGameCategories(locationName) {
    handleResponse(
      Manager.getBusinessesFromGameCategories(locationName, selectedCategories)
    );
  }

  /* ===== DISPLAY RESULTS ======================================================== */

  /**
   * Displays list of business cards in results list
   * @param {Array<Object>} businesses Business objects from Yelp
   */
  function displayCards(businesses) {
    resultsContainer.empty();

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    businesses.forEach((business) => {
      // GENERATE DISPLAY CARD ELEMENTS

      let dispCardCont = $("<div>");
      let dispCardImg = $("<img>");

      let dispCardDetailContainer = $("<div>");
      let dispCardName = $("<h3>");

      let dispCardStats = $("<div>");

      let ratingCont = $("<div>");
      let ratingNumb = $("<div>");
      let ratingStars = $("<div>");

      let infoCont = $("<div>");
      let tags = $("<div>");
      let address = $("<div>");
      let phone = $("<div>");

      let dispCardBtnCont = $("<div>");
      let dispCardMapBtn = $("<a>");
      let dispCardUrlBtn = $("<a>");
      let dispCardFavBtn = $("<button>");

      // ADD DISPLAY CARD CLASSES

      dispCardCont.addClass(
        " mb-28 md:mb-14 lg:mb-10 xl:justify-start flex justify-center items-center flex-wrap md:items-start md:flex-nowrap"
      );
      dispCardImg.addClass(
        "w-64 md:w-48 2xl:max-w-1/3 aspect-square object-cover rounded"
      );

      dispCardDetailContainer.addClass(
        "pl-5 pt-3 lg:pt-0 2xl:max-w-2/3 flex flex-col items-center md:items-start"
      );
      dispCardName.addClass(
        " mb-2 text-slate-200 font-sans text-center md:text-left text-3xl font-bold"
      );

      dispCardStats.addClass(" p-2 flex");

      ratingCont.addClass(
        " px-2 h-24 2xl:h-20 rounded bg-gray-900/75 flex flex-col justify-center items-center"
      );
      ratingNumb.addClass("text-2xl");
      ratingStars.addClass("text-sm tracking-wide");

      infoCont.addClass(
        " w-full ml-2 pl-2 text-sm md:text-base lg:text-sm text-slate-300 "
      );

      tags.addClass("mb-2 text-xs font-bold");
      address.addClass("px-2");
      phone.addClass("px-2");

      dispCardBtnCont.addClass("mt-2 flex items-center");
      dispCardMapBtn.addClass(
        " mr-3 px-3 py-1 rounded-full bg-gray-900/50 text-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-green-500 hover:text-white transition ease-in-out"
      );
      dispCardUrlBtn.addClass(
        " mr-3 px-3 py-1 rounded-full bg-gray-900/50 text-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-green-500 hover:text-white transition ease-in-out"
      );
      dispCardFavBtn.addClass("material-symbols-outlined");

      // CONNECT DISPLAY CARD WITH API DATA

      dispCardImg.attr("src", business.image_url);
      dispCardName.text(business.name);

      ratingNumb.text(business.rating);
      ratingStars.text("STARS");

      for (let i = 0; i < business.categories.length; i++) {
        let tagName = $("<a>");
        tagName.addClass("pr-2");
        let categoryNumber = business.categories[i].title;
        tagName.text(categoryNumber);
        tagName.addClass("py-1 px-2 mr-2  border-slate-300 rounded-full");
        tags.append(tagName);
      }

      address.text(business.location.display_address.join(", "));
      phone.text(business.display_phone);

      dispCardMapBtn.text("Directions");
      dispCardMapBtn.attr(
        "href",
        Manager.createGoogleMapsLink(business.location.display_address)
      );
      dispCardMapBtn.attr("target", "_blank");

      dispCardUrlBtn.text("Yelp Page");
      dispCardUrlBtn.attr("href", business.url);
      dispCardUrlBtn.attr("target", "_blank");

      // Create favorites button
      dispCardFavBtn.text("favorite");
      dispCardFavBtn.addClass("fav-btn");
      // Set the current favorite state
      dispCardFavBtn.attr(
        "data-state",
        favorites.some((fav) => fav.id === business.id) ? "active" : ""
      );
      dispCardFavBtn.on("click", () => {
        // Toggle the favorites state
        dispCardFavBtn.attr(
          "data-state",
          dispCardFavBtn.attr("data-state") == "active" ? "" : "active"
        );
        // Add or remove from localStorage
        saveFavorite(business);
      });

      // INSERT DISPLAY CARD INTO CONTAINER

      dispCardBtnCont.append(dispCardMapBtn, dispCardUrlBtn, dispCardFavBtn);

      ratingCont.append(ratingNumb, ratingStars);

      infoCont.append(tags, address, phone);

      dispCardStats.append(ratingCont, infoCont);

      dispCardDetailContainer.append(
        dispCardName,
        dispCardStats,
        dispCardBtnCont
      );

      dispCardCont.append(dispCardImg, dispCardDetailContainer);

      resultsContainer.append(dispCardCont);
    });

    reformat();
  }

  /**
   * Reformats containers after search
   */
  function reformat() {
    let searchContainer = $("#search-container");

    searchContainer.removeClass("w-full lg:w-2/5 flex flex-col justify-center");
    resultsContainer.removeClass("w-3/5 flex justify-center items-center");

    searchContainer.addClass("w-full lg:w-2/5 2xl:w1/2 flex flex-col");
    resultsContainer.addClass(
      "w-full lg:w-3/5 lg:ml-10 2xl:w-1/2 lg:h-[40rem] xl:h-[50rem] overflow-y-scroll flex flex-col justify-start items-start"
    );

    $("tag-line").hide();
    $("sub-tag-line").hide();
  }

  $("#search-btn").on("click", getBusinessesFromForm);

  /* ===== MODALS ================================================================= */

  /**
   * Hide a generic modal
   */
  function hideModal() {
    $("body").off("click.modal");
    let modal = $("#modal-overlay");
    modal.removeClass("modal-open");
    setTimeout(function () {
      modal.hide();
      $(".modal-content").hide();
    }, 200);
  }

  // Close error modal
  $("#error-modal-close").on("click", hideModal);

  /**
   * Show a generic modal
   */
  function showModal() {
    $("#modal-overlay").show().addClass("modal-open");
    $("body").on("click.modal", function (event) {
      if (event.target.id === "modal-overlay") hideModal();
    });
  }

  /**
   * Show an error modal
   * @param {string} title Title of the error
   * @param {string} message Longer error message
   */
  function showErrorModal({ title, message }) {
    $("#error-modal-title").text(title);
    $("#error-modal-message").text(message);
    $("#error-modal").show();
    showModal();
  }

  /**
   * Show the contact modal
   */
  $("#contact-btn").on("click", (e) => {
    e.stopPropagation();
    $("#contact-modal").show();
    showModal();
  });

  /* ===== FAVORITES ================================================================= */

  /**
   * Saves or removes a favorite business into local storage
   * @param {Object} business Full business object to save
   */
  function saveFavorite(business) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let index = favorites.findIndex((fav) => fav.id === business.id);
    if (index === -1) favorites.unshift(business);
    else favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    if (isDisplayingFavorites && index !== -1) displayFavorites();
  }

  /**
   * Displays favorites cards in results container
   */
  function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (isDisplayingFavorites || favorites.length !== 0) {
      isDisplayingFavorites = true;
      displayCards(favorites);
    } else if (!isDisplayingFavorites && favorites.length === 0) {
      showErrorModal(clientErrors.noFavorites);
    }
  }

  // Displays favorites when button in header is clicked
  $("#favorites-btn").on("click", displayFavorites);

  /* ===== TOGGLE INPUT TYPE =========================================================== */

  /**
   * Hides other inputs and shows the new input
   * @returns {null} Exit if already showing selected input
   */
  function switchInputType(type) {
    if (searchType === type) return;
    searchType = type;

    if (type === "game") {
      gameLabelEl.text("Enter Your Favorite Game");
      genreGrid.hide();
      gameSearchEl.show();
    } else if (type === "genres") {
      gameLabelEl.text("Select Your Favorite Genres");
      gameSearchEl.hide();
      genreGrid.show();
    }

    resetForm();
  }

  // Toggle genres on click
  $("#toggle").on("click", () => {
    switchInputType("genres");
  });

  // Toggle game input on click
  $("#toggle-back").on("click", () => {
    switchInputType("game");
  });

  //

  $(".genre-btn").on("click", function () {
    let state = $(this).attr("data-state");
    let type = $(this).attr("data-type");
    let id = $(this).attr("id");

    if (state == "active") {
      $(this).removeClass("ring ring-pink-500");
      selectedCategories[type] = selectedCategories[type].filter(
        (a) => a !== id
      );
    } else {
      $(this).addClass("ring ring-pink-500");
      selectedCategories[type].push(id);
    }

    $(this).attr("data-state", state == "active" ? "" : "active");
  });

  /**
   * Clears inputs on toggle
   */
  function resetForm() {
    gameSearchEl.val("");
    selectedCategories = { genres: [], themes: [] };
  }

  /* ===== SEARCH HISTORY =========================================================== */

  // Retain data from local storage
  const readSearchesFromStorage = () =>
    JSON.parse(localStorage.getItem("search-history")) || [];

  // Display data from local storage

  function printSearchHistory() {
    // Clear current list of searches on page
    recentSearchesEl.empty(); //
    let searches = readSearchesFromStorage();

    // Add each recent search to a list
    searches.forEach((searchedItem) => {
      recentSearchesEl.append(
        $(
          `<p class="saved-search pb-2 cursor-pointer text-white/50 hover:text-white/75 transition" style="list-style-type: none;">${
            searchedItem.game + " in " + searchedItem.location
          }</p>`
        ).on("click", function () {
          getBusinessesByGame(searchedItem.location, searchedItem.game);
        })
      );
    });
  }

  /**
   *
   * @param {string} searchLocation Name of the search location
   * @param {string} searchGameName Name of the game
   */
  function saveSearches(searchLocation, searchGameName) {
    // Get the old searches from local storage
    let searchHistory = readSearchesFromStorage();

    // Find the index of the new search item
    let index = searchHistory.findIndex(
      (search) =>
        search.game === searchGameName && search.location === searchLocation
    );

    // If it's already the most recent search no change is necessary
    if (index !== 0) {
      // Remove new search item if it already existed
      if (index !== -1) searchHistory.splice(index, 1);
      // Add new search item to the beginning
      searchHistory.unshift({
        game: searchGameName,
        location: searchLocation,
      });
      // Remove excess search items
      if (searchHistory.length > 3) searchHistory.pop();
      // Add the search history back into local storage
      localStorage.setItem("search-history", JSON.stringify(searchHistory));
      printSearchHistory();
    }
  }

  /**
   * Toggles recent searches box
   */
  function toggleRecentSearch() {
    let arrow = $("#toggle-arrow");
    if (!open) {
      arrow.text("arrow_drop_up");
      recentSearchesEl.slideDown("slow");
      setTimeout(function () {
        recentSearchButton.removeClass("rounded-b-lg");
      }, 50);
      open = true;
    } else {
      arrow.text("arrow_drop_down");
      recentSearchesEl.slideUp("slow");
      setTimeout(function () {
        recentSearchButton.addClass("rounded-b-lg");
      }, 575);
      open = false;
    }
  }
  // Toggles recent searches on click
  recentSearchButton.on("click", toggleRecentSearch);

  // Preload search history from local storage
  printSearchHistory();
});
