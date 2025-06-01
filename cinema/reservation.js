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
    halls(
      id,
      name,
      total_seats,
      seats(
        id,
        row,
        col,
        row_label,
        seat_type(
          name,
          icon_url,
          price_modifier
        )
      )
    )
  `)
  .eq('id', screeningId)
  .single(); // zato što dobijaš samo jednu projekciju

if (error) {
  console.error('Greška pri dohvatanju podataka:', error);
}

console.log(data);

const sizeInBytes = new Blob([JSON.stringify(data)]).size;
console.log(`data zauzima oko ${(sizeInBytes / 1024).toFixed(2)} KB`);

// 2. Izvuci sedista
const seats = data.halls.seats;

// 1. Napravi mapu sedišta po [row][col]
const seatMap = {};
let maxRow = 0;
let maxCol = 0;

for (const seat of seats) {
  const { row, col } = seat;
  if (!seatMap[row]) seatMap[row] = {};
  seatMap[row][col] = seat;

  if (row > maxRow) maxRow = row;
  if (col > maxCol) maxCol = col;
}

// 2. Renderuj sedišta
const seatMapContainer = document.querySelector('.c-seat-map');

seatMapContainer.style.gridTemplateColumns = `repeat(${maxCol + 3}, 1fr)`;

for (let i = 0; i <= maxRow; i++) {
  // A. Iscrtaj labelu reda
  const rowLabelDiv = document.createElement('div');
  rowLabelDiv.className = 'c-seat-map';
  rowLabelDiv.classList.add('c-empty-seat'); // da se ne klikće
  rowLabelDiv.textContent = i; // broj reda
  seatMapContainer.appendChild(rowLabelDiv);

  // B. Dva prazna mesta (zauzimaju kolone 0 i 1)
  for (let k = 0; k < 2; k++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'c-seat-map c-empty-seat';
    seatMapContainer.appendChild(emptyDiv);
  }

  // C. Iscrtavanje sedišta i praznina
  for (let j = 0; j <= maxCol; j++) {
    const div = document.createElement('div');
    div.classList.add('c-seat-map');
    div.setAttribute('data-row', i);
    div.setAttribute('data-col', j);

    if (seatMap[i] && seatMap[i][j]) {
      // postoji sedište
      // ako želiš stil, tip, itd. dodaj ovde
    } else {
      div.classList.add('c-empty-seat');
    }

    seatMapContainer.appendChild(div);
  }
}
