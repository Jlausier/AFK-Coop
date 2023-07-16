var games = document.getElementById('game-search')
var loacation = document.getElementById('location-search')
var buttonEl = document.getElementById('search-btn')
var formEl = document.getElementById('main-search-game')
var yelpEl = document.getElementById('yelp-container')


// button gets values from both inputs
$(buttonEl).on('click', function(){
    // let gameInput = games.value
    // let locationInput  = location.value
    //      (gameInput)
    //      (locationInput);
   redirect()
})

// dateResults(gameInput, locationInput){
// //fetch
function redirect(event) {

window.location.href = "/results.html";

}

// };     

// This is a test
   


// function with for loop fo reach yelp element returned
