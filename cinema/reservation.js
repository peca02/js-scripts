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
      base_price,
      seats(
        id,
        row,
        col,
        seat_type(
          name,
          price_modifier
        )
      )
    ),
    reservations(
      reservation_seats(
        seat_id
      )
    )
  `)
  .eq('id', screeningId)
  .single();

if (error) {
  console.error('Greška pri dohvatanju podataka:', error);
}

console.log(data);

const sizeInBytes = new Blob([JSON.stringify(data)]).size;
console.log(`data zauzima oko ${(sizeInBytes / 1024).toFixed(2)} KB`);

// 2. Izvuci sedista
const seats = data.halls.seats;

// Skupi sve rezervisana seat_id
const reservedSeatIds = data.reservations
  .flatMap(r => r.reservation_seats)
  .map(rs => rs.seat_id);

console.log(reservedSeatIds);

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

console.log(rowsMap);

// Renderuj jedno sedište privremeno da dobiješ dimenzije
const tempSeat = document.createElement('div');
tempSeat.classList.add('c-seat');
tempSeat.style.position = 'absolute';
tempSeat.style.visibility = 'hidden';
document.body.appendChild(tempSeat);

const seatMap = document.querySelector('.c-seat-map');

// Sačekaj da se stavi u DOM
requestAnimationFrame(() => {
  const seatWidth = tempSeat.getBoundingClientRect().width;
  seatMap.style.gridTemplateColumns = `repeat(${maxCol + 2}, ${seatWidth}px)`; //+2 zbog label + 1 prazna

  tempSeat.remove(); // Očisti dummy element
});

let visibleRowCounter = 1;

// 6. Renderuj sve redove od 0 do maxRow
for (let row = 0; row <= maxRow; row++) {
  const seatsInRow = rowsMap[row] || [];
  const rowLabel = seatsInRow.length > 0 ? visibleRowCounter++ : '';

  // ➤ 6.1 Dodaj row label
  const labelDiv = document.createElement('div');
  if (rowLabel === '') {
    labelDiv.textContent = '';
  }
  else {
    labelDiv.textContent = rowLabel;
  }

  seatMap.appendChild(labelDiv);

  // ➤ 6.2 Dodaj 1 prazna mesto

  const empty = document.createElement('div');
  empty.classList.add('c-empty-seat');
  seatMap.appendChild(empty);

  // ➤ 6.3 Sortiraj sedišta po koloni ako ih ima
  seatsInRow.sort((a, b) => a.col - b.col);

  const selectedSeats = [];
  const maxSelectableSeats = 10;
  const reservationSummary = document.getElementById('reservation-summary');
  
  let seatIndex = 0;
  for (let col = 0; col < maxCol; col++) {
    if (seatIndex < seatsInRow.length && seatsInRow[seatIndex].col === col) {
      const seat = seatsInRow[seatIndex];
      const seatType = seat.seat_type.name;
      const isLoveSeat = seatType === 'Love';
  
      const nextSeat = seatsInRow[seatIndex + 1];
      const isLovePair = isLoveSeat &&
        nextSeat &&
        nextSeat.seat_type.name === 'Love' &&
        nextSeat.col === col + 1;
  
      const seatDiv = document.createElement('div');
      seatDiv.classList.add('c-seat');
      if (seatType === 'VIP') seatDiv.classList.add('c-vip-seat');
      if (isLoveSeat) seatDiv.classList.add('c-love-seat');
      if (reservedSeatIds.includes(seat.id)) {
        seatDiv.classList.add('c-reserved-seat');
      } else {
        // Listener za klik samo ako nije rezervisano
        seatDiv.addEventListener('click', () => {
          const alreadySelected = selectedSeats.find(s => s.id === seat.id);
  
          // Ako je već selektovan – ukloni ga
          if (alreadySelected) {
            selectedSeats.splice(selectedSeats.indexOf(alreadySelected), 1);
            seatDiv.classList.remove('c-seat-selected');
          } else {
            // Računaj ukupno sedišta (ljubavna se računaju kao 2)
            const totalSelectedCount = selectedSeats.reduce((acc, s) => acc + (s.seat_type === 'Love' ? 2 : 1), 0);
            const thisSeatCount = isLoveSeat ? 2 : 1;
            if (totalSelectedCount + thisSeatCount > maxSelectableSeats) {
              alert("Ne možete rezervisati više od 10 sedišta.");
              return;
            }
  
            selectedSeats.push({
              id: seat.id,
              row: seat.row,
              col: seat.col,
              visibleRow: visibleRowCounter - 1,
              visibleCol: isLovePair ? seatIndex / 2 + 1 : seatIndex + 1,
              seat_type: seatType,
              price_modifier: seat.seat_type.price_modifier,
              isLovePair
            });
  
            seatDiv.classList.add('c-seat-selected');
          }
  
          updateReservationSummary();
        });
      }
  
      seatDiv.setAttribute('data-row', seat.row);
      seatDiv.setAttribute('data-visible-row', visibleRowCounter - 1);
      seatDiv.setAttribute('data-col', seat.col);
      seatDiv.setAttribute('data-price-modifier', seat.seat_type.price_modifier);
  
      if (isLovePair) {
        seatDiv.style.gridColumn = 'span 2';
        seatDiv.setAttribute('data-visible-col', seatIndex / 2 + 1);
      } else {
        seatDiv.setAttribute('data-visible-col', seatIndex + 1);
      }
  
      seatMap.appendChild(seatDiv);
      seatIndex++;
      if (isLovePair) {
        seatIndex++;
        col++; // preskoči sledeću kolonu jer je spojena
      }
    } else {
      const empty = document.createElement('div');
      empty.classList.add('c-empty-seat');
      seatMap.appendChild(empty);
    }
  }
  
  // Funkcija za prikaz rezimea rezervacije
  function updateReservationSummary() {
    const grouped = {};
  
    for (const seat of selectedSeats) {
      const type = seat.seat_type;
      const price = data.base_price + data.halls.base_price + seat.price_modifier;
      const finalPrice = seat.seat_type === 'Love' ? price * 2 : price;
  
      if (!grouped[type]) grouped[type] = { count: 0, pricePerSeat: price, total: 0 };
      grouped[type].count += seat.seat_type === 'Love' ? 2 : 1;
      grouped[type].total += finalPrice;
    }
  
    // Prikaz
    reservationSummary.innerHTML = '';
    let grandTotal = 0;
  
    Object.entries(grouped).forEach(([type, { count, pricePerSeat, total }]) => {
      const row = document.createElement('div');
      row.textContent = `${count} ${type.toLowerCase()} x ${pricePerSeat.toFixed(2)} = ${total.toFixed(2)}`;
      reservationSummary.appendChild(row);
      grandTotal += total;
    });
  
    if (grandTotal > 0) {
      const totalRow = document.createElement('div');
      totalRow.style.marginTop = '8px';
      totalRow.innerHTML = `<strong>Ukupno: ${grandTotal.toFixed(2)}</strong>`;
      reservationSummary.appendChild(totalRow);
    }
  }

}
