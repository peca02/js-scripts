const viewer = document.getElementById('heroModel');

viewer.addEventListener('model-visibility', (e) => {
  if (e.detail.visible) {
    console.log('Model je prisutan i vidljiv na ekranu.');

    // Ovde ubacuješ početak animacije kamere
    viewer.autoRotate = true;

    setTimeout(() => {
      viewer.autoRotate = false;
      viewer.cameraOrbit = '0deg 75deg 2m';
      viewer.jumpCameraToGoal();
    }, 1800);
  }
});
