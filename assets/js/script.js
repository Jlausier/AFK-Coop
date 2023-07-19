$(document).ready(function () {
  let Manager = new APIManager();
  var searchContainer = $("#search-container");
  var gameSearchEl = $("#game-search");
  var locationSearchEl = $("#location-search");
  var searchBtnEl = $("#search-btn");
  var resultsContainer = $("#results-container");

  let isDisplayingFavorites = false;

  /**
   * Checks if inputs are valid and gets the calls getBusinesses
   * @returns {null} Return if conditons for search are not met
   */
  function getBusinessesFromForm(e) {
    e.stopPropagation();

    isDisplayingFavorites = false;

    let gameName = gameSearchEl.val().trim();

    let locationName = locationSearchEl.val().trim();

    // If input is invalid show a modal and return
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
   * Gets businesses from the API Manager, displays results or an error modal
   * @param {string} locationName Geographic area to search for businesses
   * @param {string} gameName Name of the game to get the genres and themes from
   */
  function getBusinesses(locationName, gameName) {
    Manager.getBusinessesFromGames(locationName, [gameName])
      .then(({ businesses, categories }) => {
        console.log(businesses);
        displayCards(businesses);
      })
      .catch(({ title, message }) => {
        showErrorModal(title, message);
      });
  }

  function displayCards(businesses) {
    resultsContainer.empty();
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    businesses.forEach((business) => {
      // GENERATE DISPLAY CARD ELEMENTS

      var dispCardCont = $("<div>");
      var dispCardImg = $("<img>");

      var dispCardDetailContainer = $("<div>");
      var dispCardName = $("<h3>");

      var dispCardStats = $("<div>");

      var ratingCont = $("<div>");
      var ratingNumb = $("<div>");
      var ratingStars = $("<div>");

      var infoCont = $("<div>");
      var tags = $("<div>");
      var address = $("<div>");
      var phone = $("<div>");

      var dispCardBtnCont = $("<div>");
      var dispCardMapBtn = $("<a>");
      var dispCardUrlBtn = $("<a>");
      var dispCardFavBtn = $("<button>");

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
        var tagName = $("<a>");
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

  function showModal() {
    $("#modal-overlay").show().addClass("modal-open");
    $("body").on("click.modal", function (event) {
      if (event.target.id === "modal-overlay") hideModal();
    });
  }

  function hideModal() {
    $("body").off("click.modal");
    let modal = $("#modal-overlay");
    modal.removeClass("modal-open");
    setTimeout(function () {
      modal.hide();
      $(".modal-content").hide();
    }, 200);
  }

  function showErrorModal(title, message) {
    $("#error-modal-title").text(title);
    $("#error-modal-message").text(message);
    $("#error-modal").show();
    showModal();
  }

  $("#error-modal-close").on("click", hideModal);

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

  $("#favorites-btn").on("click", displayFavorites);
});
