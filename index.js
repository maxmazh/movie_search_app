const POPUP_OPENED_CLASSNAME = 'popup_open';

const films = [];

const btnMovie = document.querySelector('.js_movie_btn');
const movieInput = document.querySelector('.js_movie_input');
const filmNode = document.querySelector('.js_list_films');

const popupNode = document.querySelector('.js_popup');
// const btnOpenNode = document.querySelector('.js_list_films');
const popupContentNode = document.querySelector('.js_popup_content');
const btnCloseNode = document.querySelector('.js_popup_close');

const detailsContent = document.querySelector('.js_film_details_container');
// const container = document.querySelector('.js_film_details_container');

function searchFetch() {
    const queryMovie = movieInput.value.trim();

    if (!queryMovie) {
        alert('Введите название фильма!');
        return;
    }

    const encodedQuery = encodeURIComponent(queryMovie);

    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=f4126de&s=${encodedQuery}`)
        .then(response =>  response.json())
        .then((res) => {

            if (res.Response === 'False') {
                filmNode.innerHTML = '<p class="empty">Фильмы не найдены</p>';
                return;
            }

            films.length = 0;
            res.Search.forEach(film => addFilm(film));

            renderFilms();
        })

        .catch(error => {
            console.error('❌ Ошибка:', error);
            filmNode.innerHTML = `<p class="error">❌ Ошибка загрузки: ${error.message}</p>`;
        })
};

function renderFilms() {
    filmNode.innerHTML = '';

    films.forEach((film, index) => {

        const div = document.createElement('div');
        div.className = 'film_list';

        const posterWrapper = document.createElement('div');
        posterWrapper.className = 'film_poster_wrapper';

        const img = document.createElement('img');
        img.className = 'film_poster';
        img.src = film.img;
        img.alt = film.title;

        posterWrapper.appendChild(img);

        const info = document.createElement('div');
        info.className = 'info';

        const title = document.createElement('p');
        title.className = 'film__title';
        title.textContent = film.title;

        const year = document.createElement('p');
        year.className = 'film__year';
        year.textContent = film.year;

        const type = document.createElement('p');
        type.className = 'film__type';
        type.textContent = film.type;

        info.append(title, year, type);

        div.addEventListener('click', async function() {
            await openFilmDetails(index);
            togglePopup();
        });

        div.append(posterWrapper, info);
        filmNode.appendChild(div);
    });
}

function addFilm(apiFilm) {
    films.push({
        title: apiFilm.Title,
        year: apiFilm.Year,
        type: apiFilm.Type,
        img: apiFilm.Poster,
        imdbID: apiFilm.imdbID
    });
}

async function openFilmDetails(index) {
    const film = films[index];
    
    if (!film) {
        console.error('Фильм не найден');
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=f4126de&i=${film.imdbID}&plot=full`);
        const data = await response.json();

        if (data.Response === 'False') {
            detailsContent.innerHTML = `<p class="error">❌ ${data.Error}</p>`;
            return;
        }

        renderFilmDetails(data);

    } catch (error) {
        console.error('❌ Ошибка загрузки деталей:', error);
        detailsContent.innerHTML = `<p class="error">❌ Ошибка загрузки: ${error.message}</p>`;
    }
}

function renderFilmDetails(film) {
    const structure = document.getElementById('filmDetailsStructure');

    const clone = structure.content.cloneNode(true);

    const poster = clone.querySelector('.img_popup_film_poster');

    if (film.Poster !== 'N/A') {
        poster.src = film.Poster;
        poster.alt = film.Title;
    } else {
        poster.alt = 'Постер не найден';
        poster.style.display = 'none';

        const wrapper = clone.querySelector('.popup_film_poster');
        wrapper.innerHTML = '<div style="font-size: 80px; padding: 20px;">🎬</div>';
    }

    clone.querySelector('.popup_film_title').textContent = film.Title || 'Н/Д';
    clone.querySelector('.popup_film_year_value').textContent = film.Year || 'Н/Д';
    clone.querySelector('.popup_film_rated_value').textContent = film.Rated || 'Н/Д';

    clone.querySelector('.popup_film_realease_value').textContent = film.Released || 'Н/Д';
    clone.querySelector('.popup_film_runtime_value').textContent = film.Runtime || 'Н/Д';
    clone.querySelector('.popup_film_genre_value').textContent = film.Genre || 'Н/Д';
    clone.querySelector('.popup_film_director_value').textContent = film.Director || 'Н/Д';
    clone.querySelector('.popup_film_writer_value').textContent = film.Writer || 'Н/Д';
    clone.querySelector('.popup_film_actors_value').textContent = film.Actors || 'Н/Д';

    clone.querySelector('.popup_film_plot').textContent = film.Plot || 'Н/Д';



    // clone.querySelector('.film-details__director').textContent = film.Director || 'Н/Д';
    // clone.querySelector('.film-details__actors').textContent = film.Actors || 'Н/Д';
    // clone.querySelector('.film-details__rating').textContent = film.imdbRating || 'Н/Д';
    // clone.querySelector('.film-details__country').textContent = film.Country || 'Н/Д';
    // clone.querySelector('.film-details__language').textContent = film.Language || 'Н/Д';
    // clone.querySelector('.film-details__awards').textContent = film.Awards || 'Н/Д';
    
    // const imdb = clone.querySelector('.film-details__imdb-id');
    // if (film.imdbID) {
    //     imdb.textContent = `🔗 imdbID: ${film.imdbID}`;
    // } else {
    //     imdb.style.display = 'none';
    // }
    
    detailsContent.innerHTML = '';
    detailsContent.appendChild(clone);
}

btnMovie.addEventListener('click', function() {
    searchFetch();
});

movieInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        btnMovie.click();
    }
});

function togglePopup() {
    popupNode.classList.toggle(POPUP_OPENED_CLASSNAME);
}

popupNode.addEventListener('click', (event) => {
    const isClickOutsideContent = !event.composedPath().includes(popupContentNode)

    if (isClickOutsideContent) {
        togglePopup();
    }
})

// btnOpenNode.addEventListener('click', togglePopup);
btnCloseNode.addEventListener('click', togglePopup);