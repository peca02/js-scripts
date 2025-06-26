const modelViewer = document.getElementById('heroModel');

  modelViewer.addEventListener('load', async () => {
    console.log('Model učitan!');
    modelViewer.reveal();

    await new Promise(r => setTimeout(r, 1800));
    modelViewer.autoRotate = false;

    modelViewer.cameraOrbit = '0deg 75deg 2m';
    modelViewer.jumpCameraToGoal();
  });
