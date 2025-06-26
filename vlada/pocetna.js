const viewer = document.getElementById('heroModel');

viewer.addEventListener('model-visibility', () => {
  viewer.interpolationDecay = 1000; // trajanje 1s

  viewer.cameraOrbit = '0deg 75deg 2m'; 
  // kamera ide sa desne (ini. 90deg) na centar (0deg)

  viewer.autoRotate = false;
});
