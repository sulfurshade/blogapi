// $(function() {
//   console.log('hello world :o');
  
//   $.get('/dreams', function(dreams) {
//     dreams.forEach(function(dream) {
//       $('<li></li>').text(dream).appendTo('ul#dreams');
//     });
//   });

//   $('form').submit(function(event) {
//     event.preventDefault();
//     var dream = $('input').val();
//     $.post('/dreams?' + $.param({dream: dream}), function() {
//       $('<li></li>').text(dream).appendTo('ul#dreams');
//       $('input').val('');
//       $('input').focus();
//     });
//   });

// });

const QUIZ_MODAL_POPUP = ".modal";
const QUIZ_MODAL_CLOSE = ".close-button";
const QUIZ_MODAL_TEXT = '.modal-text';
const QUIZ_MODAL_NAME = '.modal-name';

const GBOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'; //google books
const TD_BASE_URL = 'https://tastedive.com/api/similar'; //tastedive

let queryState = {
  maxResults: 5,
  projection: 'lite',
  key: "AIzaSyDXuFocA6d2wQyECKv1_VxkDPYnjxIE8Gk"
}

let recommendState = {
  type: "books",
  info: 1,
  limit: 3,
  k: "279300-BookSear-BLEYCEOF"
}
// q: searchquery***
// https://tastedive.com/api/similar?q=book:harry+potter&type=books&info=1&limit=3&k=279300-BookSear-BLEYCEOF&callback

function getDataFromGBooksApi (query, callback) {
  // console.log(query);
  $.getJSON(GBOOKS_BASE_URL, query, callback);
}
function getDataFromTDApi (query) {
  $.ajax({
    url: TD_BASE_URL,
    data: query,
    dataType: "jsonp",
    jsonpCallback: "displayTDSearchData"
  });
}


function displayGBooksSearchData(data) {
  // queryState.pageToken = data.nextPageToken;
  const results = data.items.map((item, index) => displayResults(item, index));
  // console.log(results);
  $('.js-search-results').html(results);
}

function displayTDSearchData(data) {
  // queryState.pageToken = data.nextPageToken;
  const recommended = data.Similar.Results.map((item, index) => displayRecommend(item, index));
  //console.log(recommended);
  $('.js-recommend-results').html(recommended);
}

function submitData() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const searchInput = $('#js-search-input');
    queryState.q = searchInput.val();
    searchInput.val("");
    //delete queryState.pageToken;
    $('#js-results-box').removeAttr('hidden'); // .attr('hidden')
    getDataFromGBooksApi(queryState, displayGBooksSearchData);
  });
  
  $('body').on('click', '.js-find-recommend', function(event) {
    var bookName = $(this).closest('.js-results-section').attr('data-book-name');
    // make your AJAX request and pass the bookName
    // console.log(bookName);
    recommendState.q = bookName;
    $('#js-recommend-box').removeAttr('hidden');
    getDataFromTDApi(recommendState, displayTDSearchData);
    // const recommendInput = ${result.volumeInfo.title};
    // console.log(recommendInput);
  });
  
  // $('#js-next-page').click(event => {
  //   getDataFromGBooksApi(queryState, displayGBooksSearchData);
  // });
  
  $(QUIZ_MODAL_CLOSE).click(function() {
    $(QUIZ_MODAL_POPUP).addClass('hidden');
    $("body").css("overflow", "visible");
  });
}

function displayResults(result, index) {
  // console.log(result);
  var img = (result.volumeInfo.imageLinks) ? `<img src="${result.volumeInfo.imageLinks.thumbnail}" alt="" class="js-result-pic" />` : '';
  return `
    <div class="js-results-section" data-book-name="${result.volumeInfo.title}">
      <h2>
        <a class="js-result-name" href="${result.volumeInfo.infoLink}" target="_blank">
          ${result.volumeInfo.title}
        </a>
      </h2>
      <br />
      ${img}
      <span class="js-results-info"><span class="bold">Author: ${result.volumeInfo.authors}</span><br />
      Description: ${result.volumeInfo.description}</span>

      <div class="js-recommend">
        <button class="js-find-recommend" data-popup-open="popup-feedback">Find Recommendations</button>
      </div>

    </div>
  `;
}

function displayRecommend(recommend, index) {
  console.log(recommend)
  // let resultName = recommend.Name;
  $(QUIZ_MODAL_POPUP).removeClass('hidden');
  $(QUIZ_MODAL_NAME).html(recommend.Name);
  $(QUIZ_MODAL_NAME).attr("href", recommend.wUrl);
  $(QUIZ_MODAL_TEXT).html('Description: ' + recommend.wTeaser);
  $("body").css("overflow", "hidden");
  // return;
//   return `
//     <div class="js-recommend-section">
//       <h2>
//         <a class="js-recommend-name" href="${result.wUrl}" target="_blank">
//           ${result.Name}
//         </a>
//       </h2>
//       <br />
//       <span class="js-recommend-info">Description: ${result.wTeaser}</span>
//     </div>
// `;
}

$(submitData);

var modal = document.getElementById('popup-modal');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}