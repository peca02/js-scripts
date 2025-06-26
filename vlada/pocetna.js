const viewer = document.getElementById('heroModel');

viewer.addEventListener('model-visibility', async (e) => {
  if (!e.detail.visible) return;

  console.log('Model je vidljiv, kreće animacija');

  // Kamera će se automatski interpolirati na zadatu orbitu
  viewer.cameraOrbit = '0deg 75deg 2m';
  viewer.autoRotate = false;

  // Opcionalno: nakon 1s (vreme animacije) resetuj rotaciju ako treba
  setTimeout(() => {
    viewer.resetTurntableRotation();
  }, 1100);
});
