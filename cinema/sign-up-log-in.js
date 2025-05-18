const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabaseUrl = 'https://ypestrqwjqmgkpidrdct.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZXN0cnF3anFtZ2twaWRyZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODQ3MzIsImV4cCI6MjA2MDE2MDczMn0.jIpa-xwIDEdcqBIAFW4NBAtPIvdQRLiaKUwp51p_HkY'
const supabase = createClient(supabaseUrl, supabaseKey)
// Sve gore je povezivanje sa Supabase

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const messageDiv = document.getElementById('signup-message')

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    messageDiv.textContent = `Error: ${error.message}`
    messageDiv.style.color = 'red'
  } else {
    console.log('Signup success:', data)
    messageDiv.textContent = 'Signup successful! Check your email to confirm.'
    messageDiv.style.color = 'green'
  }
})
