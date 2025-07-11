const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'
const supabase = createClient(supabaseUrl, supabaseKey)
// Sve gore je povezivanje sa Supabase

// funkcija za dobijanje logaklnog vremena
function getLocalTimestamp() {
  const date = new Date();
  return date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, '0') + "-" +
    String(date.getDate()).padStart(2, '0') + "T" +
    String(date.getHours()).padStart(2, '0') + ":" +
    String(date.getMinutes()).padStart(2, '0') + ":" +
    String(date.getSeconds()).padStart(2, '0');
}


let { data: movies, error } = await supabase
  .from('movies')
  .select(`
    id,
    title,
    poster_url,
    release_date,
    movie_genres (
      genres (
        name
      )
    ),
    screenings (
      start_time,
      halls (
        cinema_id,
        cinemas (
          name
        )
      )
    )
  `)
  .gte('screenings.start_time', getLocalTimestamp()) // filtrira samo buduće projekcije
  .order('release_date', { ascending: false });

// mora ovo jer ce ovo spajanje tabela svakako da vrati filmove koji imaju zastarele projekcije, tu ce da bude null u to ugnjezdeno al film ce biti vracen
movies = movies.filter(movie => movie.screenings.length > 0);

const sizeInBytes = new Blob([JSON.stringify(movies)]).size;
console.log(`movies zauzima oko ${(sizeInBytes / 1024).toFixed(2)} KB`);

console.log(movies);


// Funkcija koja filtrira filmove
function filterMovies(movies, selectedCinema, selectedGenres, selectedDate, searchQuery) {
  return movies.filter(movie => {
    // Provera da li film ima bar jednu projekciju u izabranom bioskopu
    const matchCinema = selectedCinema
      ? movie.screenings.some(screening => screening.halls.cinemas.name === selectedCinema)
      : true;

    // Provera da li film ima bar jedan žanr koji je izabran
    const matchGenre = selectedGenres.length > 0
      ? movie.movie_genres.some(g => selectedGenres.includes(g.genres.name))
      : true;

    // Provera da li film ima bar jednu projekciju na izabrani datum
    const matchDate = selectedDate
      ? movie.screenings.some(screening =>
          new Date(screening.start_time).toDateString() === new Date(selectedDate).toDateString()
        )
      : true;

    // Pretraga po naslovu
    const matchSearch = searchQuery
      ? movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchCinema && matchGenre && matchDate && matchSearch;
  });
}

