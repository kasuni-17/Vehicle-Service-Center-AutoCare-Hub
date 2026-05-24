// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== SCROLL ANIMATIONS =====
const aosElements = document.querySelectorAll('[data-aos]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });
aosElements.forEach(el => observer.observe(el));

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const loginPrompt = document.getElementById('loginPrompt');
const bookingForm = document.getElementById('bookingForm');

if (loginPrompt && bookingForm) {
  // Check if user is logged in
  const customer = JSON.parse(localStorage.getItem('customer'));
  const token = localStorage.getItem('token');

  if (!customer || !token) {
    // Show login prompt, hide form
    loginPrompt.style.display = 'block';
    bookingForm.style.display = 'none';
  } else {
    // Show form, hide login prompt
    loginPrompt.style.display = 'none';
    bookingForm.style.display = 'block';

    // Pre-fill customer data
    document.getElementById('name').value = customer.name;
    document.getElementById('email').value = customer.email;
    document.getElementById('phone').value = customer.phone;
  }
}

if (contactForm) {
  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    const customer = JSON.parse(localStorage.getItem('customer'));
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('service').value,
      vehicle: document.getElementById('vehicle').value,
      date: document.getElementById('date').value,
      message: document.getElementById('message').value
    };

    // Add customer ID if logged in
    const token = localStorage.getItem('token');
    if (token && customer) {
      formData.customer = customer.id;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        contactForm.reset();
      } else {
        alert('Failed to submit booking. Please try again.');
        btn.innerHTML = 'Send Booking Request <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting booking. Please try again.');
      btn.innerHTML = 'Send Booking Request <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
    }
  });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== NAVBAR ACTIVE LINK HIGHLIGHT =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num, .story-stat span');
  counters.forEach(counter => {
    const target = counter.textContent.replace(/[^0-9]/g, '');
    if (!target) return;
    const suffix = counter.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = Math.ceil(Number(target) / 60);
    const interval = setInterval(() => {
      current = Math.min(current + increment, Number(target));
      counter.textContent = current + suffix;
      if (current >= Number(target)) clearInterval(interval);
    }, 30);
  });
}

// Trigger counters when hero is visible
const heroSection = document.querySelector('.hero, .about-story');
if (heroSection) {
  const counterObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      counterObs.disconnect();
    }
  }, { threshold: 0.3 });
  counterObs.observe(heroSection);
}
