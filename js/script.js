const movieContainer = document.querySelector('.movie-container');
const searchButton = document.querySelector('#search-button');
searchButton.addEventListener('click', async function () {
    try {
        const inputKeyword = document.querySelector('#search-input');
        const movies = await getMovies(inputKeyword.value);
        updateUi(movies);
    }
    catch (err) {
        let errorMesseage = String(err);
        let eMesseage = errorMesseage.substring(6);
        let bodyError = `
            <div class = "col-md-12 text-center text-danger display-2">${eMesseage}</div>
        
        `;
        movieContainer.innerHTML = bodyError;

    }


});

// event binding ketika tombol detail di clck

document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('modal-detail-button')) {
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid);
        updateUiDetail(movieDetail);
    }
});
// funtion to get movie detail while search button on click
function getMovies(keyword) {
    return fetch('http://www.omdbapi.com?apikey=d6751eb5&s=' + keyword)
        .then(result => {
            if (!result.ok) {
                throw new Error(result.statusText);
            }
            return result.json();
        })
        .then(result => {
            if (result.Response === 'False') {
                throw new Error(result.Error);
            }
            return result.Search;

        })

}

// function to get movie details
function getMovieDetail(imdbid) {
    return fetch('http://www.omdbapi.com?apikey=d6751eb5&i=' + imdbid)
        .then(result => result.json())
        .then(result => result)
}

// funtion for update modal UI
function updateUiDetail(movieDetail) {
    const movieDetails = showMovieDetail(movieDetail);
    const modalBody = document.querySelector('.modal-movies');
    modalBody.innerHTML = movieDetails;
}

// funtion to update UI
function updateUi(movies) {
    let cards = '';
    movies.forEach(movie => {
        cards += showCards(movie);

    });
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;

}

// funtion for showcards
function showCards(movie) {
    return `
    <div class="col-md-4 mt-2">
        <div class="card" style="width: 18rem">
            <img src="${movie.Poster}" class="card-img-top" alt="Image Not Found" />
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
                <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${movie.imdbID}">Show Details</a>
            </div>
        </div>
    </div>`;
}
// funtion for showing movie detail on modal box
function showMovieDetail(movie) {
    return `
    <div class="col-md-3">
        <img src=${movie.Poster} alt="img not found" class="img-fluid" />
    </div>
    <div class="col-md">
        <ul class="list-group">
            <li class="list-group-item">Title : ${movie.Title}</li>
            <li class="list-group-item">Directors : ${movie.Director}</li>
            <li class="list-group-item">Actors : ${movie.Actors}</li>
            <li class="list-group-item">Writter : ${movie.Writer}</li>
            <li class="list-group-item">Genre : ${movie.Genre}</li>
        </ul>
    </div>
`;
}