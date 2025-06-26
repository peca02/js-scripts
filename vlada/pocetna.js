const modelViewer = document.getElementById('heroModel');

  modelViewer.addEventListener('load', async () => {
    // Otkrivanje modela uz smooth prelaz
    modelViewer.reveal();

    // Sačekaj malo da model "uđe"
    await new Promise(r => setTimeout(r, 1800));

    // Kada uđe, zaustavi rotaciju
    modelViewer.autoRotate = false;

    // (Po želji) centriraj kameru posle ulaska
    modelViewer.cameraOrbit = '0deg 75deg 2m';
    modelViewer.jumpCameraToGoal();
