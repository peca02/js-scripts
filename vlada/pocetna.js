const viewer = document.getElementById('heroModel');
const modelWrapper = document.querySelector('.desna-kolona'); // div koji pomeramo

viewer.addEventListener('load', () => {
  document.getElementById(govno).innerText = 'govno';
  const start = 180;
  const end = 30;
  const duration = 3000;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);

    // Kamera se rotira
    const angle = start + (end - start) * eased;
    viewer.cameraOrbit = `${angle}deg 50deg`;

    // Div se pomera sa 50vw → 0
    const translateX = 50 * (1 - eased); // od 50vw do 0vw
    modelWrapper.style.transform = `translateX(${translateX}vw)`;

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
  viewer.autoRotate = false;
});
