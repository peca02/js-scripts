const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'
const supabase = createClient(supabaseUrl, supabaseKey)
// Sve gore je povezivanje sa Supabase

// Pretpostavimo da je URL npr. https://tvoj-sajt.com/film.html?movie_id=5

// 1. Uzimanje `movie_id` iz URL-a
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movie_id');

// 2. Uzimanje filma sa povezanim glumcima, režiserima i žanrovima
const { data: movie, error } = await supabase
  .from('movies')
  .select(`
    title,
    description,
    duration,
    poster_url,
    trailer_url,
    language,
    age_rating,
    release_date,
    videomp4,
    movie_actors (
      actors (
        first_name,
        last_name
      )
    ),
    movie_directors (
      directors (
        first_name,
        last_name
      )
    ),
    movie_genres (
      genres (
        name
      )
    )
  `)
  .eq('id', movieId)
  .single(); // jer očekujemo jedan film

if (error)
  console.error("Greška pri dohvaćanju filma:", error.message);

console.log("Film:", movie);

let sizeInBytes = new Blob([JSON.stringify(movie)]).size;
console.log(`movie zauzima oko ${(sizeInBytes / 1024).toFixed(2)} KB`);


// funkcija za dobijanje lokalnog vremena
function getLocalTimestamp() {
  const date = new Date();
  return date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, '0') + "-" +
    String(date.getDate()).padStart(2, '0') + "T" +
    String(date.getHours()).padStart(2, '0') + ":" +
    String(date.getMinutes()).padStart(2, '0') + ":" +
    String(date.getSeconds()).padStart(2, '0');
}

const { data: screenings, error2 } = await supabase
  .from('screenings')
  .select(`
    id,
    hall_id,
    start_time,
    format,
    language,
    base_price,
    subtitle,
    halls (
      id,
      name,
      cinemas (
        name
      )
    )
  `)
  .eq('movie_id', movieId)
  .gte('start_time', getLocalTimestamp())
  .order('start_time', { ascending: true });

if (error2)
  console.error("Greška pri dohvaćanju projekcija:", error2.message);

console.log("Projekcije:", screenings);

sizeInBytes = new Blob([JSON.stringify(screenings)]).size;
console.log(`screenings zauzima oko ${(sizeInBytes / 1024).toFixed(2)} KB`);

const videoSection = document.querySelector(".c-background-video");

const trailerMp4 = movie.videomp4;

// Video element
const video = document.createElement("video");
video.autoplay = true;
video.muted = true;
video.loop = true;
video.playsInline = true;
video.style.objectFit = 'cover';
video.style.width = '100%';
video.style.height = '100%';
video.style.position = 'absolute';
video.style.top = 0;
video.style.left = 0;
video.style.zIndex = -1;


const sourceMp4 = document.createElement("source");
sourceMp4.src = trailerMp4;
sourceMp4.type = "video/mp4";

video.appendChild(sourceMp4);

// Ubaci u DOM
videoSection.prepend(video);


// podaci za film
const movieTitle = document.querySelector(".c-movie-title");
movieTitle.innerText = movie.title + ' ';

const movieYear = document.querySelector(".c-movie-year");
movieYear.innerText = '(' + new Date(movie.release_date).getFullYear() + ')';

const movieAgeRating = document.querySelector(".c-age-rating");
movieAgeRating.innerText = movie.age_rating;

const movieDate = document.getElementsByClassName("c-movie-details")[0];
movieDate.innerText = movie.release_date;

const movieGenres = document.getElementsByClassName("c-movie-details")[1];
movieGenres.innerText = movie.movie_genres.map(item => item.genres.name).join(', ');

const movieDuration = document.getElementsByClassName("c-movie-details")[2];
movieDuration.innerText = `${Math.floor(movie.duration / 60)}h${movie.duration % 60 ? ' ' + (movie.duration % 60) + 'm' : ''}`;

const movieDescription = document.getElementById("movie-description");
movieDescription.innerText = movie.description;

const movieActors = document.getElementById("actors");
movieActors.innerText = movie.movie_actors.map(item => item.actors.first_name + ' ' + item.actors.last_name).join(', ');

const movieLanguages = document.querySelector(".c-languages");
movieLanguages.innerText = movie.language;


// dodavanje s na language ako ima jezika
if (movieLanguages.textContent.includes(",")) {
  const languageLabel = document.querySelector(".c-language-label");
  languageLabel.textContent = "Languages: ";
}


