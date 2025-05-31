const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'
const supabase = createClient(supabaseUrl, supabaseKey)
// Sve gore je povezivanje sa Supabase


const urlParams = new URLSearchParams(window.location.search);
const screeningId = urlParams.get('screening_id');

const { data, error } = await supabase
  .from('screenings')
  .select(`
    id,
    start_time,
    format,
    language,
    base_price,
    movie_id,
    hall(
      id,
      name,
      total_seats,
      seats(
        id,
        row,
        col,
        row_label,
        seat_type_id
      )
    )
  `)
  .eq('id', screeningId)
  .single(); // zato što dobijaš samo jednu projekciju

console.log(data);

const sizeInBytes = new Blob([JSON.stringify(data)]).size;
console.log(`data zauzima oko ${(sizeInBytes / 1024).toFixed(2)} KB`);
