const button = document.getElementById("search-button");
button.addEventListener("click", getData);

async function getData() {
  const searchTerm = document.getElementById("search").value;
  const response = await fetch("/api?search=" + searchTerm, { method: "GET" });
  const data = await response.json();
  displayData(data);
}

async function displayData(data) {
  var ids = await getListIds();
  const resultsDiv = document.getElementById("results-div");
  resultsDiv.innerHTML = "";
  for (let i = 0; i < data.Search.length; i++) {
    // Create div and append to parent
    const movie = data.Search[i];
    const movieDiv = document.createElement("div");
    const movieId = movie.imdbID;
    movieDiv.id = movie.imdbID;
    movieDiv.classList.add("movie");

    if (ids.includes(movieId)) {
      movieDiv.innerHTML = `
      <h2>${movie.Title}</h2>
      <p>${movie.Year}</p>
      <img src="${movie.Poster}"/>
      <button class="remove-button" onclick="removeMovie('${movieId}')">Remove from Watchlist</button>
      `;
    } else {
      movieDiv.innerHTML = `
    <h2>${movie.Title}</h2>
    <p>${movie.Year}</p>
    <img src="${movie.Poster}"/>
    <button class="add-button" onClick="addMovie(${movieId})">Add to Watchlist</button>
    `;
    }
    resultsDiv.appendChild(movieDiv);
  }
}

function addMovie(movie) {
  const api_url = "https://omdbapi.com/?apikey=4c3128ae&i=" + movie.id;

  fetch(api_url)
    .then((res) => res.json())
    .then((data) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/addMovie");
      xhr.setRequestHeader("Content-Type", "application/json");
      const payload = JSON.stringify(data);
      xhr.send(payload);
    });
}

function removeMovie(movieId) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/removeMovie");
  xhr.setRequestHeader("Content-Type", "application/json");
  const payload = JSON.stringify({ imdbID: movieId });
  console.log(payload);
  xhr.send(payload);
}

async function getListIds() {
  const response = await fetch("/getIds", { method: "GET" });
  const data = await response.json();
  var ids = [];
  if (data.length > 0) {
    var movies = data[0].movies;
    for (let i = 0; i < movies.length; i++) {
      ids.push(movies[i].imdbID);
    }
  }

  return ids;
}