const wrapper = document.querySelector(".c-trailer-and-language");

// Provera da li postoji sinhronizovani jezik
const syncLang = screenings[0]?.language;
const subtitleLang = screenings[0]?.subtitle;

// Ako postoji jedan od njih (ali ne oba)
if (syncLang || subtitleLang) {
  const container = document.createElement("div");
  container.className = "c-label-and-languages-wrapper";
  

  const label = document.createElement("div");
  label.className = "c-language-label";
  label.textContent = syncLang ? "Synchronized in: " : "Subtitle: ";

  const languageText = document.createElement("div");
  languageText.className = "c-languages";
  languageText.textContent = syncLang || subtitleLang;

  container.appendChild(label);
  container.appendChild(languageText);

  wrapper.appendChild(container);
}


// Play trailer
const openBtn = document.querySelector(".c-play-trailer");

openBtn.addEventListener("click", () => {
  const trailerUrl = movie.trailer_url;
  const videoId = new URL(trailerUrl).searchParams.get("v");

  // Napravi modal HTML
  const modal = document.createElement("div");
  modal.id = "video-modal";
  modal.style.cssText = `
    display: flex;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  modal.innerHTML = `
    <div id="modal-content" style="position: relative; width: 80%; max-width: 800px;">
      <span id="close-video" style="position: absolute; top: -30px; right: 0; color: white; cursor: pointer; font-size: 24px;">✖</span>
      <iframe id="youtube-frame" width="100%" height="450" frameborder="0" allowfullscreen></iframe>
    </div>
  `;

  document.body.appendChild(modal);

  const iframe = modal.querySelector("#youtube-frame");
  iframe.src = `https://www.youtube.com/embed/${videoId}`;

  const closeBtn = modal.querySelector("#close-video");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Zatvori klikom van modala
  modal.addEventListener("click", (event) => {
    const isClickInside = event.target.closest("#modal-content");
    if (!isClickInside) {
      modal.remove();
    }
  });
});


// funkcija za ekstraktovanje bioskopa iz projekcija
function extractCinemas(screenings) {
  const cinemasSet = new Set();

  screenings.forEach(screening => {
    const cinemaName = screening.halls.cinemas.name;
    if (cinemaName) {
      cinemasSet.add(cinemaName);
    }
  });

  return Array.from(cinemasSet).sort();
}

const cinemas = extractCinemas(screenings);
console.log(cinemas);


// funkcija za ekstraktovanje datuma iz projekcija
function extractDates(screenings) {
  const datesSet = new Set();

  screenings.forEach(screening => {
    const dateStr = new Date(screening.start_time).toDateString();
    datesSet.add(dateStr);
  });

  return Array.from(datesSet).sort((a, b) => new Date(a) - new Date(b));
}

const dates = extractDates(screenings);
console.log(dates);


// Hvatanje dropdown elemenata
const dropdownCinema = document.querySelector('#dropdown-cinema');
const dropdownDate = document.querySelector('#dropdown-date');
const toggleCinemaDropdown = dropdownCinema.querySelector('.c-dropdown-toggle');
const toggleDateDropdown = dropdownDate.querySelector('.c-dropdown-toggle');
const dropdownListCinemas = dropdownCinema.querySelector('.c-dropdown-list');
const dropdownListDates = dropdownDate.querySelector('.c-dropdown-list');
const dropdownCinemaText = document.querySelector('#dropdown-cinema-text');
const dropdownDateText = document.querySelector('#dropdown-date-text');


let selectedCinema = urlParams.get('cinema');
let selectedDate = urlParams.get('date');

if (!selectedDate) {
  selectedDate = dates[0];
}

dropdownCinemaText.textContent = selectedCinema;
dropdownDateText.textContent = selectedDate;

  // funkcija za punjenje jednog dropdowna
  function populateList(listElement, items, attributeName) {
  if (attributeName === 'data-date'){
    items.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('c-dropdown-list-element');
      if (item == selectedDate)
        div.classList.add('c-dropdown-list-element-selected');
      div.setAttribute(attributeName, item);
    
      const parts = item.split(' '); // ["Mon", "May", "12", "2025"]
      const firstLine = parts.slice(0, 3).join(' '); // "Mon May 12"
      const secondLine = parts[3]; // "2025"
      div.innerHTML = `${firstLine}<br>${secondLine}`;
    
      listElement.appendChild(div);
      });
  }
  else{
     items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('c-dropdown-list-element');
        if (item == selectedCinema)
          div.classList.add('c-dropdown-list-element-selected');
        div.setAttribute(attributeName, item);
      
        div.textContent = item;
    
        listElement.appendChild(div);
      });
  }
}

