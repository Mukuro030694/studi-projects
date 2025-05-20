function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("active");
}

document.getElementById('login-form').addEventListener('connexion', function(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userType = document.getElementById('userType').value;

  const response = fetch('server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, userType })
  })

  const result = response.json();
  if(response.ok) {
    localStorage.setItem('token', result.token);
    window.location.href = 'login.html';
  } else {
    alert('Invalid email or password');
  }
});

document.getElementById('register-form').addEventListener('inscription', function(event) {
  event.preventDefault();

  const email = document.getElementById('new-email').value;
  const password = document.getElementById('new-password').value;
  const passwordConfirmation = document.getElementById('new-password-confirmation').value;
  const name = document.getElementById('new-name').value;

  const response = fetch('server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, passwordConfirmation, name })
  })

  const result = response.json();
  if(response.ok) {
    localStorage.setItem('token', result.token);
    window.location.href = 'login.html';
  } else {
    alert('Registration failed');
  }
});
