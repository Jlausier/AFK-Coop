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
      var dispCardDescp = $("<div>");
      // var dispCardStats = $('<div>');
      // var ratingCont = $('<div>');
      // var ratingNumb = $('<div>');
      // var ratingStars = $('<div>');
      // var infoCont = $('<div>');
      // var tags = $('<div>');
      // var address = $('<div>');
      // var phone = $('<div>');

      var dispCardBtnCont = $("<div>");
      var dispCardMapBtn = $("<a>");
      var dispCardUrlBtn = $("<a>");
      var dispCardFavBtn = $("<button>");

      dispCardCont.addClass("mb-10 flex flex-wrap");
      dispCardImg.addClass("w-48 h-48 object-cover");

      dispCardDetailContainer.addClass("pl-5 pt-3");
      dispCardName.addClass("mb-2 pt-5 font-sans text-3xl font-bold");
      dispCardDescp.addClass("mb-3");
      // dispCardStats.addClass('mb-3')
      // ratingCont.addClass('mb-3')
      // ratingNumb.addClass('mb-3')
      // ratingStars.addClass('mb-3')
      // infoCont.addClass('mb-3')
      // tags.addClass('mb-3')
      // address.addClass('mb-3')
      // phone.addClass('mb-3')

      dispCardBtnCont.addClass("flex items-center");
      dispCardMapBtn.addClass(
        "mr-3 px-3 py-2 rounded-full bg-blue-300 text-sm"
      );
      dispCardUrlBtn.addClass(
        "mr-3 px-3 py-2 rounded-full bg-blue-300 text-sm"
      );
      dispCardFavBtn.addClass("material-symbols-outlined");

      // ======= This is the placeholder text for the Display Card.
      dispCardImg.attr("src", business["image_url"]);
      dispCardName.text(business.name);
      dispCardDescp.text(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis augue non mi consequat tincidunt. Etiam at neque odio. Aliquam convallis dictum nunc, varius gravida urna. Aliquam fringilla id lectus et pharetra. In ultrices erat et convallis efficitur. Pellentesque vestibulum purus ut risus viverra, volutpat consectetur nisi elementum."
      );

      // ratingNumb.text('5')
      // ratingStars.text('star_rate')

      // tags.text('tag')
      // address.text('555 code st Orlando, FL 39090')
      // phone.text('555-555-5555')

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

      // dispCardMapBtn.attr('href', );
      // dispCardUrlBtn.attr('href', 'BUSINESS.url');

      dispCardBtnCont.append(dispCardMapBtn, dispCardUrlBtn, dispCardFavBtn);

      // ratingCont.append(ratingNumb, ratingStars);

      // infoCont.append(tags, address, phone);

      // dispCardStats.append(ratingCont, infoCont);

      dispCardDetailContainer.append(
        dispCardName,
        dispCardDescp,
        dispCardBtnCont
      );

      dispCardCont.append(dispCardImg, dispCardDetailContainer);

      resultsContainer.append(dispCardCont);
    });

    reformat();
  }

  function reformat() {
    searchContainer.removeClass("w-full md:w-2/5 flex flex-col justify-center");
    resultsContainer.removeClass("w-3/5 flex justify-center items-center");

    searchContainer.addClass(" md:w-1/4  flex flex-col ");
    resultsContainer.addClass(
      "w-3/4 ml-10 mx-h-5/6 overflow-y-auto flex flex-col items-center "
    );

    tagLine.hide();
    subTagLine.hide();
  }

  function showModal(title, message) {
    $("#modal-title").text(title);
    $("#modal-message").text(message);
    $("#modal-overlay").show().addClass("modal-open");
  }

  $("#modal-close").on("click", function () {
    var modal = $("#modalOverlay");
    modal.removeClass("modal-open");
    setTimeout(function () {
      modal.hide();
      $("#modal-title").text("");
      $("#modal-message").text("");
    }, 200);
  });

  searchBtnEl.on("click", getBusinesses);
});
