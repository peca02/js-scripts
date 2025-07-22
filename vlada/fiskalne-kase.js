window.addEventListener("load", () => {
  const target = document.querySelector('.proizvodjaci-kase-tekst');

  if (!target) return;

  document.fonts.ready.then(() => {
    const split = new SplitType(target, { split: 'words, lines' });

    const words = document.querySelectorAll('.word');
    words.forEach((word, i) => {
      word.style.setProperty('--i', i);
    });

    target.classList.add('animiraj');
  });
});
