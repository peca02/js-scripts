import { createClient } from '@supabase/supabase-js'

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
