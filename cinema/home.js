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


// Izvuci unikatne bioskope
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

// Ubaci u dropdown
const dropdownList = document.querySelector('.w-dropdown-list');
// dropdownList.innerHTML = '';

uniqueCinemas.forEach(cinema => {
  const div = document.createElement('div');
  div.classList.add('c-dropdown-list-element');
  div.setAttribute('data-cinema', cinema);
  div.textContent = cinema;

  dropdownList.appendChild(div);
});

// Filtriranje filmova po kliku
const cinemaElements = document.querySelectorAll('.c-dropdown-list-element');

cinemaElements.forEach(el => {
  el.addEventListener('click', () => {
    const selectedCinema = el.getAttribute('data-cinema');

    // Setuj tekst u dropdown toggle
    document.querySelector('#dropdown-cinemas').textContent = selectedCinema;

    // Filtriraj filmove
    const filteredMovies = movies.filter(movie =>
      movie.screenings.some(screening =>
        screening.halls?.cinemas?.name === selectedCinema
      )
    );

    // Prikaži ih
    renderMovies(filteredMovies);
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    setTimeout(() => {
      window.scrollTo(scrollX, scrollY);
    }, 1); // Vrati scroll poziciju odmah posle Webflow pokušaja
  });
});

