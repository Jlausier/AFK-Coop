$(document).ready(function() {
        
    function makeDisplayCards() {

        var displayContainer = $('#results-container');
    
        var dispCardCont = $('<div>');
        var dispCardImg = $('<img>');

        var dispCardDetailContainer = $('<div>');
        var dispCardName = $('<h3>');
        var dispCardDescp = $('<p>');

        var dispCardBtnCont = $('<div>');
        var dispCardMapBtn = $('<a>');
        var dispCardUrlBtn = $('<a>');
        var dispCardFavBtn = $('<a>');

        dispCardCont.addClass('mb-3 flex');
        dispCardImg.addClass('w-52 h-52 bg-cover')
        dispCardDetailContainer.addClass('pl-5 pt-3')
        dispCardName.addClass('mb-2 pt-5 font-sans text-3xl font-bold')
        dispCardDescp.addClass('mb-3')
        dispCardBtnCont.addClass('flex items-center')
        dispCardMapBtn.addClass('mr-3 px-3 py-2 rounded-full bg-blue-300 text-sm')
        dispCardUrlBtn.addClass('mr-3 px-3 py-2 rounded-full bg-blue-300 text-sm')
        dispCardFavBtn.addClass('material-symbols-outlined')
    

        // ======= This is the placeholder text for the Display Card.
        dispCardImg.attr('src', './arcade.jpg')
        dispCardName.text('Date Location Name');
        dispCardDescp.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec dictum magna. Curabitur ut nulla quis elit condimentum imperdiet sit amet sed leo. Curabitur ipsum nunc, rutrum non orci non, pharetra lobortis tortor. Aenean malesuada turpis lobortis posuere placerat. Fusce quis ullamcorper lorem, eget scelerisque sapien.');

        // ======= This is the Display Card text/values that can be plugged into with the API Data
        // dispCardImg.attr('src', BUSINESS.image_url)
        // dispCardName.text(BUSINESS.name);
        // dispCardDescp.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec dictum magna. Curabitur ut nulla quis elit condimentum imperdiet sit amet sed leo. Curabitur ipsum nunc, rutrum non orci non, pharetra lobortis tortor. Aenean malesuada turpis lobortis posuere placerat. Fusce quis ullamcorper lorem, eget scelerisque sapien.');
    
        dispCardMapBtn.text('Directions');
        dispCardUrlBtn.text('Yelp Page');
        dispCardFavBtn.text('favorite');

        // dispCardMapBtn.attr('href', );
        // dispCardUrlBtn.attr('href', 'BUSINESS.url');
        

        dispCardBtnCont.append(dispCardMapBtn, dispCardUrlBtn, dispCardFavBtn);
    
        dispCardDetailContainer.append(dispCardName, dispCardDescp, dispCardBtnCont);

        dispCardCont.append(dispCardImg, dispCardDetailContainer);

        displayContainer.append(dispCardCont);
    }

  });

//    dispCardCont
//    dispCardImg
//    dispCardDetailContainer
//    dispCardName
//    dispCardDescp
//    dispCardMapBtn
//    dispCardUrlBtn
//    dispCardFavBtn


// test iwth id

// let Yelp = new YelpAPI()
// yelp.fetchBusinessTest("")


// let Yelp = new YelpAPI();

// let business = Yelp.fetchBusinessTest("");

// async function getBusinesses() {
//   await Yelp.fetchBusinessesSearchTest("").then(function (data) {
//     displayBusinesses(data);
//   });
// }

// $("#button").on("click", async function () {
//   await Yelp.fetchBusinessesSearchTest("").then(function (data) {
//     displayBusinesses(data);
//   });
// });