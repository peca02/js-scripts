const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'
const supabase = createClient(supabaseUrl, supabaseKey)
// Sve gore je povezivanje sa Supabase

const signUpForm = document.getElementById('signup-form');
const formDone = document.querySelector('.w-form-done');

signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const messageDiv = document.getElementById('signup-message');
  

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            first_name: firstName,
            last_name: lastName
        },
        redirectTo: 'https://cinema-proxy.djordjevicpredrag2002-2d8.workers.dev/cinema/sign-up-log-in' // Dodajte ovde vaš redirect URL

    }
});
  
  if (error) {
    console.error('Signup error:', error.message);
    messageDiv.textContent = `Error: ${error.message}`;
    messageDiv.style.color = 'red';
  } else {
    console.log('Signup success:', data);
    signUpForm.style.display = 'none';
    formDone.style.display = 'block';
  }
})

const logInForm = document.getElementById('login-form');

logInForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();

  const email = document.getElementById('email-2').value;
  const password = document.getElementById('password-2').value;
  const messageDiv = document.getElementById('login-message');
  

  const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

  if (error) {
    console.error('Signup error:', error.message);
    messageDiv.textContent = `Error: ${error.message}`;
    messageDiv.style.color = 'red';
  } else {
    console.log('Signup success:', data);
  }
})
