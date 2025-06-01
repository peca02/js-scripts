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

// 3. Izracunaj maksimalan broj kolona i redova
const maxCol = Math.max(...seats.map(s => s.col)) + 1;
const maxRow = Math.max(...seats.map(s => s.row));

// 4. Grupisi sedista po redovima
const rowsMap = {};
for (const seat of seats) {
  const row = seat.row;
  if (!rowsMap[row]) rowsMap[row] = [];
  rowsMap[row].push(seat);
}

// 5. Napravi seat map grid div
const seatMap = document.querySelector('.c-seat-map');
seatMap.style.gridTemplateColumns = `repeat(${maxCol + 3}, 1fr)`; // +3 zbog label + 2 prazna

// 6. Renderuj sve redove od 0 do maxRow
for (let row = 0; row <= maxRow; row++) {
  const seatsInRow = rowsMap[row] || [];
  const rowLabel = seatsInRow[0]?.row_label || row;

  // ➤ 6.1 Dodaj row label
  const labelDiv = document.createElement('div');
  labelDiv.textContent = rowLabel;
  seatMap.appendChild(labelDiv);
  let currentCol = 1;

  // ➤ 6.2 Dodaj 2 prazna mesta
  for (let i = 0; i < 2; i++) {
    const empty = document.createElement('div');
    empty.classList.add('c-empty-seat');
    seatMap.appendChild(empty);
    currentCol++;
  }

  // ➤ 6.3 Sortiraj sedišta po koloni ako ih ima
  seatsInRow.sort((a, b) => a.col - b.col);

  let seatIndex = 0;
  for (let col = 0; col < maxCol; col++) {
    if (seatIndex < seatsInRow.length && seatsInRow[seatIndex].col === col) {
      const seat = seatsInRow[seatIndex];
      const seatDiv = document.createElement('div');
      seatDiv.classList.add('c-seat');
      seatDiv.setAttribute('data-row', seat.row);
      seatDiv.setAttribute('data-col', seat.col);
      seatMap.appendChild(seatDiv);
      seatIndex++;
    } else {
      const empty = document.createElement('div');
      empty.classList.add('c-empty-seat');
      seatMap.appendChild(empty);
    }
    currentCol++;
  }
}
