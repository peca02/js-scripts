const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'
const supabase = createClient(supabaseUrl, supabaseKey)
// Sve gore je povezivanje sa Supabase

// Pretpostavimo da je URL npr. https://tvoj-sajt.com/film.html?movie_id=5

// 1. Uzimanje `movie_id` iz URL-a
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movie_id');

if (!movieId) {
  console.error("Nema prosleđenog movie_id u URL-u.");
} else {
  // 2. Uzimanje filma sa povezanim glumcima, režiserima i žanrovima
  const { data: movie, error } = await supabase
    .from('movies')
    .select(`
      id,
      title,
      description,
      duration,
      poster_url,
      trailer_url,
      language,
      age_rating,
      release_date,
      movie_actors (
        actor:actor_id (
          id,
          first_name,
          last_name
        )
      ),
      movie_directors (
        director:director_id (
          id,
          first_name,
          last_name
        )
      ),
      movie_genres (
        genre:genre_id (
          id,
          name
        )
      )
    `)
    .eq('id', movieId)
    .single(); // jer očekujemo jedan film

  if (error) {
    console.error("Greška pri dohvaćanju filma:", error.message);
  } else {
    console.log("Film:", movie);
  }
}
