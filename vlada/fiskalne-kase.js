const target = document.querySelector('.js-split-text');
let triggered = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !triggered) {
      triggered = true;

      document.fonts.ready.then(() => {
        const split = new SplitType(target, { split: 'words, lines' });

        const words = document.querySelectorAll('.word');
        words.forEach((word, i) => {
          word.style.setProperty('--i', i);
        });

        target.classList.add('animiraj');
      });

      observer.unobserve(target); // opciono
    }
  });
}, {
  root: null,
  threshold: 1
});

observer.observe(target);