const moviesContainer = document.querySelector(".c-movies-grid");
const noMoviesMessage = document.querySelector(".c-no-movies-message");
moviesContainer.classList.add("transition");
noMoviesMessage.classList.add("transition");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// funkcija za renderovanje filmova
async function updateMovies(moviesToShow, selectedCinema, selectedDate, callback) {

    // helper funkcija da ne ponavljamo kod u funkciji
    function renderMovies(moviesToRender){
        // Prikaži filmove
        moviesContainer.innerHTML = "";
        moviesToRender.forEach((movie) => {
          const movieLink = document.createElement("a");
          movieLink.classList.add("c-movie-link");
          
          // Osnova linka — uzima se iz trenutnog domena
          const baseUrl = window.location.origin;
          
          // Pravimo URL objekat
          let href;
          
          // Sve 4 kombinacije
          if (selectedCinema === '' && selectedDate === '') {
            href = new URL("/cinema/cinemas", baseUrl);
            href.searchParams.set("movie_id", movie.id);
          } else if (selectedCinema !== '' && selectedDate === '') {
            href = new URL("/cinema/movie", baseUrl);
            href.searchParams.set("movie_id", movie.id);
            href.searchParams.set("cinema", selectedCinema);
          } else if (selectedCinema === '' && selectedDate !== '') {
            href = new URL("/cinema/cinemas", baseUrl);
            href.searchParams.set("movie_id", movie.id);
            href.searchParams.set("date", selectedDate);
          } else {
            // oba selektovana
            href = new URL("/cinema/movie", baseUrl);
            href.searchParams.set("movie_id", movie.id);
            href.searchParams.set("cinema", selectedCinema);
            href.searchParams.set("date", selectedDate);
          }
          
          // Postavljanje href-a
          movieLink.href = href.toString();
  
          const image = document.createElement("img");
          image.src = movie.poster_url;
          image.alt = movie.title;
          image.className = "c-movie-listing-image";

          const movieDetails = document.createElement("div");
          movieDetails.className = "c-movie-cell-details";
          
          const title = document.createElement("h3");
          title.className = "c-title-for-listed-movies";
          title.textContent = movie.title;

          const genres = document.createElement("div");
          genres.className = "c-cell-genres";
          genres.innerText = movie.movie_genres.map(item => item.genres.name).join(', ');

          movieDetails.appendChild(title);
          movieDetails.appendChild(genres);
  
          movieLink.appendChild(image);
          movieLink.appendChild(movieDetails);
          moviesContainer.appendChild(movieLink);
      });
    }

    // ovde pocinje real funkcija
  const hasMovies = moviesToShow.length > 0;
  const messageVisible = noMoviesMessage.style.display !== "none";

  if (hasMovies) {
    if (messageVisible) {
      // kada ima filmova, a pre toga nije imalo filmova
      noMoviesMessage.style.opacity = "0";
      await sleep(300);
      noMoviesMessage.style.display = "none";
      renderMovies(moviesToShow);
      moviesContainer.style.display = "grid";
        // moramo staviti ovu funkciju jer bez nje nema animacije, bez obzira sto je pre toga bio opacity 0 kad se od display none samo nesto pojavi nema animacije, mora da se stavi ovo
          requestAnimationFrame(() => {
            moviesContainer.style.opacity = "1";
          });
     await sleep(300);
        
    } else {
      // kada ima filmova, a pre toga je imalo filmova
      moviesContainer.style.opacity = "0";
      await sleep(300);
      renderMovies(moviesToShow);
      moviesContainer.style.opacity = "1";
      await sleep(300);
    }

  } else {
    // kada nema filmova
      moviesContainer.style.opacity = "0";
      await sleep(300);
      moviesContainer.style.display = "none";
      noMoviesMessage.style.display = "flex";
         // moramo staviti ovu funkciju jer bez nje nema animacije, bez obzira sto je pre toga bio opacity 0 kad se od display none samo nesto pojavi nema animacije, mora da se stavi ovo
          requestAnimationFrame(() => {
            noMoviesMessage.style.opacity = "1";
          });
     await sleep(300);
  }
  if (typeof callback === 'function') {
    callback();
  }
}


// Funkcija za izvlacenje bioskopa
function extractCinemas(movies) {
  const cinemasSet = new Set();

  movies.forEach(movie => {
    movie.screenings.forEach(screening => {
      const cinemaName = screening.halls.cinemas.name;
      if (cinemaName) {
        cinemasSet.add(cinemaName);
      }
    });
  });

  return Array.from(cinemasSet).sort();
}

let cinemas = extractCinemas(movies);
console.log(cinemas);


// Funkcija za izvlacenje zanrova
function extractGenres(movies) {
  const genresSet = new Set();

  movies.forEach(movie => {
    movie.movie_genres.forEach(genreObj => {
      genresSet.add(genreObj.genres.name);
    });
  });

  return Array.from(genresSet).sort();
}


let genres = extractGenres(movies);
console.log(genres);


// Funkcija za izvlacenje datuma
function extractDates(movies) {
  const datesSet = new Set();

  movies.forEach(movie => {
    movie.screenings.forEach(screening => {
      const dateStr = new Date(screening.start_time).toDateString();
      datesSet.add(dateStr);
    });
  });

  return Array.from(datesSet).sort((a, b) => new Date(a) - new Date(b));
}

