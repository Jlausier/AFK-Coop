$(document).ready (function() {

    var tagLine = $('tag-line')
    var subTagLine = $('sub-tag-line')

    var searchContainer = $('#search-container');
    var gameName = $('#game-search');
    var locationName = $('#location-search');
    var searchBtnEl = $('#search-btn');

    var resultsContainer = $('#results-container');

    var displayContainer = $('#results-container');
       
    function testFunction() {
        

        displayContainer.empty();

        makeDisplayCards();
        makeDisplayCards();
        makeDisplayCards();
        makeDisplayCards();
        makeDisplayCards();
    }

    function makeDisplayCards(event) {

        
    
        // Write a for loop here
        
            var dispCardCont = $('<div>');
            var dispCardImg = $('<img>');

            var dispCardDetailContainer = $('<div>');
            var dispCardName = $('<h3>');
            var dispCardDescp = $('<div>');
            // var dispCardStats = $('<div>');
            // var ratingCont = $('<div>');
            // var ratingNumb = $('<div>');
            // var ratingStars = $('<div>');
            // var infoCont = $('<div>');
            // var tags = $('<div>');
            // var address = $('<div>');
            // var phone = $('<div>');

            var dispCardBtnCont = $('<div>');
            var dispCardMapBtn = $('<a>');
            var dispCardUrlBtn = $('<a>');
            var dispCardFavBtn = $('<a>');

            dispCardCont.addClass('mb-10 flex flex-wrap');
            dispCardImg.addClass('w-48 h-48 object-cover')

            dispCardDetailContainer.addClass('pl-5 pt-3')
            dispCardName.addClass('mb-2 pt-5 font-sans text-3xl font-bold');
            dispCardDescp.addClass('mb-3');
            // dispCardStats.addClass('mb-3')
            // ratingCont.addClass('mb-3')
            // ratingNumb.addClass('mb-3')
            // ratingStars.addClass('mb-3')
            // infoCont.addClass('mb-3')
            // tags.addClass('mb-3')
            // address.addClass('mb-3')
            // phone.addClass('mb-3')

            dispCardBtnCont.addClass('flex items-center')
            dispCardMapBtn.addClass('mr-3 px-3 py-2 rounded-full bg-blue-300 text-sm')
            dispCardUrlBtn.addClass('mr-3 px-3 py-2 rounded-full bg-blue-300 text-sm')
            dispCardFavBtn.addClass('material-symbols-outlined')
        

            // ======= This is the placeholder text for the Display Card.
            dispCardImg.attr('src', './assets/images/valken-paintball-header-josh-bella.jpg')
            dispCardName.text('Date Location Name');
            dispCardDescp.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis augue non mi consequat tincidunt. Etiam at neque odio. Aliquam convallis dictum nunc, varius gravida urna. Aliquam fringilla id lectus et pharetra. In ultrices erat et convallis efficitur. Pellentesque vestibulum purus ut risus viverra, volutpat consectetur nisi elementum.');

            // ratingNumb.text('5')
            // ratingStars.text('star_rate')

            // tags.text('tag')
            // address.text('555 code st Orlando, FL 39090')
            // phone.text('555-555-5555')

            // ======= This is the Display Card text/values that can be plugged into with the API Data
            // dispCardImg.attr('src', BUSINESS.image_url)
            // dispCardName.text(BUSINESS.name);
            // dispCardStats.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec dictum magna. Curabitur ut nulla quis elit condimentum imperdiet sit amet sed leo. Curabitur ipsum nunc, rutrum non orci non, pharetra lobortis tortor. Aenean malesuada turpis lobortis posuere placerat. Fusce quis ullamcorper lorem, eget scelerisque sapien.');
        
            dispCardMapBtn.text('Directions');
            dispCardUrlBtn.text('Yelp Page');
            dispCardFavBtn.text('favorite');

            // dispCardMapBtn.attr('href', );
            // dispCardUrlBtn.attr('href', 'BUSINESS.url');
            

            dispCardBtnCont.append(dispCardMapBtn, dispCardUrlBtn, dispCardFavBtn);

            // ratingCont.append(ratingNumb, ratingStars);

            // infoCont.append(tags, address, phone);

            // dispCardStats.append(ratingCont, infoCont);
        
            dispCardDetailContainer.append(dispCardName, dispCardDescp, dispCardBtnCont);

            dispCardCont.append(dispCardImg, dispCardDetailContainer);

            displayContainer.append(dispCardCont);

            resultsContainer.append(displayContainer);

        reformat();
    }

    function reformat() {
        searchContainer.removeClass("w-full md:w-2/5 flex flex-col justify-center");
        resultsContainer.removeClass("w-3/5 flex justify-center items-center");

        searchContainer.addClass(" md:w-1/4  flex flex-col ");
        resultsContainer.addClass("w-3/4 ml-10 mx-h-5/6 overflow-y-auto flex flex-col items-center ");

        tagLine.hide();
        subTagLine.hide();

    };

    searchBtnEl.on('click', testFunction);
    
});