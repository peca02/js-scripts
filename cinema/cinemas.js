const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'
const supabase = createClient(supabaseUrl, supabaseKey)
// Sve gore je povezivanje sa Supabase


const { data: cinemas, error } = await supabase
  .from('cinemas')
  .select('*')

console.log(cinemas);

const container = document.querySelector('.c-cinemas-container');

cinemas.forEach(cinema => {
  // Kreiraj link
  const link = document.createElement('a');
  
  // Uzmi trenutni domen (npr. https://predrags-awesome-site-dda-9e5aad497047e.webflow.io)
  const baseUrl = window.location.origin;
  
  // Napravi query string koristeći URLSearchParams (automatski stavlja + za razmak)
  const params = new URLSearchParams();
  params.set("cinema", cinema.name);
  
  // Sastavi pun href
  link.href = `${baseUrl}/cinema/home?${params.toString()}`;
  
  // H2 – Naziv bioskopa
  const name = document.createElement('h2');
  name.textContent = cinema.name;
  link.appendChild(name);

  // Grad
  const city = document.createElement('div');
  city.textContent = cinema.city;
  link.appendChild(city);

  // Adresa
  const address = document.createElement('div');
  address.textContent = cinema.address;
  link.appendChild(address);

  // Slika
  if (cinema.image_url) {
    const image = document.createElement('img');
    image.src = cinema.image_url;
    image.alt = cinema.name;
    link.appendChild(image);
  }

  // Ubaci sve u kontejner
  container.appendChild(link);
});
