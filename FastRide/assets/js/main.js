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

// Ride creation
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

// Save car info
async function saveCarInfo(vehiculeData) {
  try {
    const res = await fetch('/api/car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(vehiculeData)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de l\'enregistrement du véhicule');
    alert('Véhicule enregistré avec succès !');
    return result;
  } catch (err) {
    alert(err.message);
  }
}

// Save ride
async function saveRide() {
  const ride = {
    depart: document.getElementById('depart').value,
    arrivee: document.getElementById('arrivee').value,
    prix: parseFloat(document.getElementById('prix').value),
    vehicule: document.getElementById('vehicule-existant').value
  };

  if (!ride.depart || !ride.arrivee || isNaN(ride.prix) || !ride.vehicule) {
    alert('Veuillez remplir tous les champs de la section "Saisir un voyage".');
    return;
  }

  try {
    const res = await fetch('/api/ride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(ride)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la création du trajet');
    alert('Voyage enregistré avec succès !');
  } catch (err) {
    alert(err.message);
  }
}

// Save user role + chauffeur info
document.getElementById('save-role')?.addEventListener('click', async function () {
  const role = document.getElementById('user-role').value;

  try {
    const res = await fetch('/api/set-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ role })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de l\'enregistrement du rôle');
  } catch (err) {
    alert(err.message);
    return;
  }

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

    await saveCarInfo(vehiculeData);
    await saveRide();
  }

  alert("Rôle et données enregistrés !");
});

document.getElementById('ajouter-vehicule')?.addEventListener('click', () => {
  document.getElementById('chauffeur-info').scrollIntoView({ behavior: 'smooth' });
});

// Load rides for employee dashboard
async function loadRidesForEmployee() {
  try {
    const res = await fetch('/api/rides', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const rides = await res.json();
    if (!res.ok) throw new Error(rides.error || 'Erreur lors du chargement des trajets');

    const container = document.getElementById('rides-container');
    container.innerHTML = '';

    rides.forEach(ride => {
      const rideDiv = document.createElement('div');
      rideDiv.className = 'ride-block';
      rideDiv.innerHTML = `
        <h3>${ride.depart} → ${ride.arrivee}</h3>
        <p>Prix : ${ride.prix} crédits</p>
        <h4>Commentaires</h4>
        <ul>
          ${ride.comments.map(comment => `
            <li>
              ${comment.text} - par ${comment.authorName}
              ${!comment.validated ? `
                <button onclick="validateComment(${comment.id})">Valider</button>
              ` : '<span style="color:green">Validé</span>'}
              <button onclick="deleteComment(${comment.id})" style="color:red">Supprimer</button>
            </li>
          `).join('')}
        </ul>
      `;
      container.appendChild(rideDiv);
    });

  } catch (err) {
    console.error(err);
    alert('Impossible de charger les voyages.');
  }
}

async function validateComment(commentId) {
  try {
    const res = await fetch(`/api/comments/${commentId}/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la validation');
    alert('Commentaire validé !');
    loadRidesForEmployee(); // Load updated rides
  } catch (err) {
    alert(err.message);
  }
}

async function deleteComment(commentId) {
  if (!confirm('Supprimer ce commentaire ?')) return;

  try {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression');
    alert('Commentaire supprimé.');
    loadRidesForEmployee();
  } catch (err) {
    alert(err.message);
  }
}

// Load rides for employee dashboard on page load
if (window.location.pathname.includes('dashboard-employee.html')) {
  document.addEventListener('DOMContentLoaded', loadRidesForEmployee);
}

// Download and display user list for admin dashboard
async function loadUsers() {
  try {
    const res = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const users = await res.json();
    if (!res.ok) throw new Error(users.error || 'Erreur lors du chargement des utilisateurs');

    const container = document.getElementById('users-container');
    if (users.length === 0) {
      container.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
      return;
    }

    container.innerHTML = '<ul>' + users.map(user => `
      <li>
        <strong>${user.name}</strong> (${user.email}) - Rôle: ${user.role}
        <button onclick="deleteUser(${user.id})" style="color:red; margin-left:10px;">Supprimer</button>
      </li>
    `).join('') + '</ul>';
  } catch (err) {
    alert(err.message);
  }
}

async function deleteUser(userId) {
  if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;

  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression');
    alert('Utilisateur supprimé.');
    loadUsers();
  } catch (err) {
    alert(err.message);
  }
}

// Download and display ride statistics
async function loadRideStats() {
  try {
    const res = await fetch('/api/stats/rides-per-day', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement des stats');

    const labels = data.map(entry => entry.date);
    const counts = data.map(entry => entry.count);

    const ctx = document.getElementById('rides-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Trajets par jour',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  } catch (err) {
    alert(err.message);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadRideStats();
});
