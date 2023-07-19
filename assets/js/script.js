$(document).ready(function () {
  let Manager = new APIManager();

  let searchContainer = $("#search-container");
  let genresBtn = $("#toggle");
  let gameToggle = $("#toggle-back");

  let gameLabelEl = $("#game-label");
  let gameSearchEl = $("#game-search");
  let genreGrid = $("#genre-grid");

  let locationSearchEl = $("#location-search");
  let searchBtnEl = $("#search-btn");

  let resultsContainer = $("#results-container");

  let gameCategories = APIManager.getGameCategories();
  let selectedCategories = {
    genres: [],
    themes: [],
  };

  let searchType = "game";
  let isDisplayingFavorites = false;

  /**
   * Checks if inputs are valid and gets the calls getBusinesses
   * @returns {null} Return if conditons for search are not met
   */
  function getBusinessesFromForm(e) {
    e.stopPropagation();

    isDisplayingFavorites = false;

    let locationName = locationSearchEl.val().trim();

    if (searchType === "game") {
      validateBusinessesByGame(locationName);
    } else if (searchType === "genres") {
      validateBusinessesByGenre(locationName);
    }
  }

  /**
   * Validates location and game name inputs
   * @param {string} locationName Geographic area to search for businesses
   * @returns {null} Exits function if input is invalid
   */
  function validateBusinessesByGame(locationName) {
    let gameName = gameSearchEl.val().trim();

    if (gameName === "" && locationName === "") {
      showErrorModal(
        "Enter a Game and Location",
        "Please enter the name of a game and a location to proceed."
      );
      return;
    } else if (gameName === "") {
      showErrorModal(
        "Enter a Game",
        "Please enter the name of a game to proceed."
      );
      return;
    } else if (locationName === "") {
      showErrorModal(
        "Enter a Location",
        "Please enter the location to proceed."
      );
      return;
    }

    getBusinesses(locationName, gameName);
  }

  /**
   * Validates location and selected categories inputs
   * @param {string} locationName Geographic area to search for businesses
   * @returns {null} Exits function if input is invalid
   */
  function validateBusinessesByGenre(locationName) {
    let categoriesEmpty =
      selectedCategories.genres.length === 0 &&
      selectedCategories.themes.length === 0;
    if (categoriesEmpty && locationName === "") {
      showErrorModal(
        "Select a Category and Enter a Location",
        "Please select one of the categories above and enter a location to proceed."
      );
      return;
    } else if (categoriesEmpty) {
      showErrorModal(
        "Select a Category",
        "Please select one of the categories above to proceed."
      );
      return;
    } else if (locationName === "") {
      showErrorModal(
        "Enter a Location",
        "Please enter the location to proceed."
      );
      return;
    }

    getBusinessesByGenre(locationName);
  }

  /**
   * Displays result cards or shows an error modal
   * @param {Promise<Object>} promise API call
   */
  function handleResponse(promise) {
    promise
      .then(({ businesses, categories }) => {
        displayCards(businesses);
      })
      .catch(({ title, message }) => {
        showErrorModal(title, message);
      });
  }

  /**
   * Gets businesses by game genres, displays results or an error modal
   * @param {string} locationName Geographic area to search for businesses
   */
  function getBusinessesByGenre(locationName) {
    handleResponse(
      Manager.getBusinessesFromGameCategories(locationName, selectedCategories)
    );
  }

  /**
   * Gets businesses by game name, displays results or an error modal
   * @param {string} locationName Geographic area to search for businesses
   * @param {string} gameName Name of the game to get the genres and themes from
   */
  function getBusinesses(locationName, gameName) {
    handleResponse(Manager.getBusinessesFromGames(locationName, [gameName]));
  }

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
    searchContainer.removeClass("w-full lg:w-2/5 flex flex-col justify-center");
    resultsContainer.removeClass("w-3/5 flex justify-center items-center");

    searchContainer.addClass("w-full lg:w-2/5 2xl:w1/2 flex flex-col");
    resultsContainer.addClass(
      "w-full lg:w-3/5 lg:ml-10 2xl:w-1/2 lg:h-[40rem] xl:h-[50rem] overflow-y-scroll flex flex-col justify-start items-start"
    );

    $("tag-line").hide();
    $("sub-tag-line").hide();
  }

  searchBtnEl.on("click", getBusinessesFromForm);

  /* ===== MODALS ======================================================= */

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

  /**
   * Show an error modal
   * @param {string} title Title of the error
   * @param {string} message Longer error message
   */
  function showErrorModal(title, message) {
    $("#error-modal-title").text(title);
    $("#error-modal-message").text(message);
    $("#error-modal").show();
    showModal();
  }

  // Show the contact modal
  $("#contact-btn").on("click", function (e) {
    e.stopPropagation();
    $("#contact-modal").show();
    showModal();
  });

  /* ===== FAVORITES ======================================================= */

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
      showErrorModal(
        "No Favorites",
        "You haven't favorited any businesses yet, click the heart icon to save a business to your favorites."
      );
    }
  }

  // Displays favorites when button in header is clicked
  $("#favorites-btn").on("click", displayFavorites);

  // ================================================================================

  /**
   * Hides game input and shows genres
   * @returns {null} Exit if already showing genres
   */
  function toggleGenres() {
    if (searchType === "genres") return;

    searchType = "genres";

    /**
     * Creates a checkbox for a genre or theme
     * @param {string} category Name of the category
     * @param {string} type Genre or theme
     */
    function createGenreCheckbox(category, type) {
      let genreDiv = $("<div>");
      let inputDiv = $("<input>");
      let labelDiv = $("<label>");

      genreDiv.addClass("flex items-center");
      inputDiv.attr("type", "checkbox");

      labelDiv.addClass("ml-2 text-white");

      labelDiv.text(category.title);
      gameSearchEl.hide();

      genreDiv.append(inputDiv);
      genreDiv.append(labelDiv);
      genreGrid.append(genreDiv);

      inputDiv.on("change", function (_) {
        if (inputDiv.is(":checked")) {
          selectedCategories[type].push(category.id);
        } else {
          selectedCategories[type] = selectedCategories[type].filter(
            (a) => a !== category.id
          );
        }
      });
    }

    gameCategories.genres.forEach((category) => {
      createGenreCheckbox(category, "genres");
    });

    gameCategories.themes.forEach((category) => {
      createGenreCheckbox(category, "themes");
    });

    gameLabelEl.text("Select Your Favorite Genres");
    genreGrid.show();
    resetForm();
  }
  // Toggle genres on click
  genresBtn.on("click", toggleGenres);

  /**
   * Hides genres and shows game input
   * @returns {null} Exit if already showing genres
   */
  function toggleGame() {
    if (searchType === "game") return;

    genreGrid.empty();

    searchType = "game";
    gameLabelEl.text("Enter Your Favorite Game");
    genreGrid.hide();
    gameSearchEl.show();
    resetForm();
  }
  // Toggle game input on click
  $(gameToggle).on("click", toggleGame);

  /**
   * Clears inputs on toggle
   */
  function resetForm() {
    // Clear the input field
    gameSearchEl.val("");
    // Clear the selected categories
    selectedCategories.genres = [];
    selectedCategories.themes = [];
  }
});
