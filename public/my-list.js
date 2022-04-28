async function displayUsers() {
  const response = await fetch("/getUsers", { method: "GET" });
  const data = await response.json();
  console.log(data);
  // for each user in data, create a button
  var resultsDiv = document.getElementById("results-div");
  for (let i = 0; i < data.length; i++) {
    // Make button for each user
    var button = document.createElement("button");
    button.innerHTML = data[i].identifier;
    button.classList.add("user-button");
    button.setAttribute(
      "onclick",
      `displayWatchList(\"${data[i].identifier}\")`
    );
    resultsDiv.appendChild(button);
  }
}

async function displayWatchList(identifier) {
  var userList = document.getElementById("user-list");
  userList.innerHTML = identifier;
  const response = await fetch("/getList?identifier=" + identifier, {
    method: "GET",
  });
  const data = await response.json();
  displayList(data[0].movies);
}

function displayList(movieArr) {
  const resultsDiv = document.getElementById("results-div");
  resultsDiv.innerHTML = "";
  for (let i = 0; i < movieArr.length; i++) {
    // Create div and append to parent
    const movie = movieArr[i];
    const movieDiv = document.createElement("div");
    movieDiv.id = movie.imdbID;
    movieDiv.classList.add("movie");

    movieDiv.innerHTML = `
        <h2>${movie.Title}</h2>
        <p>${movie.Year}</p>
        <img src="${movie.Poster}"/>
        `;
    resultsDiv.appendChild(movieDiv);
  }
}

displayUsers();
