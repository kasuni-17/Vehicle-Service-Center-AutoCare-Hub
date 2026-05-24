// ===== RESET PASSWORD FORM =====
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    alert('Invalid or missing reset token');
    window.location.href = 'forgot-password.html';
    return;
  }

  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = resetPasswordForm.querySelector('button[type="submit"]');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    btn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successful! Please login with your new password.');
        window.location.href = 'login.html';
      } else {
        alert(data.message || 'Failed to reset password');
        btn.innerHTML = 'Reset Password <i class="fas fa-check"></i>';
        btn.disabled = false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error resetting password. Please try again.');
      btn.innerHTML = 'Reset Password <i class="fas fa-check"></i>';
      btn.disabled = false;
    }
  });
}
