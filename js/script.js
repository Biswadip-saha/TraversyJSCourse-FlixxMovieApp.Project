// Global
const currentPage = document.location.pathname;

// Register your key at https://www.themoviedb.org/settings/api and enter here
// Only use this for development or very small projects. You should store your key and make requests from a server

const API_KEY = 'abc7c7b71610b585c6022c29a2446511';
const API_URL = 'https://api.themoviedb.org/3';

function getRelativePath() {
	let nodes = currentPage.split('/');
	return './' + nodes.pop();
}

const search = {
	term: '',
	type: '',
	page: 1,
	totalPages: 1,
	totalResults: 0,
};

// Higlight Link of current page

function highlightActiveLink() {
	const links = document.querySelectorAll('.nav-link');
	links.forEach((link) => {
		if (
			link.getAttribute('href') === getRelativePath() ||
			`${link.getAttribute('href')}index.html` === getRelativePath()
		) {
			link.classList.add('active');
		}
	});
}

// Fetch API Data

async function fetchAPIData(endpoint) {
	showSpinner();

	const response = await fetch(
		`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`
	);
	const data = await response.json();

	hideSpinner();

	return data;
}

async function searchAPIData() {
	showSpinner();

	const response = await fetch(
		`${API_URL}/search/${search.type}?api_key=${API_KEY}&language=en-US&query=${search.term}&page=${search.page}`
	);
	const data = await response.json();

	hideSpinner();

	return data;
}

// Homepage Popular movies

async function displayPopularMovies() {
	// Display top 20 popular movies at the time

	const { results } = await fetchAPIData('movie/popular');
	console.log(results);

	results.forEach((cardInfo) => {
		const div = document.createElement('div');
		div.classList.add('card');

		div.innerHTML = `
            <a href="movie-details.html?id=${cardInfo.id}">
                ${
					cardInfo.poster_path
						? `<img
                                src="https://image.tmdb.org/t/p/w500/${cardInfo.poster_path}"
                                class="card-img-top"
                                alt="${cardInfo.title}"
                            /> `
						: `<img
                                src="images/no-image.jpg"
                                class="card-img-top"
                                alt="${cardInfo.title}"
                            /> `
				}
            </a>
            <div class="card-body">
                <h5 class="card-title">${cardInfo.title}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${
						cardInfo.release_date
					}</small>
                </p>
            </div>`;
		document.querySelector('#popular-movies').appendChild(div);
	});
}

// Movie details

async function displayMovieDetails() {
	const movieId = document.location.search.split('=')[1];
	const movieData = await fetchAPIData(`movie/${movieId}`);

	// Backdrop

	displayBackdrop('movie', movieData.backdrop_path);

	// Details

	const div = document.createElement('div');
	div.innerHTML = `
        <div class="details-top">
			<div>
                ${
					movieData.poster_path
						? `<img
                                src="https://image.tmdb.org/t/p/w500/${movieData.poster_path}"
                                class="card-img-top"
                                alt="${movieData.title}"
                            /> `
						: `<img
                                src="images/no-image.jpg"
                                class="card-img-top"
                                alt="${movieData.title}"
                            /> `
				}
				</div>
				<div>
					<h2>${movieData.title}</h2>
					<p>
						<i class="fas fa-star text-primary"></i>
						${movieData.vote_average.toFixed(1)} / 10
					</p>
					<p class="text-muted">Release Date: ${movieData.release_date}</p>
					<p>
						${movieData.overview}
					</p>
					<h5>Genres</h5>
					<ul class="list-group">
						${movieData.genres
							.map((genre) => {
								return `<li>${genre.name}</li>`;
							})
							.join('')}
					</ul>
					<a href="${movieData.homepage}" target="_blank" class="btn"
						>Visit Movie Homepage</a
					>
				</div>
			</div>
			<div class="details-bottom">
				<h2>Movie Info</h2>
				<ul>
					<li>
						<span class="text-secondary">Budget:</span>
						$${addCommas(movieData.budget)}
					</li>
					<li>
						<span class="text-secondary">Revenue:</span>
						$${addCommas(movieData.revenue)}
					</li>
					<li>
						<span class="text-secondary">Runtime:</span> ${movieData.runtime} min
					</li>
					<li>
						<span class="text-secondary">Status:</span> ${movieData.status}
					</li>
				</ul>
				<h4>Production Companies</h4>
				<div class="list-group">
					${movieData.production_companies
						.map((company) => {
							return `<span>${company.name}</span>`;
						})
						.join(', ')}
				</div>
			</div>
    `;

	document.querySelector('#movie-details').appendChild(div);
}

