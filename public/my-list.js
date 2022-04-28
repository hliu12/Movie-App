async function displayWatchList() {
  const response = await fetch("/getList", { method: "GET" });
  const data = await response.json();
  console.log(data);
  if (data.length > 0) {
    displayList(data[0].movies);
  }
}

function displayList(movieArr) {
  const resultsDiv = document.getElementById("results-div");
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

displayWatchList();
