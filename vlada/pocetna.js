const viewer = document.getElementById('heroModel');
const modelWrapper = document.querySelector('.desna-kolona-hero'); // div koji pomeramo

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
  const speed = 0.1;       // brzina animacije (manje = sporije)

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


  const openBtn = document.querySelector('.pozovi');
  const closeBtn = document.querySelector('.iksic-pop-up');
  const popup = document.querySelector('.pop-up');
const popupWrapper = document.querySelector('.pop-up-wrapper');

  openBtn.addEventListener('click', () => {
  popupWrapper.style.display = 'flex';
  popupWrapper.style.transition = 'background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  popup.classList.remove('swing-out-top-bck');
  popup.classList.add('swing-in-top-bck');

  requestAnimationFrame(() => {
    popupWrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  });
});

closeBtn.addEventListener('click', () => {
  popupWrapper.style.transition = 'background-color 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
  popupWrapper.style.backgroundColor = 'rgba(0, 0, 0, 0)';

  popup.classList.remove('swing-in-top-bck');
  popup.classList.add('swing-out-top-bck');

  setTimeout(() => {
    popupWrapper.style.display = 'none';
    popup.classList.remove('swing-out-top-bck');
  }, 450);
});

popupWrapper.addEventListener('click', (event) => {
  if (!popup.contains(event.target)) {
    // Isti kod kao kad se klikne na iks
    popupWrapper.style.transition = 'background-color 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    popupWrapper.style.backgroundColor = 'rgba(0, 0, 0, 0)';

    popup.classList.remove('swing-in-top-bck');
    popup.classList.add('swing-out-top-bck');

    setTimeout(() => {
      popupWrapper.style.display = 'none';
      popup.classList.remove('swing-out-top-bck');
    }, 450);
  }
});


function initMap() {
  const options = {
    center: { lat: 43.3144233, lng: 21.9279542 },
    zoom: 14,
    mapTypeId: 'roadmap'
  };
  const map = new google.maps.Map(
    document.getElementById("mapa"),
    options
  );

  new google.maps.Marker({
    position: options.center,
    map: map,
    title: "Moja firma",
  });
}
// window.initMap = initMap; // 📌 obavezno da Google API funkciju nađe
initMap();
