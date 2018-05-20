//Endpoint to get Youtube search api data
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
//variables that keeps tabs on current keyword, previous page token, 
//and next page token
let currentKeyword = '';
let prevPgToken = '';
let nextPgToken = '';
//Uses an object named query that has data needed to retrieve data 
//from API then use callback function to modify retrieved data
function getVidSearchFromYtAPI(searchKeyword, pgToken = '', callback){
  const query = {
      part: 'snippet',
      key: 'AIzaSyDrNsEhgakODu5mB_3Ti-aCAxnB41HdhYo',
      q: searchKeyword,
      pageToken: pgToken
      };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
 }
//Creates results section that shows title, thumbnail with 
//links to video and channel.
function renderResult(result) {
  return `
  <a href="https://www.youtube.com/watch?v=${result.id.videoId}">
  <h2>${result.snippet.title}</h2>
  <img src="${result.snippet.thumbnails.medium.url}" title="${result.snippet.title}" alt="${result.id.description}" width="${result.snippet.thumbnails.medium.width}" height="${result.snippet.thumbnails.medium.height}"/>
  </a>
  <div>
    <a href="https://www.youtube.com/channel/${result.snippet.channelId}">Go to Channel</a>
  </div>
   `
}
//shows navigation to previous or next page
function renderNav() {
  return `        
  <!-- Show prev and next link to navigate to prev or next page -->
  <nav role="navigation">
    <a href="#" id="prev">Previous</a>
    <span>|</span>
    <a href="#" id="next">Next</a>
  </nav>
  `
}
//get previous page by retieving more data from api and calling back
//displayYoutubeSearchData to update results.
function getPrevPage(prevPgTkn){
  $('nav').on('click', '#prev', event => {
    getVidSearchFromYtAPI(currentKeyword, prevPgToken, displayYoutubeSearchData);
  });
}
//When clicking 'next' link we get next page by retieving more data from api 
//and calling back displayYoutubeSearchData to update results.
function getNextPage(nextPgTkn){
  $('nav').on('click', '#next', event => {
    getVidSearchFromYtAPI(currentKeyword, nextPgToken, displayYoutubeSearchData);
  });
}
//Our callback function that receives data from api and converts to html to show on webpage.
function displayYoutubeSearchData(data) {
  //creates a new array of the data from api, then call renderResult to input data into html.
  const results = data.items.map((item, index) => renderResult(item));
  //Update current page tokens
  prevPgToken = data.prevPageToken;
  nextPgToken = data.nextPageToken;
  //Update DOM with search results
  $('.js-search-results').html(results);
}
//Main call function
function watchSubmit() {
  //When submitting search form, we get users search keywords to update with results
  //regarding to the keyword and display navigation to prev or next page.
  $('.js-search-form').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      currentKeyword = queryTarget.val();
      // clear out the input
      queryTarget.val("");
      getVidSearchFromYtAPI(query,'', displayYoutubeSearchData);
      $('.js-search-form').after(renderNav());
      //Start listening for when users click on prev or next link.
      getPrevPage(prevPgToken);
      getNextPage(nextPgToken);
  });
}

$(watchSubmit);
//Optional Advanced functionality challenges:
//DONE: Make the images clickable, leading the user to the YouTube video, on YouTube
// Make the images clickable, playing them in a lightbox
//DONE: Show a link for more from the channel that each video came from
//DONE:Show buttons to get more results (using the previous and next page links from the JSON)