// shows.html Popular shows

async function displayPopularShows() {
	// Display top 20 popular shows at the time

	const { results } = await fetchAPIData('tv/popular');
	console.log(results);

	results.forEach((cardInfo) => {
		const div = document.createElement('div');
		div.classList.add('card');

		div.innerHTML = `
            <a href="tv-details.html?id=${cardInfo.id}">
                ${
					cardInfo.poster_path
						? `<img
                                src="https://image.tmdb.org/t/p/w500/${cardInfo.poster_path}"
                                class="card-img-top"
                                alt="${cardInfo.name}"
                            /> `
						: `<img
                                src="images/no-image.jpg"
                                class="card-img-top"
                                alt="${cardInfo.name}"
                            /> `
				}
            </a>
            <div class="card-body">
                <h5 class="card-title">${cardInfo.name}</h5>
                <p class="card-text">
                    <small class="text-muted">Air Date: ${
						cardInfo.first_air_date
					}</small>
                </p>
            </div>`;
		document.querySelector('#popular-shows').appendChild(div);
	});
}

// Shows details

async function displayShowsDetails() {
	const showId = document.location.search.split('=')[1];
	const showData = await fetchAPIData(`tv/${showId}`);

	// Backdrop

	displayBackdrop('tv', showData.backdrop_path);

	// Details

	const div = document.createElement('div');
	div.innerHTML = `
        <div class="details-top">
			<div>
                ${
					showData.poster_path
						? `<img
                                src="https://image.tmdb.org/t/p/w500/${showData.poster_path}"
                                class="card-img-top"
                                alt="${showData.name}"
                            /> `
						: `<img
                                src="images/no-image.jpg"
                                class="card-img-top"
                                alt="${showData.name}"
                            /> `
				}
				</div>
				<div>
					<h2>${showData.name}</h2>
					<p>
						<i class="fas fa-star text-primary"></i>
						${showData.vote_average.toFixed(1)} / 10
					</p>
					<p class="text-muted">Air Date: ${showData.first_air_date}</p>
					<p>
						${showData.overview}
					</p>
					<h5>Genres</h5>
					<ul class="list-group">
						${showData.genres
							.map((genre) => {
								return `<li>${genre.name}</li>`;
							})
							.join('')}
					</ul>
					<a href="${showData.homepage}" target="_blank" class="btn"
						>Visit Movie Homepage</a
					>
				</div>
			</div>
			<div class="details-bottom">
				<h2>Movie Info</h2>
				<ul>
					<li>
						<span class="text-secondary">Number Of Episodes:</span>
                        ${showData.number_of_episodes}
					</li>
					<li>
						<span class="text-secondary">Last Episode To Air:</span>
						${showData.last_episode_to_air.name}
					</li>
					<li>
						<span class="text-secondary">Status:</span> ${showData.status}
					</li>
				</ul>
				<h4>Production Companies</h4>
				<div class="list-group">
					${showData.production_companies
						.map((company) => {
							return `<span>${company.name}</span>`;
						})
						.join(', ')}
				</div>
			</div>
    `;

	document.querySelector('#show-details').appendChild(div);
}

// search.html

async function searchDetails() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	search.type = urlParams.get('type');
	search.term = urlParams.get('search-term');

	if (search.term != '' && search.term != null) {
		const { results, total_pages, page, total_results } =
			await searchAPIData();

		search.totalResults = total_results;
		search.page = page;
		search.totalPages = total_pages;

		if (results.length == 0) {
			showAlert('No results found', 'alert-success');
			return;
		}

		displaySearchResults(results);

		document.querySelector('#search-term').value = '';
	} else {
		showAlert('Please enter a search item', 'alert-error');
	}
}

