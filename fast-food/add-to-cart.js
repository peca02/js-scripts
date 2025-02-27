window.onerror = function(message, source, lineno, colno, error) {
    console.error(`⚠️ Greška u skripti: ${message} (Linija: ${lineno}, Kolona: ${colno})`);
};

// Ostatak koda tvoje skripte

console.log("Skripta se uspešno učitala!");
