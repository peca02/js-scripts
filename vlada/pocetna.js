const viewer = document.getElementById('heroModel');

viewer.addEventListener('model-visibility', () => {

  viewer.cameraOrbit = '30deg 50deg 2m'; 
  // kamera ide sa desne (ini. 90deg) na centar (0deg)

  viewer.autoRotate = false;
});