function displaySearchResults(results) {
	document.querySelector('#search-results').innerHTML = '';
	document.querySelector('#search-results-heading').innerHTML = '';
	document.querySelector('#pagination').innerHTML = '';

	results.forEach((cardInfo) => {
		const div = document.createElement('div');
		div.classList.add('card');

		div.innerHTML = `
            <a href="${search.type}-details.html?id=${cardInfo.id}">
                ${
					cardInfo.poster_path
						? `<img
                                src="https://image.tmdb.org/t/p/w500/${
									cardInfo.poster_path
								}"
                                class="card-img-top"
                                alt="${
									search.type == 'movie'
										? cardInfo.title
										: cardInfo.name
								}"
                            /> `
						: `<img
                                src="images/no-image.jpg"
                                class="card-img-top"
                                alt="${
									search.type == 'movie'
										? cardInfo.title
										: cardInfo.name
								}"
                            /> `
				}
            </a>
            <div class="card-body">
                <h5 class="card-title">${
					search.type == 'movie' ? cardInfo.title : cardInfo.name
				}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${
						search.type == 'movie'
							? cardInfo.release_date
							: cardInfo.first_air_date
					}</small>
                </p>
            </div>`;

		document.querySelector(
			'#search-results-heading'
		).innerHTML = `<h2>${results.length} of ${search.totalResults} Results for ${search.term}</h2>`;

		document.querySelector('#search-results').appendChild(div);
	});

	displayPagination();
}

// Backdrop

function displayBackdrop(type, path) {
	const overlay = document.createElement('div');

	overlay.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
	overlay.style.backgroundSize = 'cover';
	overlay.style.backgroundPosition = 'center';
	overlay.style.backgroundRepeat = 'no-repeat';
	overlay.style.height = '100vh';
	overlay.style.width = '100vw';
	overlay.style.position = 'absolute';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.zIndex = '-1';
	overlay.style.opacity = '0.1';

	if (type === 'movie') {
		document.querySelector('#movie-details').appendChild(overlay);
	} else if (type === 'tv') {
		document.querySelector('#show-details').appendChild(overlay);
	}
}

// Slider

async function displaySlider() {
	const { results } = await fetchAPIData('movie/now_playing');

	results.forEach((movie) => {
		const div = document.createElement('div');

		div.classList.add('swiper-slide');
		div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
			<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
			alt="${movie.title}"
			/>
		</a>
		<h4 class="swiper-rating">
		    <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
		</h4>
        `;

		document.querySelector('.swiper-wrapper').appendChild(div);

		initSwiper();
	});
}

function initSwiper() {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 2000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
		},
	});
}

// Pagination

function displayPagination() {
	const div = document.createElement('div');
	div.classList.add('pagination');
	div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${search.page} of ${search.totalPages}</div>
    `;

	document.querySelector('#pagination').appendChild(div);

	if (search.page == 1) {
		document.querySelector('#prev').disabled = true;
	} else if (search.page == search.totalPages) {
		document.querySelector('#next').disabled = true;
	}

	document.querySelector('#next').addEventListener('click', async () => {
		search.page++;
		const { results, total_pages } = await searchAPIData();
		displaySearchResults(results);
	});

	document.querySelector('#prev').addEventListener('click', async () => {
		search.page--;
		const { results, total_pages } = await searchAPIData();
		displaySearchResults(results);
	});
}

// Spinner

function showSpinner() {
	document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
	document.querySelector('.spinner').classList.remove('show');
}

// Alert

function showAlert(message, className) {
	const alertElement = document.createElement('div');

	alertElement.classList.add('alert', className);
	alertElement.appendChild(document.createTextNode(message));

	document.querySelector('#alert').appendChild(alertElement);

	setTimeout(() => {
		return alertElement.remove();
	}, 4000);
}

// Add Commas

function addCommas(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Start App

function init() {
	switch (getRelativePath()) {
		case './':
		case './index.html':
			displaySlider();
			displayPopularMovies();
			break;
		case './search.html':
			searchDetails();
			break;
		case './shows.html':
			displayPopularShows();
			break;
		case './tv-details.html':
			displayShowsDetails();
			break;
		case './movie-details.html':
			displayMovieDetails();
			break;
	}

	highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
