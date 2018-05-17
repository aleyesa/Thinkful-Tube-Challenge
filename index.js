//Endpoint to get Youtube search api data
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
//Uses a query object that has data needed to retrieve data from API then use callback function modify retrieved data
function getVidSearchFromYtAPI(searchKeyword, callback){
  const query = {
      part: 'snippet',
      key: 'AIzaSyCha6Js5fT0-LtLDsIesWVgbE3hrVv8eOQ',
      q: searchKeyword
      };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
 }
//Creates results section that shows title, thumbnail with links to video and channel.
function renderResult(result) {
  return `
  <h2>${result.snippet.title}</h2>
  <a href="https://www.youtube.com/watch?v=${result.id.videoId}">
  <img src="${result.snippet.thumbnails.medium.url}" width="${result.snippet.thumbnails.medium.width}" height="${result.snippet.thumbnails.medium.height}"/>
  </a>
  <div>
    <a href="https://www.youtube.com/channel/${result.snippet.channelId}">Go to Channel</a>
  </div>
  `
}
//Navigation to previous or next page[In Progress]
function renderNav(data) {
  return `
  <a href="#">Previous</a>
  <span>|</span>
  <a href="#">Next</a>
  `
}
//Our callback function that receives data from api and converts to html to show on webpage.
function displayYoutubeSearchData(data) {
  //creates a new array of the data from api, then call renderResult to input data into html.
  const results = data.items.map((item, index) => renderResult(item));
  //inputs html in specified selector
  $('nav').html(renderNav(data));
  $('.js-search-results').html(results);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      // clear out the input
      queryTarget.val("");
      getVidSearchFromYtAPI(query, displayYoutubeSearchData);
  });
}

$(watchSubmit);
//Optional Advanced functionality challenges:
//DONE: Make the images clickable, leading the user to the YouTube video, on YouTube
// Make the images clickable, playing them in a lightbox
//DONE: Show a link for more from the channel that each video came from
// Show buttons to get more results (using the previous and next page links from the JSON)