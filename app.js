"use strict";

const movieSearchBox = document.getElementById("movie-search-box");

const searchList = document.getElementById("search-list");

const resultGrid = document.getElementById("result-grid");

// ? Loading movies from api

async function loadMovies(searchForm) {
  const url = `https://www.omdbapi.com/?s=${searchForm}&page=1&apikey=fae3d6bb`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.Response == "True") {
    displayMovies(data.Search);
  }
}

//* Taking the movie name from search box */

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();

  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");

    // * Load movies according to searchTerm
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

// !Creating a debounce function  */
const debounce = function (fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const Debouncing = debounce(findMovies, 300);

// *Display the movies search list */

function displayMovies(movies) {
  searchList.innerHTML = "";
  for (let movie of movies) {
    let movieListItem = document.createElement("div");

    movieListItem.dataset.id = movie.imdbID;
    movieListItem.classList.add("search-list-item");
    let moviePoster;
    if (movies.Poster !== "N/A") {
      moviePoster = movie.Poster;
    } else {
      moviePoster = "image_not_found.png";
    }

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}" loading="lazy" alt=${movie.imdbID} >
        </div>
        <div class = "search-item-info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        </div>
        `;

    searchList.appendChild(movieListItem);
  }

  loadMovieDetails();
}

// * Load the movie details based on the click */

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");

  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&page=1&apikey=fae3d6bb`
      );

      const movieDetails = await result.json();

      displayMovieDetails(movieDetails);
    });
  });
}

// * Display the movie details based on the click */

function displayMovieDetails(details) {
  resultGrid.innerHTML = `<div class="movie-poster">
  <img src="${details.Poster}" loading="lazy" alt="${details.imdbID}" class="movie-poster-image">
</div>

<div class="movie-info">
  <h3 class="movie-title">${details.Title}</h3>
  <ul class="movie-misc-info">
      <li class="movie-year"> ${details.Year}</li>
      <li class="movie-rated"> ${details.Rated}</li>
      <li class="movie-released">${details.Released}</li>
  </ul>
  <p class="genre"><b>Genre:</b> ${details.Genre} </p>
  <p class="writer"><b> Wrtier:</b> ${details.Writer} </p>
  <p class="actors"><b>Actors:</b> ${details.Actors}</p>
  <p class="plot"><b>Plot:</b> ${details.Plot}</p>

  <p class="language"><b>Language:</b> ${details.Language}</p>
  <p class="awards"><b><i class="fas fa-award"></i></b>${details.Awards}</p>

</div>`;
}

// * Hide the search list when we click outside */

window.addEventListener("click", (event) => {
  if (event.target.className !== "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