// Puni oba dropdowna
populateList(dropdownListCinemas, cinemas, 'data-cinema');
populateList(dropdownListDates, dates, 'data-date');


// kontejner za projekcije
const screeningsContainer = document.querySelector(".c-screenings-container");
screeningsContainer.classList.add("transition");


// funkcija za pauziranje vremena
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// funkcija za filtriranje projekcija
function filterScreenings(screenings, selectedCinema, selectedDate) {
  return screenings.filter(screening => {
    const screeningCinema = screening.halls.cinemas.name;
    const screeningDate = new Date(screening.start_time).toDateString();
    const selectedDateFormatted = new Date(selectedDate).toDateString();

    return (
      screeningCinema === selectedCinema &&
      screeningDate === selectedDateFormatted
    );
  });
}


// funkcija za renderovanje projekcija
async function updateScreenings(screeningsToShow) {

    screeningsContainer.style.opacity = "0";
    await sleep(300);
    // Prikaži filmove
    screeningsContainer.innerHTML = "";
    screeningsToShow.forEach((screening) => {
      
      const screeningLink = document.createElement("a");
      screeningLink.className = "c-screening-link";
          
      // Osnova linka — uzima se iz trenutnog domena
      const baseUrl = window.location.origin;
          
      // Pravimo URL objekat
      let href;
          
      href = new URL("/cinema/reservation", baseUrl);
      href.searchParams.set("screening_id", screening.id);
          
      // Postavljanje href-a
      screeningLink.href = href.toString();
   
      const time = document.createElement("div");
      time.className = "c-time";
      
      const date = new Date(screening.start_time);
      const hours = date.getHours().toString().padStart(2, '0');   // npr. "17"
      const minutes = date.getMinutes().toString().padStart(2, '0'); // npr. "30"
      const timeString = `${hours}:${minutes}`;
      
      time.textContent = timeString;

      const format = document.createElement("div");
      format.className = "c-screening-format";
      format.textContent = screening.format;

      const hall = document.createElement("div");
      hall.textContent = screening.halls.name;
  
      screeningLink.appendChild(time);
      screeningLink.appendChild(format);
      screeningLink.appendChild(hall);

      screeningsContainer.appendChild(screeningLink);
  });
  
  screeningsContainer.style.opacity = "1";
  await sleep(300);
  
} 


// ucitaj projekcije pri ucitavanju stranice
let filteredScreenings = filterScreenings(screenings, selectedCinema, selectedDate);
updateScreenings(filteredScreenings)


// Funkcija za prikazivanje i skrivanje dropdowna kad se klikne na toggle div
function toggleDropdown(dropdownList) {
  const isVisible = dropdownList.style.display === 'block';
  dropdownList.style.display = isVisible ? 'none' : 'block';
}


// Listeneri za cinema dropdown 
toggleCinemaDropdown.addEventListener('click', () => {
  toggleDropdown(dropdownListCinemas);
});

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

 
  selectedCinema = value;
  dropdownCinemaText.textContent = value;

  filteredScreenings = filterScreenings(screenings, selectedCinema, selectedDate);
  updateScreenings(filteredScreenings)
});


// Listeneri za date dropdown elemente
toggleDateDropdown.addEventListener('click', () => {
  toggleDropdown(dropdownListDates);
});

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

  
  selectedDate = value;
  dropdownDateText.textContent = value;

  filteredScreenings = filterScreenings(screenings, selectedCinema, selectedDate);
  updateScreenings(filteredScreenings)
});


// Listener za zatvaranje dropdownova kad se klikne van njih
document.addEventListener('click', (e) => {
  // Zatvori cinema dropdown ako klik nije unutar njega
  if (!dropdownCinema.contains(e.target)) {
    dropdownListCinemas.style.display = 'none';
  }


  // Zatvori date dropdown ako klik nije unutar njega
  if (!dropdownDate.contains(e.target)) {
    dropdownListDates.style.display = 'none';
  }
});

