$(document).ready (function() {

    var games = $('#game-search');
    var loacation = $('#location-search');
    var buttonEl = $('#search-btn')
    // var formEl = $('#main-search-game')
    // var yelpEl = $('#yelp-container')



    function saveSearchValues() {

        // takes values from the form
        var gameName = games.val();
        var cityName = loacation.val();
        console.log(gameName);
        console.log(cityName);

        // places form values into an array
        let searchedItems = [gameName, cityName];
        console.log(searchedItems);

        // uploads the 
        localStorage.setItem('Recent Search', JSON.stringify(searchedItems));

        //

    }

    buttonEl.on('click', saveSearchValues);

});