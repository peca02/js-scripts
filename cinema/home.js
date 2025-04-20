const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')

const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'

const supabase = createClient(supabaseUrl, supabaseKey)

const today = new Date().toISOString();

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

  movies.forEach((movie) => {
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
