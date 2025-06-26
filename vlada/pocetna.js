const modelViewer = document.getElementById('heroModel');

  // Kad se model učita
  modelViewer.addEventListener('load', () => {
    // 1. Postavi početnu poziciju kamere — malo sa strane
    modelViewer.cameraOrbit = '90deg 75deg 3m'; // (azimut, elevacija, udaljenost)

    // 2. Uključi rotaciju dok traje ulazna animacija
    modelViewer.autoRotate = true;

    // 3. Pokreni animaciju ka centru (0deg 75deg 2m)
    let step = 0;
    const totalSteps = 60; // broj frame-ova (~1 sekunda ako je 60fps)
    const interval = setInterval(() => {
      step++;
      const azimuth = 90 - (90 * step) / totalSteps;
      const radius = 3 - (1 * step) / totalSteps;
      modelViewer.cameraOrbit = `${azimuth}deg 75deg ${radius}m`;
      modelViewer.jumpCameraToGoal();

      if (step >= totalSteps) {
        clearInterval(interval);
        modelViewer.autoRotate = false; // zaustavi rotaciju
      }
    }, 16); // ~60 fps
  });
