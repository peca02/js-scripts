const viewer = document.getElementById('heroModel');

function checkIfLoaded() {
  if (viewer.loaded) {
    console.log('Model je učitan (manual check)');
    document.getElementById('govno').innerText = 'Učitano!';
  } else {
    setTimeout(checkIfLoaded, 100);
  }
}

checkIfLoaded();
