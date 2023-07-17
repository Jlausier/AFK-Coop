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

            var dispCardStats = $('<div>');

            var ratingCont = $('<div>');
            var ratingNumb = $('<div>');
            var ratingStars = $('<div>');

            var infoCont = $('<div>');
            var tags = $('<div>');
            var address = $('<div>');
            var phone = $('<div>');



            var dispCardBtnCont = $('<div>');

            var dispCardMapBtn = $('<a>');
            var dispCardUrlBtn = $('<a>');
            var dispCardFavBtn = $('<a>');

            dispCardCont.addClass('mb-10 flex');
            dispCardImg.addClass('w-48 h-48 object-cover');

            dispCardDetailContainer.addClass('pl-5 pt-3');
            dispCardName.addClass('mb-2 text-slate-200 font-sans text-3xl font-bold');

            dispCardStats.addClass('p-2 flex');

            ratingCont.addClass('px-2 rounded bg-gray-900/75 flex flex-col justify-center items-center');
            ratingNumb.addClass(' text-4xl');
            ratingStars.addClass(' text-sm tracking-wide');

            infoCont.addClass('ml-2 pl-2 text-slate-300');
            // tags.addClass('');
            // address.addClass('');
            // phone.addClass('');

            dispCardBtnCont.addClass('mt-2 flex items-center');
            dispCardMapBtn.addClass('mr-3 px-3 py-1 rounded-full bg-gray-900/50 text-sm');
            dispCardUrlBtn.addClass('mr-3 px-3 py-1 rounded-full bg-gray-900/50 text-sm');
            dispCardFavBtn.addClass('material-symbols-outlined');
        

            // ======= This is the placeholder text for the Display Card.
            dispCardImg.attr('src', './assets/images/valken-paintball-header-josh-bella.jpg');
            dispCardName.text('Date Location Name');

            ratingNumb.text('BUSINESS.rating');
            ratingStars.text('STARS');

            tags.text('tag');
            address.text('BUSINESS.location.display_address');
            phone.text('BUSINESS.display_phone');

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

            ratingCont.append(ratingNumb, ratingStars);

            infoCont.append(tags, address, phone);

            dispCardStats.append(ratingCont, infoCont);
        
            dispCardDetailContainer.append(dispCardName, dispCardStats, dispCardBtnCont);

            dispCardCont.append(dispCardImg, dispCardDetailContainer);

            displayContainer.append(dispCardCont);

            resultsContainer.append(displayContainer);

        reformat();
    }

    function reformat() {
        searchContainer.removeClass("w-2/5 flex flex-col justify-center");
        resultsContainer.removeClass("w-3/5 flex justify-center items-center");

        searchContainer.addClass("w-1/4 flex flex-col ");
        resultsContainer.addClass("w-3/4 ml-10 max-h-screen overflow-y-scroll flex flex-col items-start");

        tagLine.hide();
        subTagLine.hide();

    };

    searchBtnEl.on('click', testFunction);
    
});