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
    video,
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
  .gte('start_time', new Date().toISOString())
  .order('start_time', { ascending: true });

if (error2)
  console.error("Greška pri dohvaćanju projekcija:", error2.message);

console.log("Projekcije:", screenings);


const videoSection = document.querySelector(".c-background-video");

const trailerWebm = movie.video;


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

//const sourceMp4 = document.createElement("source");
//sourceMp4.src = trailerMp4;
//sourceMp4.type = "video/mp4";

const sourceWebm = document.createElement("source");
sourceWebm.src = trailerWebm;
sourceWebm.type = "video/webm";

//video.appendChild(sourceMp4);
video.appendChild(sourceWebm);


// Ubaci u DOM
videoSection.prepend(video);


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
