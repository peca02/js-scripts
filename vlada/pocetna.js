const viewer = document.getElementById('heroModel');

viewer.addEventListener('model-visibility', () => {
  viewer.cameraOrbit = '0deg 75deg 2m';
  viewer.autoRotate = false;
  console.log('Počinje "upad" sa desna na levu!');
});
