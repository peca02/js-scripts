const navbar = document.querySelector('.navigacija');

let targetProgress = 0;
let currentProgress = 0;
const speed = 0.1;

function animateNavbar() {
  const scrollY = window.scrollY;
  const triggerPoint = window.innerHeight * 0.2; // 20vh

  // Računamo progres: 0 kad je ispod 20vh, 1 kad je mnogo iznad
  targetProgress = Math.min(Math.max((scrollY - triggerPoint) / 100, 0), 1);

  currentProgress += (targetProgress - currentProgress) * speed;

  const opacity = currentProgress * 0.7;
  const blur = currentProgress * 10;
  const shadowOpacity = currentProgress * 0.1;

  navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
  navbar.style.backdropFilter = `blur(${blur}px)`;
  navbar.style.boxShadow = `0 2px 10px rgba(0, 0, 0, ${shadowOpacity})`;

  requestAnimationFrame(animateNavbar);
}

animateNavbar();



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
