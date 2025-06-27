const viewer = document.getElementById('heroModel');

let rotation = 0;

function animateRotation() {
  rotation -= 0.5; // brže ide i ide CCW
  if (rotation <= -360) rotation = 0;

  viewer.cameraOrbit = `${rotation}deg 75deg 2m`;

  requestAnimationFrame(animateRotation);
}

// Pokreni kada model postane vidljiv
viewer.addEventListener('model-visibility', () => {
  animateRotation();
});
