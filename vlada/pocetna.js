const viewer = document.getElementById('heroModel');

viewer.addEventListener('model-visibility', (e) => {
  if (e.detail.visible) {
    console.log('Model je prisutan i vidljiv na ekranu.');
  }
});
