const modelViewer = document.getElementById('heroModel');

// Sačekaj dok se DOM učita
window.addEventListener('DOMContentLoaded', async () => {
  // Sačekaj dodatno da model-viewer komponenta završi setup
  await new Promise(r => setTimeout(r, 500));

  // Otkrij model
  modelViewer.reveal();

  // Uključi rotaciju tokom ulaska
  modelViewer.autoRotate = true;

  // Sačekaj da "uđe"
  await new Promise(r => setTimeout(r, 1800));

  // Zaustavi rotaciju
  modelViewer.autoRotate = false;

  // Postavi kameru ispred modela
  modelViewer.cameraOrbit = '0deg 75deg 2m';
  modelViewer.jumpCameraToGoal();
});
