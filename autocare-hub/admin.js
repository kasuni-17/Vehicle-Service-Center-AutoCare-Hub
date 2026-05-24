// ===== ADMIN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in and has admin role
  const customer = JSON.parse(localStorage.getItem('customer'));
  const token = localStorage.getItem('token');

  if (!customer || !token) {
    alert('Access denied. Please login first.');
    window.location.href = 'admin-login.html';
    return;
  }

  // Check if user has admin role
  if (customer.role !== 'admin') {
    alert('Access denied. Admin privileges required.');
    window.location.href = 'dashboard.html';
    return;
  }

  loadBookings();
  loadStats();

  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show/hide sections
      document.getElementById('bookingsSection').style.display = tab === 'bookings' ? 'block' : 'none';
      document.getElementById('feedbackSection').style.display = tab === 'feedback' ? 'block' : 'none';
      
      // Load data
      if (tab === 'bookings') {
        loadBookings();
      } else {
        loadFeedback();
      }
    });
  });

  // Refresh buttons
  document.getElementById('refreshBtn').addEventListener('click', loadBookings);
  document.getElementById('refreshFeedbackBtn').addEventListener('click', loadFeedback);

  // Status filter
  document.getElementById('statusFilter').addEventListener('change', loadBookings);

  // Rating filter
  document.getElementById('ratingFilter').addEventListener('change', loadFeedback);
});

// ===== LOAD STATS =====
async function loadStats() {
  try {
    // Load bookings stats
    const bookingsResponse = await fetch('http://localhost:5000/api/bookings');
    const bookings = await bookingsResponse.json();
    
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('pendingBookings').textContent = pendingBookings;
    document.getElementById('completedBookings').textContent = completedBookings;
    
    // Load feedback stats
    const feedbackResponse = await fetch('http://localhost:5000/api/feedback');
    const feedbacks = await feedbackResponse.json();
    
    document.getElementById('totalFeedback').textContent = feedbacks.length;
    
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// ===== LOAD ALL BOOKINGS =====
async function loadBookings() {
  const statusFilter = document.getElementById('statusFilter').value;
  const tbody = document.getElementById('bookingsTableBody');

  try {
    const response = await fetch('http://localhost:5000/api/bookings');
    let bookings = await response.json();

    // Filter by status
    if (statusFilter !== 'all') {
      bookings = bookings.filter(b => b.status === statusFilter);
    }

    if (bookings.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="loading">
            <i class="fas fa-inbox"></i> No bookings found
          </td>
        </tr>
      `;
      return;
    }

    // Render bookings
    const bookingsHTML = bookings.map(booking => `
      <tr>
        <td>
          <strong>${booking.name}</strong><br/>
          <small>${booking.email}</small><br/>
          <small>${booking.phone}</small>
        </td>
        <td>${booking.service}</td>
        <td>${booking.vehicle}</td>
        <td>${new Date(booking.date).toLocaleDateString()}</td>
        <td><span class="booking-status ${booking.status}">${booking.status}</span></td>
        <td>
          ${booking.status === 'pending' ? `
            <button class="action-btn confirm" onclick="updateBookingStatus('${booking._id}', 'confirmed')">
              <i class="fas fa-check"></i> Confirm
            </button>
            <button class="action-btn cancel" onclick="updateBookingStatus('${booking._id}', 'cancelled')">
              <i class="fas fa-times"></i> Cancel
            </button>
          ` : ''}
          ${booking.status === 'confirmed' ? `
            <button class="action-btn complete" onclick="updateBookingStatus('${booking._id}', 'completed')">
              <i class="fas fa-check-double"></i> Complete
            </button>
            <button class="action-btn cancel" onclick="updateBookingStatus('${booking._id}', 'cancelled')">
              <i class="fas fa-times"></i> Cancel
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');

    tbody.innerHTML = bookingsHTML;

  } catch (error) {
    console.error('Error loading bookings:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="loading">
          <i class="fas fa-exclamation-circle"></i> Error loading bookings
        </td>
      </tr>
    `;
  }
}

// ===== UPDATE BOOKING STATUS =====
async function updateBookingStatus(bookingId, status) {
  if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      alert(`Booking marked as ${status}`);
      loadBookings();
    } else {
      alert('Failed to update booking status');
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    alert('Error updating booking');
  }
}

// ===== LOAD ALL FEEDBACK =====
async function loadFeedback() {
  const ratingFilter = document.getElementById('ratingFilter').value;
  const feedbackList = document.getElementById('feedbackList');

  try {
    const response = await fetch('http://localhost:5000/api/feedback');
    let feedbacks = await response.json();

    // Filter by rating
    if (ratingFilter !== 'all') {
      feedbacks = feedbacks.filter(f => f.rating === parseInt(ratingFilter));
    }

    if (feedbacks.length === 0) {
      feedbackList.innerHTML = `
        <div class="loading">
          <i class="fas fa-inbox"></i> No feedback found
        </div>
      `;
      return;
    }

    // Render feedback
    const feedbackHTML = feedbacks.map(feedback => {
      const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
      const date = new Date(feedback.createdAt).toLocaleDateString();
      
      return `
        <div class="feedback-card">
          <div class="feedback-header">
            <div class="feedback-name">
              <i class="fas fa-user"></i> ${feedback.name || 'Anonymous'}
            </div>
            <div class="feedback-date">${date}</div>
          </div>
          <div class="feedback-rating">
            <span class="stars">${stars}</span>
            <span class="rating-number">${feedback.rating}/5</span>
          </div>
          ${feedback.service ? `<div class="feedback-service"><i class="fas fa-car"></i> ${feedback.service}</div>` : ''}
          <div class="feedback-message">${feedback.message}</div>
        </div>
      `;
    }).join('');

    feedbackList.innerHTML = feedbackHTML;

  } catch (error) {
    console.error('Error loading feedback:', error);
    feedbackList.innerHTML = `
      <div class="loading">
        <i class="fas fa-exclamation-circle"></i> Error loading feedback
      </div>
    `;
  }
}
