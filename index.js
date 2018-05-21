//Endpoint to get Youtube search api data
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
//variables that keeps tabs on current keyword, previous page token, 
//and next page token
let currentKeyword = '';
let prevPgToken = '';
let nextPgToken = '';
//Uses an object named query that has data needed to retrieve data 
//from API then use callback function to modify retrieved data
function getVidSearchFromYtAPI(pgToken = '',searchKeyword, callback){
  const query = {
      part: 'snippet',
      key: 'API-KEY-HERE',
      q: searchKeyword,
      pageToken: pgToken
      };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback).fail(showErr);
 }
 function renderPageInfo(results) {
   return `
   <p class="pageInfo">Found ${results.pageInfo.totalResults} videos related to ${currentKeyword}, 
    listing ${results.pageInfo.resultsPerPage}</p>`;
 }
//Creates results section that shows title, thumbnail with 
//links to video and channel.
function renderResult(result) {
  return `
  <a href="https://www.youtube.com/watch?v=${result.id.videoId}">
  <h2>${result.snippet.title} by ${result.snippet.channelTitle}</h2>
  <img src="${result.snippet.thumbnails.medium.url}" 
    title="${result.snippet.title}: ${result.snippet.description}" 
    alt="thumbnail to video" width="${result.snippet.thumbnails.medium.width}" 
    height="${result.snippet.thumbnails.medium.height}"/>
  </a>
  <div>
    <a class="channel" href="https://www.youtube.com/channel/${result.snippet.channelId}">Go to ${result.snippet.channelTitle} Channel</a>
  </div>
  `;
}
//get previous page by retrieving more data from api and calling back
//displayYoutubeSearchData to update results.
function getPrevPage(prevPgTkn){
  $('nav').on('click', '#prev', event => {
    getVidSearchFromYtAPI(prevPgToken, currentKeyword, displayYoutubeSearchData);
  });
}
//When clicking 'next' link we get next page by retieving more data from api 
//and calling back displayYoutubeSearchData to update results.
function getNextPage(nextPgTkn){
  $('nav').on('click', '#next', event => {
    getVidSearchFromYtAPI(nextPgToken, currentKeyword,displayYoutubeSearchData);
  });
}
//Our callback function that receives data from api and converts to html to show on webpage.
function displayYoutubeSearchData(data) {
  //display total videos found and how many videos listed on current page.
  $('.js-page-info').html(renderPageInfo(data));
  //creates a new array of the data from api, then call renderResult to input data into html.
  const results = data.items.map((item, index) => renderResult(item));
  //Update current page tokens
  prevPgToken = data.prevPageToken;
  nextPgToken = data.nextPageToken;
  //Update DOM with search results
  $('.js-search-results').html(results);
}
//Show error message
function showErr(err) {
  const outputElem = $('.js-search-results');
  const errMsg = (
    `<p>No videos found!</p>`
  );
  outputElem
    .html(errMsg);
}
//Main call function
function watchSubmit() {
  //When submitting search form, we get users search keywords to update with results
  //regarding to the keyword and display navigation to prev or next page.
  $('.js-search-form').submit(event => {
      event.preventDefault();
      $('nav').removeAttr('hidden');
      $('.js-page-info').removeAttr('hidden');
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      currentKeyword = queryTarget.val();
      // clear out the input
      queryTarget.val("");
      getVidSearchFromYtAPI('',query, displayYoutubeSearchData);
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
