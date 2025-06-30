const viewer = document.getElementById('heroModel');
const modelWrapper = document.querySelector('.desna-kolona'); // div koji pomeramo

viewer.addEventListener('load', () => {
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

  modelWrapper.style.transform = 'translateX(50vw)';
  requestAnimationFrame(animate);
});


const navbar = document.querySelector('.navigacija');
const hero = document.querySelector('.hero-section');

let targetProgress = 0;   // koliki je cilj progres na osnovu skrola
  let currentProgress = 0;  // trenutni prikazani progres (kao lag)
  const speed = 0.2;       // brzina animacije (manje = sporije)

  function animateNavbar() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    targetProgress = Math.min(scrollY / (heroHeight * 0.3), 1);

    // Postepeno približavanje current ka target
    currentProgress += (targetProgress - currentProgress) * speed;

    // Interpolovane vrednosti
    const opacity = 0 + currentProgress * 0.7;
    const blur = 0 + currentProgress * 10;
    const shadowOpacity = 0 + currentProgress * 0.1;

    // Apply stilovi
    navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    navbar.style.backdropFilter = `blur(${blur}px)`;
    navbar.style.boxShadow = `0 2px 10px rgba(0, 0, 0, ${shadowOpacity})`;

    requestAnimationFrame(animateNavbar); // stalna animacija
  }

  animateNavbar(); // pokreni loop
