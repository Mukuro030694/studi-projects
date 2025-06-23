// Toggle side menu
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("active");
}

// Login Form
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const userType = document.getElementById('userType').value;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, type: userType })
    });

    const result = await res.json();
    if (res.ok) {
      localStorage.setItem('token', result.token || 'fake-jwt-token');
      localStorage.setItem('userType', result.userType);
      localStorage.setItem('userName', result.userName);

      window.location.href = `dashboard-${userType}.html`;
    } else {
      alert(result.error || 'Email, mot de passe ou type incorrect');
    }
  });
}

// Register Form
const registerForm = document.getElementById('reg-form');
if (registerForm) {
  registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('new-email').value.trim();
    const password = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('new-password-confirmation').value.trim();
    const name = document.getElementById('new-name').value.trim();
    const userType = document.getElementById('new-userType').value;

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, type: userType })
    });

    const result = await res.json();
    if (res.ok) {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', name);

      window.location.href = `dashboard-${userType}.html`;
    } else {
      alert(result.error || 'Erreur lors de l\'inscription');
    }
  });
}

// Ride Search
const form = document.getElementById('ride-search');
const resultsSection = document.getElementById('results');
if (form && resultsSection) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    resultsSection.innerHTML = '<p>Chargement...</p>';

    const res = await fetch('/api/rides');
    const rides = await res.json();

    const available = rides.filter(ride => ride.seats > 0);
    resultsSection.innerHTML = '';

    if (available.length > 0) {
      available.forEach(ride => {
        const rideCard = document.createElement('div');
        rideCard.className = 'ride-card';
        rideCard.innerHTML = `
          <h3>${ride.driver}</h3>
          <p>Places restantes : ${ride.seats}</p>
          <p>Prix : ${ride.price}€</p>
          <p>Départ : ${ride.date} à ${ride.departure}</p>
          <p>Arrivée : ${ride.arrival}</p>
          <p>${ride.eco ? '🚗 Voyage écologique' : ''}</p>
          <button>Voir le détail</button>
          <button class="reserve-btn">Participer</button>
        `;
        resultsSection.appendChild(rideCard);
      });
    } else {
      resultsSection.innerHTML = `<p>Aucun itinéraire trouvé.</p>`;
    }
  });
}

// Ride Creation + Chauffeur preferences
document.getElementById('user-role')?.addEventListener('change', function () {
  const role = this.value;
  const chauffeurInfo = document.getElementById('chauffeur-info');
  chauffeurInfo.style.display = (role === 'chauffeur' || role === 'both') ? 'block' : 'none';

  const saisieVoyageDiv = document.getElementById('saisie-voyage');
  if (saisieVoyageDiv) {
    saisieVoyageDiv.style.display = (role === 'chauffeur' || role === 'both') ? 'block' : 'none';
  }
});

document.getElementById('save-role')?.addEventListener('click', async function () {
  const role = document.getElementById('user-role').value;

  if (role === 'chauffeur' || role === 'both') {
    const vehiculeData = {
      plaque: document.getElementById('plaque').value,
      dateImmat: document.getElementById('date-immat').value,
      modele: document.getElementById('modele').value,
      couleur: document.getElementById('couleur').value,
      marque: document.getElementById('marque').value,
      places: parseInt(document.getElementById('places').value),
      fumeur: document.getElementById('fumeur').checked,
      animaux: document.getElementById('animaux').checked,
      autres: document.getElementById('autres-preferences').value
    };

    alert("Infos chauffeur enregistrées !");
  } else {
    alert("Rôle enregistré comme passager !");
  }
});