let dates = extractDates(movies);
console.log(dates);


// Hvatanje dropdown elemenata
const dropdownCinema = document.querySelector('#dropdown-cinema');
const dropdownGenre = document.querySelector('#dropdown-genre');
const dropdownDate = document.querySelector('#dropdown-date');
const toggleCinemaDropdown = dropdownCinema.querySelector('.c-dropdown-toggle');
const toggleGenreDropdown = dropdownGenre.querySelector('.c-dropdown-toggle');
const toggleDateDropdown = dropdownDate.querySelector('.c-dropdown-toggle');
const dropdownListCinemas = dropdownCinema.querySelector('.c-dropdown-list');
const dropdownListGenres = dropdownGenre.querySelector('.c-dropdown-list');
const dropdownListDates = dropdownDate.querySelector('.c-dropdown-list');
const dropdownCinemaText = document.querySelector('#dropdown-cinema-text');
const dropdownGenreText = document.querySelector('#dropdown-genre-text');
const dropdownDateText = document.querySelector('#dropdown-date-text');


  // funkcija za punjenje jednog dropdowna
  function populateList(listElement, items, attributeName) {
  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('c-dropdown-list-element');
    div.setAttribute(attributeName, item);

    // Ako je atribut datum, formatiraj prikaz
    if (attributeName === 'data-date') {
      const parts = item.split(' '); // ["Mon", "May", "12", "2025"]
      const firstLine = parts.slice(0, 3).join(' '); // "Mon May 12"
      const secondLine = parts[3]; // "2025"
      div.innerHTML = `${firstLine}<br>${secondLine}`;
    } else {
      div.textContent = item;
    }

    listElement.appendChild(div);
  });
}

  // Puni sva 3 dropdowna
  populateList(dropdownListCinemas, cinemas, 'data-cinema');
  populateList(dropdownListGenres, genres, 'data-genre');
  populateList(dropdownListDates, dates, 'data-date');


// Globalne promenljive za selektovane vrednosti
let selectedCinema = '';
let selectedGenres = [];
let selectedDate = '';
let searchQuery = '';


// ako je izabran bioskop na cinemas stranici odradi filtere po njemu
const urlParams = new URLSearchParams(window.location.search);
const cinemaParam = urlParams.get('cinema');

if (cinemaParam) {
  selectedCinema = decodeURIComponent(cinemaParam);
  dropdownCinemaText.textContent = cinemaParam;
  dropdownListCinemas.querySelector('.c-dropdown-list-element:not([data-cinema])').classList.remove('c-dropdown-list-element-selected');
  dropdownListCinemas.querySelector(`.c-dropdown-list-element[data-cinema="${cinemaParam}"]`).classList.add('c-dropdown-list-element-selected');
}


// Renderovanje filmova pri ucitavanju stranica
let filteredMovies = filterMovies(movies, selectedCinema, selectedGenres, selectedDate, searchQuery);

if (cinemaParam) {
  updateMovies(filteredMovies, selectedCinema, selectedDate, () => {
    // Skroluj kad se filmovi renderuju
    document.querySelector('.c-slider-button').click(); // simuliraj kliktanje na dugme view all movies, postepeniji odlazak na section nego ovo dole
    // document.getElementById('filters').scrollIntoView({ behavior: 'smooth' });
  }); 
}
else
  updateMovies(filteredMovies, selectedCinema, selectedDate);


// Funkcija za prikazivanje i skrivanje dropdowna kad se klikne na toggle div
function toggleDropdown(dropdownList) {
  const isVisible = dropdownList.style.display === 'block';
  dropdownList.style.display = isVisible ? 'none' : 'block';
}


// Listeneri za svaki toggle od 3 dropdowna
toggleCinemaDropdown.addEventListener('click', () => {
  toggleDropdown(dropdownListCinemas);
});

toggleGenreDropdown.addEventListener('click', () => {
  toggleDropdown(dropdownListGenres);
});

