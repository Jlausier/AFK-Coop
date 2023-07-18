$(document).ready(function () {
  let Manager = new APIManager();
  var tagLine = $("tag-line");
  var subTagLine = $("sub-tag-line");

  var contactModal = $("#contact-modal");
  var contactBtn = $("#contactBtn");
  var contactCloseBtn = $("#contactCloseBtn");

  var searchContainer = $("#search-container");
  var gameSearchEl = $("#game-search");
  var locationSearchEl = $("#location-search");
  var searchBtnEl = $("#search-btn");

  var recentSearchesEl = $('#recently-searched');
  var revealRecentSearch = $('reveal-recent-btn');

  var resultsContainer = $("#results-container");

  function getBusinesses(event) {
    resultsContainer.empty();

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

      

      dispCardCont.addClass(" mb-28 md:mb-14 lg:mb-10 xl:justify-start flex justify-center items-center flex-wrap md:items-start md:flex-nowrap");
      dispCardImg.addClass("w-64 md:w-48 2xl:max-w-1/3 aspect-square object-cover");


      dispCardDetailContainer.addClass("pl-5 pt-3 lg:pt-0 2xl:max-w-2/3 flex flex-col items-center md:items-start");
      dispCardName.addClass(" mb-2 text-slate-200 font-sans text-center md:text-left text-3xl font-bold");


      dispCardStats.addClass(" p-2 flex");

      ratingCont.addClass(
        " px-2 h-24 2xl:h-20 rounded bg-gray-900/75 flex flex-col justify-center items-center"
      );
      ratingNumb.addClass("text-2xl");
      ratingStars.addClass("text-sm tracking-wide");

      infoCont.addClass(" w-full ml-2 pl-2 text-sm md:text-base lg:text-sm text-slate-300 ");

      tags.addClass('mb-2 text-xs font-bold');
      address.addClass('px-2');
      phone.addClass('px-2');


      dispCardBtnCont.addClass("mt-2 flex items-center");
      dispCardMapBtn.addClass(
        " mr-3 px-3 py-1 rounded-full bg-gray-900/50 text-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-green-500 hover:text-white transition ease-in-out"
      );
      dispCardUrlBtn.addClass(
        " mr-3 px-3 py-1 rounded-full bg-gray-900/50 text-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-green-500 hover:text-white transition ease-in-out"
      );
      dispCardFavBtn.addClass("material-symbols-outlined");

      // CONNECT DISPLAY CARD WITH API DATA

      dispCardImg.attr("src", business["image_url"]);
      dispCardName.text(business.name);

      ratingNumb.text(business.rating);
      ratingStars.text("STARS");

      for (let i = 0; i < business.categories.length; i++) {
        var tagName = $("<a>");
        tagName.addClass("pr-2");
        let categoryNumber = business.categories[i].title;
        tagName.text(categoryNumber);
        tagName.addClass('py-1 px-2 mr-2  border-slate-300 rounded-full')
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

      dispCardFavBtn.text("favorite");
      dispCardFavBtn.attr(".fav-btn");

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

  searchBtnEl.on("click", getBusinesses);

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


      // ================== Search History ================== //

      // Retain data from local storage

      function readSearchesFromStorage() {
        var searches = localStorage.getItem('AFK Game Searches');
        if (searches) {
            searches = JSON.parse(searches);
        } else {
            searches = [];
        }
        console.log(searches);
        return searches;
        
      }

      // Save NEW data to local storage

      function saveSearchesToStorage(searchItem) {
        localStorage.setItem('AFK Game Searches', JSON.stringify(searchItem));
      }

    // Display data from local storage

    function printSearchHistory() {
      //clear current list of searches on page
      recentSearchesEl.empty(); // 
      
      // attaches the array made from readSearchesFromStorage and applies it to searches
      var searches = readSearchesFromStorage();
      console.log('this one!!!!');
      console.log(searches);
      
      // loop through each project and create a new li and add it to the list
      for (var i = 0; i < searches.length; i++) {
          var searchedItems = searches[i];
          console.log(searchedItems);
          
          var listEl = $('<p>');

          recentSearchesEl.addClass('bg-gray-900/50')
          listEl.addClass('#');

          listEl.text(searchedItems.game +  ' in ' + searchedItems.location);
          listEl.attr('style','list-style-type: none');

          recentSearchesEl.append(listEl);

          recentSearchesEl.slowDown('slow');
      }
    };  

    function saveSearches() {

      var searchGameName = $('#game-search').val();
      var searchLocation = $('#location-search').val();
      let searchData = {
        game: searchGameName,
        location: searchLocation
      }

      // add searched item to local storage
      var searchHistory = readSearchesFromStorage();

      if (!searchHistory.includes(searchGameName)) {
          if (searchHistory.length > 4) {
            searchHistory.pop();
          }
          searchHistory.unshift(searchData);
          saveSearchesToStorage(searchHistory);
      }

      printSearchHistory();
    };

    searchBtnEl.on('click', saveSearches);



});
