// Toggle the side menu
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("active");
}

//* Login Form */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const userType = document.getElementById('userType').value;

    //fake users
    const fakeUsers = [
      { email: 'admin@eco.com', password: 'admin123', type: 'admin' },
      { email: 'employe@eco.com', password: 'emp123', type: 'employee' },
      { email: 'client@eco.com', password: 'user123', type: 'user' }
    ];

    const found = fakeUsers.find(u => u.email === email && u.password === password && u.type === userType);

    if (found) {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('userType', userType);

      switch (userType) {
        case 'admin':
          window.location.href = 'dashboard-admin.html';
          break;
        case 'employee':
          window.location.href = 'dashboard-employee.html';
          break;
        case 'user':
          window.location.href = 'dashboard-user.html';
          break;
      }
    } else {
      alert('Email, mot de passe ou type incorrect');
    }
  });
}

//create a new account
const registerForm = document.getElementById('reg-form');
if (registerForm) {
  registerForm.addEventListener('submit', function (event) {
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

    // Simulate a user registration
    const newUser = {
      email,
      password,
      name,
      type: userType
    };

    // Save "token" and type
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', name);

    switch (userType) {
      case 'admin':
        window.location.href = 'dashboard-admin.html';
        break;
      case 'employee':
        window.location.href = 'dashboard-employee.html';
        break;
      case 'user':
        window.location.href = 'dashboard-user.html';
        break;
    }
  });
}

//* Ride Search */
const form = document.getElementById('ride-search');
const resultsSection = document.getElementById('results');
if (form && resultsSection) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const start = document.getElementById('start-city').value.trim();
    const end = document.getElementById('end-city').value.trim();
    const date = document.getElementById('ride-date').value;

    const mockRides = [
      {
        driver: 'JeanD',
        photo: '../FastRide/assets/img/drivers/portrait_0_0.png',
        rating: 4.8,
        seats: 2,
        price: '12€',
        departure: '08:00',
        arrival: '09:30',
        date: date,
        eco: true
      },
      {
        driver: 'MarcusT',
        photo: '../FastRide/assets/img/drivers/portrait_0_1.png',
        rating: 4.5,
        seats: 1,
        price: '10€',
        departure: '10:00',
        arrival: '11:20',
        date: date,
        eco: false
      }
    ];

    resultsSection.innerHTML = '';

    const available = mockRides.filter(ride => ride.seats > 0);

    if (available.length > 0) {
      available.forEach(ride => {
        const rideCard = document.createElement('div');
        rideCard.className = 'ride-card';
        rideCard.innerHTML = `
          <img src="${ride.photo}" alt="${ride.driver}" class="driver-photo" />
          <h3>${ride.driver} (${ride.rating}★)</h3>
          <p>Places restantes : ${ride.seats}</p>
          <p>Prix : ${ride.price}</p>
          <p>Départ : ${ride.date} à ${ride.departure}</p>
          <p>Arrivée : ${ride.arrival}</p>
          <p>${ride.eco ? '🚗 Voyage écologique' : ''}</p>
          <button>Voir le détail</button>
          <button class="reserve-btn">Participer</button>
        `;
        resultsSection.appendChild(rideCard);
      });
      const reserveBtns = document.querySelectorAll('.reserve-btn');
      reserveBtns.forEach(btn => {
        btn.addEventListener('click', function () {
          window.location.href = 'login.html';
        });
      });
    } else {
      resultsSection.innerHTML = `<p>Aucun itinéraire trouvé. Essayez une autre date.</p>`;
    }
  });
}
