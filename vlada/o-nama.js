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
    center: { lat: 43.3146733, lng: 21.9277042 },
    zoom: 15,
    mapId: "96866e4109c0b686b91865c7",
  });

  // Dodaj marker
  const marker = new AdvancedMarkerElement({
    map: map,
    position: { lat: 43.3146733, lng: 21.9277042 },
  });
}

  // Kad se API učita, pozovi initMap
  google.maps.importLibrary("maps").then(() => initMap());
})();


const phoneLink1 = document.getElementById('phone-link1');
const phoneLink2 = document.getElementById('phone-link2');

  function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  }

  if (!isMobile()) {
    
    phoneLink1.addEventListener('click', e => {
      e.preventDefault(); // blokira otvaranje VoIP app

      const phoneNumber = phoneLink1.getAttribute('href').replace('tel:', '');

      navigator.clipboard.writeText(phoneNumber).then(() => {
        alert('Broj je kopiran u clipboard: ' + phoneNumber);
      }).catch(() => {
        alert('Greška prilikom kopiranja broja.');
      });
    });

      phoneLink2.addEventListener('click', e => {
      e.preventDefault(); // blokira otvaranje VoIP app

      const phoneNumber = phoneLink2.getAttribute('href').replace('tel:', '');

      navigator.clipboard.writeText(phoneNumber).then(() => {
        alert('Broj je kopiran u clipboard: ' + phoneNumber);
      }).catch(() => {
        alert('Greška prilikom kopiranja broja.');
      });
    });

  }
