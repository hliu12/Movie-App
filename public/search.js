var identifier = document.getElementById("identifier").value;

const button = document.getElementById("search-button");
button.addEventListener("click", getData);

async function getData() {
  var uinput = document.getElementById("identifier").value;
  identifier = uinput;
  if (identifier == "") {
    alert("Please enter a list name!");
    return;
  }
  console.log(identifier);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/identifier");
  xhr.setRequestHeader("Content-Type", "application/json");
  const payload = JSON.stringify({ identifier: uinput });
  // console.log("Payload" + payload);
  xhr.send(payload);

  const searchTerm = document.getElementById("search").value;
  const response = await fetch("/api?search=" + searchTerm, { method: "GET" });
  const data = await response.json();
  displayData(data);
}

async function displayData(data) {
  var searchTitle = document.getElementById("search-title");
  searchTitle.parentNode.removeChild(searchTitle);
  // add black background
  var formContainer = document.querySelector(".form-container");
  formContainer.style.backgroundColor = "black";

  // Change color to white
  var label1 = document.getElementById("label1");
  label1.style.color = "white";
  var label2 = document.getElementById("label2");
  label2.style.color = "white";

  var ids = await getListIds();
  const resultsDiv = document.getElementById("results-div");
  resultsDiv.innerHTML = "";

  if (data.Response == "False") {
    alert("No results found! Try another search.");
    return;
  }

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
      <button id="button${i}" class="remove-button" onclick="removeMovie('${movieId}', this.id)">Remove from Watchlist</button>
      `;
    } else {
      movieDiv.innerHTML = `
    <h2>${movie.Title}</h2>
    <p>${movie.Year}</p>
    <img src="${movie.Poster}"/>
    <button id="button${i}" class="add-button" onClick="addMovie(${movieId}, this.id)">Add to Watchlist</button>
    `;
    }
    resultsDiv.appendChild(movieDiv);
  }
}

function addMovie(movie, id) {
  if (typeof movie == "string") {
    console.log("movie is string");
    var movieId = movie;
  } else {
    var movieId = movie.id;
  }
  // console.log(movieId);
  // var movieId = movie.id;
  console.log(movieId);
  var button = document.getElementById(id);
  button.innerHTML = "Remove from Watchlist";
  button.classList.remove("add-button");
  button.classList.add("remove-button");
  button.removeEventListener("onclick", addMovie);
  button.setAttribute("onclick", `removeMovie('${movieId}', this.id)`);

  const api_url = "https://omdbapi.com/?apikey=4c3128ae&i=" + movieId;

  fetch(api_url)
    .then((res) => res.json())
    .then((data) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/addMovie");
      xhr.setRequestHeader("Content-Type", "application/json");
      var myData = Object.assign(data, { identifier: identifier });
      console.log(myData);
      const payload = JSON.stringify(myData);
      xhr.send(payload);
    });
}

function removeMovie(movieId, id) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/removeMovie");
  xhr.setRequestHeader("Content-Type", "application/json");
  const payload = JSON.stringify({ imdbID: movieId, identifier: identifier });
  console.log(payload);
  xhr.send(payload);

  var button = document.getElementById(id);
  button.innerHTML = "Add to Watchlist";
  button.classList.remove("remove-button");
  button.classList.add("add-button");
  button.removeEventListener("onclick", removeMovie);
  button.setAttribute("onclick", `addMovie('${movieId}', this.id)`);
}

async function getListIds() {
  // fetch from /getList with identifier
  const response = await fetch("/getList?identifier=" + identifier, {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);

  var ids = [];
  if (data.length > 0) {
    var movies = data[0].movies;
    for (let i = 0; i < movies.length; i++) {
      ids.push(movies[i].imdbID);
    }
  }
  console.log(ids);

  return ids;
}