toggleDateDropdown.addEventListener('click', () => {
  toggleDropdown(dropdownListDates);
});


// Listener za zatvaranje dropdownova kad se klikne van njih
document.addEventListener('click', (e) => {
  // Zatvori cinema dropdown ako klik nije unutar njega
  if (!dropdownCinema.contains(e.target)) {
    dropdownListCinemas.style.display = 'none';
  }

  // Zatvori genre dropdown ako klik nije unutar njega
  if (!dropdownGenre.contains(e.target)) {
    dropdownListGenres.style.display = 'none';
  }

  // Zatvori date dropdown ako klik nije unutar njega
  if (!dropdownDate.contains(e.target)) {
    dropdownListDates.style.display = 'none';
  }
});


const searchInput = document.querySelector(".c-search-bar-for-movies");
const resetFilters = document.querySelector(".c-reset-filters");

// Search listener
searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim(); // može i .toLowerCase() ovde ako želiš odmah da normalizuješ
  filteredMovies = filterMovies(movies, selectedCinema, selectedGenres, selectedDate, searchQuery);
  updateMovies(filteredMovies, selectedCinema, selectedDate);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // sprečava submit forme
  }
});


// event listener za resetovanje filtera
resetFilters.addEventListener('click', () => {
    selectedCinema = '';
    selectedGenres = [];
    selectedDate = '';
    searchQuery = '';
    filteredMovies = filterMovies(movies, selectedCinema, selectedGenres, selectedDate, searchQuery);
    updateMovies(filteredMovies, selectedCinema, selectedDate);
    searchInput.value='';
    
    dropdownCinemaText.textContent = 'All cinemas';
    let allElements = dropdownListCinemas.querySelectorAll('.c-dropdown-list-element');
    allElements.forEach(el => el.classList.remove('c-dropdown-list-element-selected'));
    dropdownListCinemas.querySelector('.c-dropdown-list-element:not([data-cinema])').classList.add('c-dropdown-list-element-selected');
    
    dropdownGenreText.textContent = 'All genres';
    allElements = dropdownListGenres.querySelectorAll('.c-dropdown-list-element');
    allElements.forEach(el => el.classList.remove('c-dropdown-list-element-selected'));
    dropdownListGenres.querySelector('.c-dropdown-list-element:not([data-genre])').classList.add('c-dropdown-list-element-selected');
    
    dropdownDateText.textContent = 'All dates';
    allElements = dropdownListDates.querySelectorAll('.c-dropdown-list-element');
    allElements.forEach(el => el.classList.remove('c-dropdown-list-element-selected'));
    dropdownListDates.querySelector('.c-dropdown-list-element:not([data-date])').classList.add('c-dropdown-list-element-selected');
});

// Listener za cinema dropdown elemente
dropdownListCinemas.addEventListener('click', (e) => {
  const target = e.target.closest('.c-dropdown-list-element');
  if (!target) return;

  // Zatvori dropdown
  dropdownListCinemas.style.display = 'none';

  // Ukloni selekciju sa svih
  const allElements = dropdownListCinemas.querySelectorAll('.c-dropdown-list-element');
  allElements.forEach(el => el.classList.remove('c-dropdown-list-element-selected'));

  // Dodaj selekciju na kliknutog
  target.classList.add('c-dropdown-list-element-selected');

  // Preuzmi vrednost
  const value = target.getAttribute('data-cinema');

  if (value) {
    selectedCinema = value;
    dropdownCinemaText.textContent = value;
  } else {
    selectedCinema = '';
    dropdownCinemaText.textContent = 'All cinemas';
  }

    filteredMovies = filterMovies(movies, selectedCinema, selectedGenres, selectedDate, searchQuery);
    updateMovies(filteredMovies, selectedCinema, selectedDate);
});

