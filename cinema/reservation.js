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

// 3. Izracunaj maksimalan broj kolona
const maxCol = Math.max(...seats.map(s => s.col)) + 1;

// 4. Grupisi sedista po redovima
const rowsMap = {};
for (const seat of seats) {
  const row = seat.row;
  if (!rowsMap[row]) rowsMap[row] = [];
  rowsMap[row].push(seat);
}

// 5. Sortiraj redove po rednom broju (ključ)
const sortedRows = Object.entries(rowsMap).sort(([a], [b]) => Number(a) - Number(b));

// 6. Napravi seat map grid div
const seatMap = document.querySelector('.c-seat-map');
seatMap.style.display = 'grid';
seatMap.style.gridTemplateColumns = `repeat(${maxCol + 3}, 1fr)`; // +3 zbog row label + 2 prazna

// 7. Renderuj grid
for (const [rowNumber, seatsInRow] of sortedRows) {
  const row = Number(rowNumber);
  const rowLabel = seatsInRow[0]?.row_label || row;

  // Sortiraj sedista po koloni
  seatsInRow.sort((a, b) => a.col - b.col);

  // Inicijalna kolona za upoređivanje
  let currentCol = 0;

  // ➤ 7.1 Dodaj row label
  const labelDiv = document.createElement('div');
  labelDiv.classList.add('c-row-label');
  labelDiv.textContent = rowLabel;
  seatMap.appendChild(labelDiv);
  currentCol++;

  // ➤ 7.2 Dodaj 2 prazna mesta
  for (let i = 0; i < 2; i++) {
    const empty = document.createElement('div');
    empty.classList.add('c-empty-seat');
    seatMap.appendChild(empty);
    currentCol++;
  }

  // ➤ 7.3 Dodaj sedišta i praznine ako treba
  for (const seat of seatsInRow) {
    while (currentCol < seat.col + 3) {
      // Prazno mesto
      const empty = document.createElement('div');
      empty.classList.add('c-empty-seat');
      seatMap.appendChild(empty);
      currentCol++;
    }

    const seatDiv = document.createElement('div');
    seatDiv.classList.add('c-seat');
    seatDiv.setAttribute('data-row', seat.row);
    seatDiv.setAttribute('data-col', seat.col);
    seatMap.appendChild(seatDiv);
    currentCol++;
  }

  // ➤ 7.4 Ako ima još mesta do maxCol + 3, popuni prazninama
  while (currentCol < maxCol + 3) {
    const empty = document.createElement('div');
    empty.classList.add('c-empty-seat');
    seatMap.appendChild(empty);
    currentCol++;
  }
}
