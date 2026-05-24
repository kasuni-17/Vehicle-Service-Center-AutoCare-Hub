// ===== LOGIN FORM =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('button[type="submit"]');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    btn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('customer', JSON.stringify(data.customer));
        alert('Login successful!');
        window.location.href = 'dashboard.html';
      } else {
        alert(data.message || 'Login failed');
        btn.innerHTML = 'Sign In <i class="fas fa-arrow-right"></i>';
        btn.disabled = false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in. Please try again.');
      btn.innerHTML = 'Sign In <i class="fas fa-arrow-right"></i>';
      btn.disabled = false;
    }
  });
}

// ===== REGISTER FORM =====
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = registerForm.querySelector('button[type="submit"]');
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    btn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('customer', JSON.stringify(data.customer));
        alert('Registration successful!');
        window.location.href = 'dashboard.html';
      } else {
        alert(data.message || 'Registration failed');
        btn.innerHTML = 'Create Account <i class="fas fa-arrow-right"></i>';
        btn.disabled = false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating account. Please try again.');
      btn.innerHTML = 'Create Account <i class="fas fa-arrow-right"></i>';
      btn.disabled = false;
    }
  });
}

// ===== CHECK AUTH STATUS =====
function checkAuth() {
  const token = localStorage.getItem('token');
  const customer = JSON.parse(localStorage.getItem('customer'));
  
  if (token && customer) {
    // Update UI to show logged in state
    const loginLinks = document.querySelectorAll('.login-link');
    loginLinks.forEach(link => {
      link.textContent = `Hi, ${customer.name}`;
      link.href = '#';
    });

    // Update user menu
    const userIcon = document.getElementById('userIcon');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginBtn');

    if (userIcon) {
      userIcon.href = 'dashboard.html';
      userName.textContent = customer.name;
      userEmail.textContent = customer.email;
      dashboardLink.style.display = 'flex';
      logoutBtn.style.display = 'flex';
      loginBtn.style.display = 'none';
    }
  } else {
    // Update user menu for guest
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginBtn');

    if (userName) {
      userName.textContent = 'Guest';
      userEmail.textContent = 'Not logged in';
      dashboardLink.style.display = 'none';
      logoutBtn.style.display = 'none';
      loginBtn.style.display = 'flex';
    }
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // ===== USER MENU DROPDOWN =====
  const userIcon = document.getElementById('userIcon');
  const userDropdown = document.getElementById('userDropdown');

  if (userIcon && userDropdown) {
    userIcon.addEventListener('click', (e) => {
      e.preventDefault();
      userDropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('open');
      }
    });
  }

  // ===== LOGOUT BUTTON =====
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('customer');
      window.location.href = 'index.html';
    });
  }
});
