var games = document.getElementById('game-search-form-game')
var loacation = document.getElementById('game-search-form-location')
var buttonEl = document.getElementById('game-search-form-submit')
var formEl = document.getElementById('main-search-game')



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


movement(){

    formEl.classList.remove('items-center')
    formEl.classList.add('p-10', 'text-center', 'w-80')

    
    

};