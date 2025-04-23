const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')

const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'

const supabase = createClient(supabaseUrl, supabaseKey)

// Sve gore je povezivanje sa Supabase

const today = new Date().toISOString();

// Prikupljanje filmova i ostalih podataka

let { data: movies, error } = await supabase
  .from('movies')
  .select(`
    id,
    title,
    poster_url,
    movie_genres (
      genres (
        name
      )
    ),
    screenings (
      start_time,
      halls (
        cinemas (
          name
        )
      )
    )
  `)
  .gte('screenings.start_time', today);


if (error) {
    console.error("Greška pri dohvatanju filmova:", error);
  }

const moviesContainer = document.querySelector(".c-container-for-listing-movies");

function renderMovies(moviesToShow) {
  // FADE OUT
  moviesContainer.classList.add("fade-out");

  setTimeout(() => {
    // Očisti stare filmove
    moviesContainer.innerHTML = "";

    // Dodaj nove
    moviesToShow.forEach((movie) => {
      const movieDiv = document.createElement("div");

      const image = document.createElement("img");
      image.src = movie.poster_url;
      image.alt = movie.title;
      image.className = "c-movie-listing-image";

      const title = document.createElement("h2");
      title.className = "c-title-for-listed-movies";
      title.textContent = movie.title;

      movieDiv.appendChild(image);
      movieDiv.appendChild(title);

      moviesContainer.appendChild(movieDiv);
    });

    // FADE IN
    moviesContainer.classList.remove("fade-out");
    moviesContainer.classList.add("fade-in");

    // Ukloni fade-in klasu posle animacije da bi moglo opet da se koristi
    setTimeout(() => {
      moviesContainer.classList.remove("fade-in");
    }, 300);
  }, 300); // trajanje fade-out mora da se poklopi sa transition u CSS-u
}


// Renderovanje filmova
renderMovies(movies);


// Izvuci bioskope
const cinemasSet = new Set();

movies.forEach(movie => {
  movie.screenings.forEach(screening => {
    const cinemaName = screening.halls?.cinemas?.name;
    if (cinemaName) {
      cinemasSet.add(cinemaName);
    }
  });
});

const uniqueCinemas = Array.from(cinemasSet);

// Izvuci zanrove

const genresSet = new Set();

movies.forEach(movie => {
  movie.movie_genres.forEach(mg => {
    const genreName = mg.genres?.name;
    if (genreName) {
      genresSet.add(genreName);
    }
  });
});

const uniqueGenres = Array.from(genresSet);

//Izvuci datume

const datesSet = new Set();

movies.forEach(movie => {
  movie.screenings.forEach(screening => {
    const startTime = screening.start_time;
    if (startTime) {
      const dateOnly = new Date(startTime).toISOString().split('T')[0]; // 'YYYY-MM-DD'
      datesSet.add(dateOnly);
    }
  });
});

const uniqueDates = Array.from(datesSet).sort(); // sortiramo da bude pregledno


// Hvatanje dropdown elemenata

const dropdownCinema = document.querySelector('#dropdown-cinema');
const dropdownGenre = document.querySelector('#dropdown-genre');
const dropdownDate = document.querySelector('#dropdown-date');
const dropdownListCinemas = dropdownCinema.querySelector('.c-dropdown-list');
const dropdownListGenres = dropdownGenre.querySelector('.c-dropdown-list');
const dropdownListDates = dropdownDate.querySelector('.c-dropdown-list');


// Punjenje dropdowna za bioskope

uniqueCinemas.forEach(cinema => {
  const div = document.createElement('div');
  div.classList.add('c-dropdown-list-element');
  div.setAttribute('data-cinema', cinema);
  div.textContent = cinema;

  dropdownListCinemas.appendChild(div);
});

// Punjenje dropdowna za zanrove

uniqueGenres.forEach(genre => {
  const div = document.createElement('div');
  div.classList.add('c-dropdown-list-element');
  div.setAttribute('data-genre', genre);
  div.textContent = genre;

  dropdownListGenres.appendChild(div);
});

// Punjenje dropdowna za datume

uniqueDates.forEach(date => {
  const div = document.createElement('div');
  div.classList.add('c-dropdown-list-element');
  div.setAttribute('data-date', date);
  const rawDate = new Date(date);
  const formattedDate = rawDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  div.textContent = formattedDate;
  dropdownListDates.appendChild(div);
});

// Promenljive koje ce pamtiti sta je selektovano jer imamo vise uslova

let selectedCinema = null;
let selectedGenres = [];
let selectedDate = null;

// Funkcija za animiranje dropdowna i animiranje sta je selektovano u njemu koja poziva drugu funkciju koja se prinosi kao parametar koja ustvari pokazuje sta se drugacije radi u odnosu na selektovan dropdown

function setupDropdown(dropdownId, onSelectCallback) {
  const dropdown = document.querySelector(`#${dropdownId}`);
  const toggle = dropdown.querySelector('.c-dropdown-toggle');
  const list = dropdown.querySelector('.c-dropdown-list');
  const items = list.querySelectorAll('.c-dropdown-list-element');

  // Toggle open/close
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  });

  // Click outside closes dropdown
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      list.style.display = 'none';
    }
  });

  // Item click
  items.forEach(item => {
    item.addEventListener('click', () => {
      // Ukloni selekciju sa svih
      items.forEach(i => i.classList.remove('c-dropdown-list-element-selected'));
      // Selektuj kliknuti
      item.classList.add('c-dropdown-list-element-selected');
      // Zatvori dropdown
      list.style.display = 'none';

      // Callback funkcija (setovanje globalne promenljive + filtriranje)
      onSelectCallback(item);
    });
  });
}

// Funkcija za filtriranje filmova

function applyFilters() {
  let filtered = movies;

  if (selectedCinema) {
    filtered = filtered.filter(movie =>
      movie.screenings.some(screening =>
        screening.halls?.cinemas?.name === selectedCinema
      )
    );
  }

  if (selectedGenres.length > 0) {
    filtered = filtered.filter(movie =>
      movie.movie_genres.some(genre =>
        selectedGenres.includes(genre.genres.name)
      )
    );
  }

  if (selectedDate) {
    filtered = filtered.filter(movie =>
      movie.screenings.some(screening => {
        const date = new Date(screening.start_time).toISOString().split('T')[0];
        return date === selectedDate;
      })
    );
  }

  renderMovies(filtered);
}

// Pozivanje funkcije
setupDropdown('dropdown-cinema', (item) => {
  selectedCinema = item.getAttribute('data-cinema') || null;
  document.querySelector('#dropdown-cinema-text').textContent = selectedCinema || 'All cinemas';
  applyFilters();
});

setupDropdown('dropdown-date', (item) => {
  selectedDate = item.getAttribute('data-date') || null;
  document.querySelector('#dropdown-date-text').textContent = item.textContent || 'All dates';
  applyFilters();
});

setupDropdown('dropdown-genre', (item) => {
  const genre = item.getAttribute('data-genre');

  // Toggle genre u listi selektovanih
  if (selectedGenres.includes(genre)) {
    selectedGenres = selectedGenres.filter(g => g !== genre);
    item.classList.remove('c-dropdown-list-element-selected');
  } else {
    selectedGenres.push(genre);
    item.classList.add('c-dropdown-list-element-selected');
  }

  applyFilters();
});



