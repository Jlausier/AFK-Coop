var games = document.getElementById('game-search-form-game')
var loacation = document.getElementById('game-search-form-location')
var buttonEl = document.getElementById('game-search-form-submit')
var formEl = document.getElementById('main-search-game')
var yelpEl = document.getElementById('yelp-container')


// button gets values from both inputs
$(buttonEl).on('click', function(event){
    let gameInput = games.value.trim();
    let locationInput  = location.value.trim();
    dateResults(gameInput, locationInput);
    movement()
})

// dateResults(gameInput, locationInput){
// //fetch


// };


function movement(){

    formEl.classList.remove('items-center')
    formEl.classList.add('p-10', 'text-center', 'w-80')

    
    

};
// function with for loop fo reach yelp element returned
function displayYelp(){
yelpList = document.createElement('li')
yelpList.id = "yelp-cards"
 
let listEL = document.getElementById('yelp-cards')
listEL.setAttribute('class', '')

}