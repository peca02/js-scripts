const viewer = document.getElementById('heroModel');

viewer.addEventListener('model-visibility', () => {
  let start = 180;
  const end = 30;
  const duration = 2000; // u ms
  const steps = 60;
  let current = 0;

  function animate() {
    const t = current / steps;
    const eased = 1 - Math.pow(1 - t, 3); // ease-out
    const angle = start + (end - start) * eased;

    viewer.cameraOrbit = `${angle}deg 50deg`;

    current++;
    if (current <= steps) {
      requestAnimationFrame(animate);
    }
  }

  animate();

  // Isključi auto-rotaciju nakon ulaska
  viewer.autoRotate = false;
});