// Listener za date dropdown elemente
dropdownListDates.addEventListener('click', (e) => {
  const target = e.target.closest('.c-dropdown-list-element');
  if (!target) return;

  // Zatvori dropdown
  dropdownListDates.style.display = 'none';

  // Ukloni selekciju sa svih
  const allElements = dropdownListDates.querySelectorAll('.c-dropdown-list-element');
  allElements.forEach(el => el.classList.remove('c-dropdown-list-element-selected'));

  // Dodaj selekciju na kliknutog
  target.classList.add('c-dropdown-list-element-selected');

  // Preuzmi vrednost
  const value = target.getAttribute('data-date');

  if (value) {
    selectedDate = value;
    dropdownDateText.textContent = value;
  } else {
    selectedDate = '';
    dropdownDateText.textContent = 'All dates';
  }

    filteredMovies = filterMovies(movies, selectedCinema, selectedGenres, selectedDate, searchQuery);
    updateMovies(filteredMovies, selectedCinema, selectedDate);
});


// Listener za genre dropdown elemente
dropdownListGenres.addEventListener('click', (e) => {
  const target = e.target.closest('.c-dropdown-list-element');
  if (!target) return;

  // Zatvori dropdown
  dropdownListGenres.style.display = 'none';
    
  const value = target.getAttribute('data-genre');

  // Ako je kliknuto na "All genres" (nema data-genre atribut)
  if (!value) {
    // Očisti selektovane žanrove i klasama ukloni selekciju sa svih
    selectedGenres = [];

    const allElements = dropdownListGenres.querySelectorAll('.c-dropdown-list-element');
    allElements.forEach(el => el.classList.remove('c-dropdown-list-element-selected'));

    // Dodaj selekciju na "All genres"
    target.classList.add('c-dropdown-list-element-selected');

    dropdownGenreText.textContent = 'All genres';

  } else {
    const index = selectedGenres.indexOf(value);

    if (index > -1) {
      // Ako je već selektovan, deselectuj ga
      selectedGenres.splice(index, 1);
      target.classList.remove('c-dropdown-list-element-selected');
    } else {
      // Inače dodaj ga u selektovane
      selectedGenres.push(value);
      target.classList.add('c-dropdown-list-element-selected');
    }

    const allGenresCount = genres.length;

    // Ako su svi žanrovi selektovani => tretiraj kao da je kliknuto na "All genres"
    if (selectedGenres.length === allGenresCount) {
      selectedGenres = [];

      const allElements = dropdownListGenres.querySelectorAll('.c-dropdown-list-element');
      allElements.forEach(el => el.classList.remove('c-dropdown-list-element-selected'));

      // Selektuj "All genres" opciju
      const allGenresOption = dropdownListGenres.querySelector('.c-dropdown-list-element:not([data-genre])');
      if (allGenresOption) {
        allGenresOption.classList.add('c-dropdown-list-element-selected');
      }

      dropdownGenreText.textContent = 'All genres';

    } else if (selectedGenres.length === 0) {
      // Ako ništa nije selektovano, isto kao "All genres"
      dropdownGenreText.textContent = 'All genres';

      const allGenresOption = dropdownListGenres.querySelector('.c-dropdown-list-element:not([data-genre])');
      if (allGenresOption) {
        allGenresOption.classList.add('c-dropdown-list-element-selected');
      }

    } else {
      // Inače prikaži broj selektovanih
      dropdownGenreText.textContent = `${selectedGenres.length} selected`;

      // Ukloni selekciju sa "All genres"
      const allGenresOption = dropdownListGenres.querySelector('.c-dropdown-list-element:not([data-genre])');
      if (allGenresOption) {
        allGenresOption.classList.remove('c-dropdown-list-element-selected');
      }
    }
  }

  // Filtriraj i renderuj filmove
  filteredMovies = filterMovies(movies, selectedCinema, selectedGenres, selectedDate, searchQuery);
  updateMovies(filteredMovies, selectedCinema, selectedDate);
});
