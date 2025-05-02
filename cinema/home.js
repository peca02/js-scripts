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


// funkcija za uklanjanje duplikata
function removeDuplicateMovies(movies) {
  const seen = new Set();
  return movies.filter(movie => {
    if (seen.has(movie.movie_id)) {
      return false;
    }
    seen.add(movie.movie_id);
    return true;
  });
}

let uniqueMovies = removeDuplicateMovies(movies);

console.log(uniqueMovies);


const moviesContainer = document.querySelector(".c-container-for-listing-movies");

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


// Renderovanje filmova
renderMovies(uniqueMovies);


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
const toggleCinemaDropdown = dropdownCinema.querySelector('.c-dropdown-toggle');
const toggleGenreDropdown = dropdownGenre.querySelector('.c-dropdown-toggle');
const toggleDateDropdown = dropdownDate.querySelector('.c-dropdown-toggle');
const dropdownListCinemas = dropdownCinema.querySelector('.c-dropdown-list');
const dropdownListGenres = dropdownGenre.querySelector('.c-dropdown-list');
const dropdownListDates = dropdownDate.querySelector('.c-dropdown-list');
const dropdownCinemaText = document.querySelector('#dropdown-cinema-text');
const dropdownGenreText = document.querySelector('#dropdown-genre-text');
const dropdownDateText = document.querySelector('#dropdown-date-text');


// funkcija za punjenje svih dropdownova
function populateDropdowns(cinemas, genres, dates) {
  // Helper funkcija za punjenje jednog dropdowna
  function populateList(listElement, items, attributeName, defaultText) {
    listElement.innerHTML = ''; // očisti postojeće stavke

    // Dodaj "All" kao prvi izbor
    const defaultDiv = document.createElement('div');
    defaultDiv.classList.add('c-dropdown-list-element');
    defaultDiv.textContent = defaultText;
    listElement.appendChild(defaultDiv);
      
    items.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('c-dropdown-list-element');
      div.setAttribute(attributeName, item);
      div.textContent = item;
      listElement.appendChild(div);
    });
  }

  // Puni sve 3 liste
  populateList(dropdownListCinemas, cinemas, 'data-cinema', 'All cinemas');
  populateList(dropdownListGenres, genres, 'data-genre', 'All genres');
  populateList(dropdownListDates, dates, 'data-date', 'All dates');
}

populateDropdowns(cinemas, genres, dates);
dropdownCinema.querySelectorAll('.c-dropdown-list-element')[0].classList.add('c-dropdown-list-element-selected');  
dropdownGenre.querySelectorAll('.c-dropdown-list-element')[0].classList.add('c-dropdown-list-element-selected');  
dropdownDate.querySelectorAll('.c-dropdown-list-element')[0].classList.add('c-dropdown-list-element-selected');  


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


// Globalne promenljive za selektovane vrednosti
let selectedCinema = '';
let selectedGenres = [];
let selectedDate = '';

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

    const filteredMovies = filterMovies(movies, selectedCinema, selectedGenres, selectedDate);
    uniqueMovies = removeDuplicateMovies(filteredMovies);
    renderMovies(uniqueMovies);
    cinemas = extractCinemas(filteredMovies);
    genres = extractGenres(filteredMovies);
    dates = extractDates(filteredMovies);
    populateDropdowns(cinemas, genres, dates);
    
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

    const filteredMovies = filterMovies(movies, selectedCinema, selectedGenres, selectedDate);
    uniqueMovies = removeDuplicateMovies(filteredMovies);
    renderMovies(uniqueMovies);
    cinemas = extractCinemas(filteredMovies);
    genres = extractGenres(filteredMovies);
    dates = extractDates(filteredMovies);
    populateDropdowns(cinemas, genres, dates);
    
});
