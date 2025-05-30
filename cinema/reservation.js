function generateCurvedSeats() {
  const seats = [];
  const totalRows = 15;
  const minSeatsInRow = 10;
  const maxSeatsInRow = 30;
  const centerX = 500;
  const centerY = 100; // scena
  const rowSpacing = 30;

  for (let row = 1; row <= totalRows; row++) {
    const t = (row - 1) / (totalRows - 1);
    const seatsInRow = Math.floor(minSeatsInRow + t * (maxSeatsInRow - minSeatsInRow));
    const radius = rowSpacing * row + 100; // udaljenost od centra (pozornice)
    const angleStart = -Math.PI / 2 - Math.PI / 3; // -120 stepeni
    const angleEnd = -Math.PI / 2 + Math.PI / 3;   // +120 stepeni

    for (let i = 0; i < seatsInRow; i++) {
      const angle = angleStart + (i / (seatsInRow - 1)) * (angleEnd - angleStart);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      seats.push({
        id: `row${row}_seat${i + 1}`,
        row: row,
        number: i + 1,
        x: Math.round(x),
        y: Math.round(y),
        type: 'standard'
      });
    }
  }

  return seats;
}

const hallSeats = generateCurvedSeats();
console.log(hallSeats);

const canvas = document.createElement('canvas');
canvas.id = 'hall';
canvas.width = 1000;
canvas.height = 800;
canvas.style.border = '1px solid gray'; // opcionalno

// 2. Dodaj ga u body
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
const seats = generateCurvedSeats();

for (const seat of seats) {
    ctx.beginPath();
    ctx.arc(seat.x, seat.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
  }
