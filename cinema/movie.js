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
    movie_id,
    hall_id,
    start_time,
    format,
    language,
    base_price,
    subtitle,
    halls (
      id,
      cinema_id,
      name,
      seat_map,
      total_seats,
      description,
      base_price,
      cinemas (
        id,
        name,
        city,
        address,
        description,
        image_url
      )
    )
  `)
  .eq('movie_id', movieId)
  .order('start_time', { ascending: true });

if (error2)
  console.error("Greška pri dohvaćanju projekcija:", error2.message);

console.log(screenings);
