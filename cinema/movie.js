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


const videoSection = document.getElementsByClass("c-background-video");

const trailerWebm = movie.video;
const movieTitle = movie.title;


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

