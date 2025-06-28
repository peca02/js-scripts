const viewer = document.getElementById('heroModel');
viewer.reveal = 'auto'; // može pomoći

viewer.addEventListener('load', () => {
  console.log('Model je učitan — load event aktiviran');
  document.getElementById('govno').innerText = 'Učitano!';
});
