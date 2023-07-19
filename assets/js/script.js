$(document).ready(function () {
  let Manager = new APIManager();
  var tagLine = $("tag-line");
  var subTagLine = $("sub-tag-line");

  var contactModal = $("#contact-modal");
  var contactBtn = $("#contactBtn");
  var contactCloseBtn = $("#contactCloseBtn");

  let favoritesBtn = $("#favorites-button");

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
  function getBusinessesFromForm() {
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
        "w-64 md:w-48 2xl:max-w-1/3 aspect-square object-cover"
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

    tagLine.hide();
    subTagLine.hide();
  }

  function showErrorModal(title, message) {
    $("#error-modal-title").text(title);
    $("#error-modal-message").text(message);
    $("#error-modal-overlay").show().addClass("error-modal-open");
  }

  $("#error-modal-close").on("click", function () {
    var modal = $("#error-modal-overlay");
    modal.removeClass("error-modal-open");
    setTimeout(function () {
      modal.hide();
    }, 200);
  });

  searchBtnEl.on("click", getBusinessesFromForm);

  /**
   * Hides the contact modal and disables the body event listener
   */
  function hideContactModal() {
    contactModal.hide();
    $("body").off("click.contact-modal");
  }

  // When the user clicks the button, open the modal
  contactBtn.on("click", function (e) {
    e.stopPropagation();
    contactModal.show();
    // When the user clicks anywhere outside of the modal, close it
    $("body").on("click.contact-modal", function (event) {
      if (event.target !== contactModal) {
        hideContactModal();
      }
    });
  });

  // When the user clicks on <span> (x), close the modal
  contactCloseBtn.on("click", function () {
    hideContactModal();
  });

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
        "You have no favorited businesses yet, click the heart icon to save a business as a favorite."
      );
    }
  }

  favoritesBtn.on("click", displayFavorites);
});


var generesBtn = document.getElementById('toggle')
var gameLabelEl = document.getElementById('game-label')




// Display these
// let gameCategories = APIManager.getGameCategories();
// {
//   genres: [],
//   themes: [],
// }

// // Pass in an  object with arrays or ids
// Manager.getBusinessesFromGameCategories({
//   genres: [1, 2, 3, 4],
//   themes: [2, 3]
// })


$(generesBtn).on('click', function(){
displayGameCategories();

})

let gameCategories = APIManager.getGameCategories();
let selectedGenre = {
  genres: [],
  themes: [],
}


function displayGameCategories() {
    gameCategories.genres.forEach((category) => {
      createGenreCheckbox(category, "genres");
    });
  
    gameCategories.themes.forEach((category) => {
      createGenreCheckbox(category, "themes");
    });
  }

function createGenreCheckbox(catagory, type){
var gridDiv = document.createElement ('div')
var genereDiv = document.createElement('div')
var inputdiv = document.createElement('input')
var labelDiv = document.createElement('label')

gridDiv.id = "grid-id"
gridDiv.setAttribute("class", " grid grid cols-3 gap-2")
genereDiv.setAttribute("class","flex items-center")
inputdiv.dataset.key = catagory.id
inputdiv.dataset.type = type;
labelDiv.setAttribute("class","ml-2 text-white")

labelDiv.innerText = catagory.title;
var gameSearchEl = document.getElementById("game-search").setAttribute("class", "invisible")

genereDiv.appendChild(inputdiv)
genereDiv.appendChild(labelDiv)
gridDiv.appendChild(genereDiv)
gameLabelEl.appendChild(gridDiv)


inputdiv.addEventListener("change", function(){
  if(inputdiv.checked(":checked")){
    selectedGenre[type].push(catagory.id)
  } else{
    selectedGenre[type] = selectedGenre[type].filter(
      (a)=> a !== category.id
        );
      }
    });
}

//  <div class="my-5 p-5 opacity-75 rounded-lg shadow-lg bg-gray-900">
//       <label class="mb-1 mt-5 text-blue-300 font-bold">Select Genre</label>
//       <div class="grid grid-cols-3 gap-4">
//         <!-- Genre options -->
//         <div class="flex items-center">
//           <input type="checkbox" id="action-genre" name="genre" value="action">
//           <label for="action-genre" class="ml-2 text-white">Action</label>
//         </div>