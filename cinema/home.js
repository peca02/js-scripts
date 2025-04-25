const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'
const supabase = createClient(supabaseUrl, supabaseKey)
// Sve gore je povezivanje sa Supabase


// Prikupljanje filmova i ostalih podataka, ima duplikata, rezultat kao u sql
const { data: movies, error } = await supabase.rpc('get_upcoming_movies');
if (error) {
    console.error("Greška pri dohvatanju filmova:", error);
  }
console.log(movies);


// Funkcija koja filtrira filmove, ima duplikata
function filterMovies(movies, selectedCinema, selectedGenres, selectedDate) {
  return movies.filter(movie => {
    const matchCinema = selectedCinema
      ? movie.cinema === selectedCinema
      : true;

    const matchGenre = selectedGenres.length > 0
      ? selectedGenres.includes(movie.genre)
      : true;

    const matchDate = selectedDate
      ? new Date(movie.screening_start_time).toDateString() === new Date(selectedDate).toDateString()
      : true;

    return matchCinema && matchGenre && matchDate;
  });
}

//  prikupljanje svih filmova pri ucitavanju stranice, ima duplikata
let filteredMovies = filterMovies(movies, null, [], null);


// funkcija za uklanjanje duplikata
function removeDuplicateMovies(filteredMovies) {
  const seen = new Set();
  return filteredMovies.filter(movie => {
    if (seen.has(movie.movie_id)) {
      return false;
    }
    seen.add(movie.movie_id);
    return true;
  });
}

const uniqueFilteredMovies = removeDuplicateMovies(filteredMovies);

console.log(filteredMovies);
console.log(uniqueFilteredMovies);


// funkcija za renderovanje filmova
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
      image.alt = movie.movie_title;
      image.className = "c-movie-listing-image";

      const title = document.createElement("h2");
      title.className = "c-title-for-listed-movies";
      title.textContent = movie.movie_title;

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

const moviesContainer = document.querySelector(".c-container-for-listing-movies");

// Renderovanje filmova
renderMovies(uniqueFilteredMovies);


// Funkcija za izvlacenje bioskopa, bez duplikata
function extractCinemas(filteredMovies) {
  const cinemasSet = new Set();

  filteredMovies.forEach(movie => {
    cinemasSet.add(movie.cinema);
  });

  return Array.from(cinemasSet).sort();
}

let cinemas = extractCinemas(filteredMovies);
console.log(cinemas);


// Funkcija za izvlacenje zanrova, bez duplikata
function extractGenres(filteredMovies) {
  const genresSet = new Set();

  filteredMovies.forEach(movie => {
    genresSet.add(movie.genre);
  });

  return Array.from(genresSet).sort();
}

let genres = extractGenres(filteredMovies);
console.log(genres);


// Funkcija za izvlacenje datuma, bez duplikata
function extractDates(filteredMovies) {
  const datesSet = new Set();

  filteredMovies.forEach(movie => {
    const dateStr = new Date(movie.screening_start_time).toDateString();
    datesSet.add(dateStr);
  });

  return Array.from(datesSet).sort((a, b) => new Date(a) - new Date(b));
}

let dates = extractDates(filteredMovies);
console.log(dates);

// Hvatanje dropdown elemenata

const dropdownCinema = document.querySelector('#dropdown-cinema');
const dropdownGenre = document.querySelector('#dropdown-genre');
const dropdownDate = document.querySelector('#dropdown-date');
const toggle = dropdownCinema.querySelector('.c-dropdown-toggle');
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

const cinemaElements = document.querySelectorAll('.c-dropdown-list-element');

// Animacija za dropdown

// Otvori/zatvori dropdown na klik
toggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Da klik na toggle ne zatvori odmah dropdown
  dropdownListCinemas.style.display = dropdownListCinemas.style.display === 'block' ? 'none' : 'block';
});

// Zatvori dropdown kada se klikne na neki item
cinemaElements.forEach(item => {
  item.addEventListener('click', () => {
    dropdownListCinemas.style.display = 'none';
  });
});

// Zatvori dropdown ako se klikne van njega
document.addEventListener('click', (e) => {
  if (!dropdownCinema.contains(e.target)) {
    dropdownListCinemas.style.display = 'none';
  }
});


// Filtriranje filmova po kliku

cinemaElements.forEach(el => {
  el.addEventListener('click', () => {
    const selectedCinema = el.getAttribute('data-cinema');

    // Ukloni selektovanu klasu sa svih elemenata
    cinemaElements.forEach(item => {
      item.classList.remove('c-dropdown-list-element-selected');
    });

    // Dodaj selektovanu klasu na kliknuti element
    el.classList.add('c-dropdown-list-element-selected');
    
    // Ako nema data-cinema, znači "All cinemas" je kliknut → resetuj filter
    if (!selectedCinema) {
      document.querySelector('#dropdown-cinema-text').textContent = 'All cinemas';
      renderMovies(movies);
      return; // PREKINI dalje izvršavanje
    }
    
    // Setuj tekst u dropdown toggle
    document.querySelector('#dropdown-cinema-text').textContent = selectedCinema;

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

