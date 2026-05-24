// ===== ADMIN LOGIN FORM =====
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = adminLoginForm.querySelector('button[type="submit"]');
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

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
        // Check if user has admin role
        if (data.customer.role !== 'admin') {
          alert('Access denied. Admin privileges required.');
          btn.innerHTML = 'Admin Login <i class="fas fa-arrow-right"></i>';
          btn.disabled = false;
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('customer', JSON.stringify(data.customer));
        alert('Admin login successful!');
        window.location.href = 'admin.html';
      } else {
        alert(data.message || 'Login failed');
        btn.innerHTML = 'Admin Login <i class="fas fa-arrow-right"></i>';
        btn.disabled = false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in. Please try again.');
      btn.innerHTML = 'Admin Login <i class="fas fa-arrow-right"></i>';
      btn.disabled = false;
    }
  });
}
