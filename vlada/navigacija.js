const navbar = document.querySelector('.navigacija');

let targetProgress = 0;   // cilj progres na osnovu skrola
let currentProgress = 0;  // trenutni prikazani progres (lagano ka cilju)
const speed = 0.1;        // brzina animacije (manje = sporije)

let animationFrameId = null;

function animateNavbar() {
  const scrollY = window.scrollY;
  const triggerHeight = window.innerHeight * 0.3; // 30% visine viewporta
  targetProgress = Math.min(scrollY / triggerHeight, 1);

  // Postepeno približavanje current ka target
  currentProgress += (targetProgress - currentProgress) * speed;

  // Interpolovane vrednosti
  const opacity = currentProgress * 0.7;
  const blur = currentProgress * 10;
  const shadowOpacity = currentProgress * 0.1;

  // Primena stilova
  navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
  navbar.style.backdropFilter = `blur(${blur}px)`;
  navbar.style.boxShadow = `0 2px 10px rgba(0, 0, 0, ${shadowOpacity})`;

  animationFrameId = requestAnimationFrame(animateNavbar);
}


function startAnimation() {
  if (!animationFrameId) {
    animateNavbar();
  }
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    navbar.style.backgroundColor = "";
    navbar.style.backdropFilter = "";
    navbar.style.boxShadow = "";
    // nakon sto prekinemo animaciju, moramo izbrisati inline style kako bi se vrednosti vratile na one pocetne koje dolaze iz klase
  }
}

const mediaQuery = window.matchMedia('(min-width: 480px)');

// Pokreni ili zaustavi u zavisnosti od trenutnog stanja
function handleScreenChange(e) {
  if (e.matches) {
    startAnimation();
  } else {
    stopAnimation();
  }
}

// Prva provera odmah
handleScreenChange(mediaQuery);

// Slušaj promene (npr. rotacija telefona)
mediaQuery.addEventListener('change', handleScreenChange);
// sve iznad mora biti tacno tako, da bi napravili da se animacija ne desava na telefonu kada onako neko menja polozaj telefona landscape/obicno, jer animacija treba da radi na landscape al ne na obican fon



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
    popup.removeAttribute('aria-hidden');
    popup.focus();
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
    popup.setAttribute('aria-hidden', 'true');
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
      popup.setAttribute('aria-hidden', 'true');
    }, 450);
  }
});
