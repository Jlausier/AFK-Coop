$(document).ready(function () {
  let Manager = new APIManager();
  var tagLine = $("tag-line");
  var subTagLine = $("sub-tag-line");

  var searchContainer = $("#search-container");
  var gameSearchEl = $("#game-search");
  var locationSearchEl = $("#location-search");
  var searchBtnEl = $("#search-btn");

  var resultsContainer = $("#results-container");

 


  function getBusinesses(event) {
    resultsContainer.empty();
    

    let gameName = gameSearchEl.val().trim();
    if (gameName === "") {
      // Display modal
      return;
    }
    let locationName = locationSearchEl.val().trim();
    if (locationName === "") {
      // Display modal
      return;
    }

    Manager.getBusinessesFromGames(locationName, [gameName]).then(
      ({ businesses, categories }) => {
        console.log(businesses);
        displayCards(businesses);
      }
    );
  }

  function displayCards(businesses) {
    // Write a for loop here

    businesses.forEach((business) => {
      //
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

      dispCardCont.addClass("mb-10 flex flex-wrap");
      dispCardImg.addClass("w-48 h-48 object-cover");

      dispCardDetailContainer.addClass("pl-5 pt-3");
      dispCardName.addClass("mb-2 text-slate-200 font-sans text-xl md:text-2xl font-bold");

      dispCardStats.addClass("p-2 flex");

      ratingCont.addClass(
        "px-2 rounded bg-gray-900/75 flex flex-col justify-center items-center"
      );
      ratingNumb.addClass(" text-4xl");
      ratingStars.addClass(" text-sm tracking-wide");

      infoCont.addClass("ml-2 pl-2 text-slate-300");
      // tags.addClass('');
      // address.addClass('');
      // phone.addClass('');

      dispCardBtnCont.addClass("mt-2 flex items-center");
      dispCardMapBtn.addClass(
        "mr-3 px-3 py-1 rounded-full bg-gray-900/50 text-sm"
      );
      dispCardUrlBtn.addClass(
        "mr-3 px-3 py-1 rounded-full bg-gray-900/50 text-sm"
      );
      dispCardFavBtn.addClass("material-symbols-outlined");

      // ======= This is the placeholder text for the Display Card.
      dispCardImg.attr("src", business["image_url"]);
      dispCardName.text(business.name);

      ratingNumb.text(business.rating);
      ratingStars.text("STARS");

      for (let i = 0; i < business.categories.length; i++) {
        var tagName = $("<a>");
        tagName.addClass("pr-2");
        let categoryNumber = business.categories[i].title;
        tagName.text(categoryNumber);
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

      // dispCardMapBtn.attr('href', );
      // dispCardUrlBtn.attr('href', 'BUSINESS.url');

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
    searchContainer.removeClass("w-full md:w-2/5 flex flex-col justify-center");
    resultsContainer.removeClass("w-full md:w-3/5 flex justify-center items-center");
    

    searchContainer.addClass("md:w-1/4 flex flex-col ");
    resultsContainer.addClass(
      "w-3/4  ml-10 md:pl-10 md:h-96 md:overflow-y-scroll lg:h-[40rem] lg:overflow-y-scroll flex flex-col  items-start "
    );
    


    tagLine.hide();
    subTagLine.hide();
  }

  searchBtnEl.on("click", getBusinesses);
});



   // Get the modal
   var modal = document.getElementById("contactModal");

   // Get the button that opens the modal
   var contactBtn = document.getElementById("contactBtn");

   // Get the <span> element that closes the modal
   var closeBtn = document.getElementsByClassName("close")[0];

   // When the user clicks the button, open the modal
   contactBtn.onclick = function() {
     modal.style.display = "block";
   }

   // When the user clicks on <span> (x), close the modal
   closeBtn.onclick = function() {
     modal.style.display = "none";
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function(event) {
     if (event.target == modal) {
       modal.style.display = "none";
     }
   }