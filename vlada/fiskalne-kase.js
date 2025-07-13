const target = document.getElementById("1");
let triggered = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !triggered) {
      triggered = true;

      document.fonts.ready.then(() => {
        const split = new SplitType(target, { split: 'words, lines' });

        const words = target.querySelectorAll('.word');
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

const target2 = document.getElementById("2");
let triggered2 = false;

const observer2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !triggered2) {
      triggered2 = true;

      document.fonts.ready.then(() => {
        const split = new SplitType(target2, { split: 'words, lines' });

        const words = target2.querySelectorAll('.word');
        words.forEach((word, i) => {
          word.style.setProperty('--i', i);
        });

        target2.classList.add('animiraj');
      });

      observer2.unobserve(target2); // opciono
    }
  });
}, {
  root: null,
  threshold: 1
});

observer2.observe(target2);

