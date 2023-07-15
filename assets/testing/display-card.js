$(document).ready(function() {
    var displayContainer = $('#results-container');
  
    var dispCardCont = $('<div>');
    var dispCardImg = $('<img>');
    var dispCardDetailContainer = $('<div>');
    var dispCardName = $('<h3>');
    var dispCardDescp = $('<p>');
    var dispCardMapBtn = $('<a>');
    var dispCardUrlBtn = $('<a>');
    var dispCardFavBtn = $('<a>');

    


    dispCardCont.addClass('mb-3 bg-yellow-500 flex');
    // dispCardImg
    dispCardDetailContainer.addClass('pl-5 pt-3')
    dispCardName.addClass('mb-2 pt-5 font-sans text-3xl font-bold')
    dispCardDescp.addClass('mb-3')
    dispCardMapBtn.addClass('mr-3 px-3 py-2 rounded-full bg-blue-300 ')
    dispCardUrlBtn.addClass('mr-3 px-3 py-2 rounded-full bg-blue-300 ')
    dispCardFavBtn.addClass('mr-3 px-3 py-2 rounded-full bg-blue-300 ')
  
    // dispCardImg;
    dispCardName.text('Date Location Name');
    dispCardDescp.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec dictum magna. Curabitur ut nulla quis elit condimentum imperdiet sit amet sed leo. Curabitur ipsum nunc, rutrum non orci non, pharetra lobortis tortor. Aenean malesuada turpis lobortis posuere placerat. Fusce quis ullamcorper lorem, eget scelerisque sapien.');
    dispCardMapBtn.text('Directions');
    dispCardUrlBtn.text('Website');
    dispCardFavBtn.text('<3');
  
    dispCardDetailContainer.append(dispCardName, dispCardDescp, dispCardMapBtn, dispCardUrlBtn, dispCardFavBtn);

    dispCardCont.append('<img id="theImg" src="https://picsum.photos/200" />', dispCardDetailContainer);

    displayContainer.append(dispCardCont);
  });

//    dispCardCont
//    dispCardImg
//    dispCardDetailContainer
//    dispCardName
//    dispCardDescp
//    dispCardMapBtn
//    dispCardUrlBtn
//    dispCardFavBtn