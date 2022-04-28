const button = document.getElementById("search-button");
button.addEventListener("click", getData);
var ids = getListIds();

async function getData() {
  const searchTerm = document.getElementById("search").value;
  const response = await fetch("/api?search=" + searchTerm, { method: "GET" });
  const data = await response.json();
  displayData(data);
}

function displayData(data) {
  const resultsDiv = document.getElementById("results-div");
  resultsDiv.innerHTML = "";
  for (let i = 0; i < data.Search.length; i++) {
    // Create div and append to parent
    const movie = data.Search[i];
    const movieDiv = document.createElement("div");
    const movieId = movie.imdbID;
    console.log(movieId);
    movieDiv.id = movie.imdbID;
    movieDiv.classList.add("movie");

    movieDiv.innerHTML = `
    <h2>${movie.Title}</h2>
    <p>${movie.Year}</p>
    <img src="${movie.Poster}"/>
    <button onClick="addMovie(${movieId})">Add to Watchlist</button>
    `;
    resultsDiv.appendChild(movieDiv);
  }
}

function addMovie(movie) {
  console.log(movie.id);

  const api_url = "https://omdbapi.com/?apikey=4c3128ae&i=" + movie.id;

  fetch(api_url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/addMovie");
      xhr.setRequestHeader("Content-Type", "application/json");
      const payload = JSON.stringify(data);
      console.log("Payload: " + payload);
      xhr.send(payload);
    });
}

async function getListIds() {
  const response = await fetch("/getIds", { method: "GET" });
  const data = await response.json();
  return data[0].movies;
}
