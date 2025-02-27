window.onerror = function(message, source, lineno, colno, error) {
    console.error(`⚠️ Greška u skripti: ${message} (Linija: ${lineno}, Kolona: ${colno})`);
};
const script = document.createElement("script");
script.src = `https://cdn.jsdelivr.net/gh/peca02/js-scripts@latest/fast-food/add-to-cart.js?v=${Date.now()}`;
document.body.appendChild(script);
