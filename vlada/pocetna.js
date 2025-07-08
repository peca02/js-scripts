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


// pocetna.js

(async () => {
  // Dinamičko učitavanje Google Maps API-ja koristeći novi loader
  (g => {
    var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
      u = () => h || (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => h = n(Error(p + " could not load."));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
    d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
  })({
    key: "AIzaSyDqxHOS4GZyEpEfEPcRgCF78I8W5EEEO7E",
    v: "weekly",
  });

  // Funkcija koja pravi i prikazuje mapu
  async function initMap() {
  // Učitaj biblioteke
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // Kreiraj mapu
  const map = new Map(document.getElementById("map"), {
    center: { lat: 43.3144233, lng: 21.9279542 },
    zoom: 15,
    mapId: "96866e4109c0b686b91865c7",
  });

  // Dodaj marker
  const marker = new AdvancedMarkerElement({
    map: map,
    position: { lat: 43.3144233, lng: 21.9279542 },
  });
}

  // Kad se API učita, pozovi initMap
  google.maps.importLibrary("maps").then(() => initMap());
})();


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


// Funkcija za kreiranje custom dugmeta
function createCustomButton(
  targetId,
  text,
  padding,
  borderRadius,
  fontSize,
  backgroundFill,
  rippleColor,
  fontWeight,
  textColor) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
  
    const buttonId = `btn-${targetId}`;
  
    // 1. Kreiraj HTML strukturu
    const buttonWrapper = document.createElement("div");
    buttonWrapper.id = buttonId;
    buttonWrapper.innerHTML = `
      <a href="#" class="btn-link">
        <span class="btn-fill">
          <span class="btn-ripple v1"></span>
        </span>
        <span class="btn-title">
          <span class="btn-content">${text}</span>
        </span>
      </a>
    `;
  
    // 2. Dodaj stilove u <style>
    const style = document.createElement("style");
    style.innerHTML = `
      #${buttonId} .btn-link {
        padding: ${padding};
        border-radius: ${borderRadius};
        font-size: ${fontSize};
        text-decoration: none;
        text-transform: uppercase;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      #${buttonId} .btn-fill {
        background: ${backgroundFill};
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        transform: translateZ(0);
        border-radius: inherit;
        transition: background 0.3s;
      }
      #${buttonId} .btn-title {
        position: relative;
        top: -1px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        transform: translateZ(0);
      }
      #${buttonId} .btn-content {
        font-weight: ${fontWeight};
        color: ${textColor};
      }
      #${buttonId} .btn-ripple {
        display: none;
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: inherit;
      }
      #${buttonId} .btn-ripple.v1 {
        background: ${rippleColor};
      }
    `;
    document.head.appendChild(style);
  
    // 3. Očisti ciljani element i ubaci dugme
    targetElement.innerHTML = "";
    targetElement.appendChild(buttonWrapper);
}

createCustomButton(
  "dugme1",
  "Vidi kase",
  "0.5em 1em",
  "20px",
  "1rem",
  "#25a4e9",
  "#007bff",
  "600",
  "white"
);
