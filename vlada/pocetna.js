const viewer = document.getElementById('heroModel');

viewer.addEventListener('model-visibility', () => {
  const start = 180;
  const end = 30;
  const duration = 5000; // trajanje u milisekundama
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // normalize 0–1
    const eased = 1 - Math.pow(1 - t, 3); // ease-out
    const angle = start + (end - start) * eased;

    viewer.cameraOrbit = `${angle}deg 50deg`;

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);

  viewer.autoRotate = false;
});
