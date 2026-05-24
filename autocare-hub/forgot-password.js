// ===== FORGOT PASSWORD FORM =====
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = forgotPasswordForm.querySelector('button[type="submit"]');
    const email = document.getElementById('resetEmail').value;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        
        // For testing purposes, show the reset link
        if (data.token) {
          alert('Reset link: http://localhost:5000/reset-password.html?token=' + data.token);
          window.location.href = 'reset-password.html?token=' + data.token;
        } else {
          forgotPasswordForm.reset();
          btn.innerHTML = 'Send Reset Link <i class="fas fa-paper-plane"></i>';
          btn.disabled = false;
        }
      } else {
        alert(data.message || 'Failed to send reset link');
        btn.innerHTML = 'Send Reset Link <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending reset link. Please try again.');
      btn.innerHTML = 'Send Reset Link <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
    }
  });
}
