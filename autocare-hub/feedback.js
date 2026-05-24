// ===== FEEDBACK FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
  // ===== STAR RATING =====
  const starRating = document.getElementById('starRating');
  const ratingValue = document.getElementById('ratingValue');
  const ratingText = document.getElementById('ratingText');

  if (starRating) {
    const stars = starRating.querySelectorAll('i');
    
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        ratingValue.value = rating;
        
        // Update star visuals
        stars.forEach((s, index) => {
          if (index < rating) {
            s.classList.add('active');
            s.style.color = '#fbbf24';
          } else {
            s.classList.remove('active');
            s.style.color = '#4b5563';
          }
        });
        
        // Update text
        const ratingTexts = ['Select a rating', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        ratingText.textContent = ratingTexts[rating];
      });
      
      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating);
        stars.forEach((s, index) => {
          if (index < rating) {
            s.style.color = '#fbbf24';
          } else {
            s.style.color = '#4b5563';
          }
        });
      });
      
      star.addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingValue.value);
        stars.forEach((s, index) => {
          if (index < currentRating) {
            s.style.color = '#fbbf24';
          } else {
            s.style.color = '#4b5563';
          }
        });
      });
    });
  }

  // ===== FEEDBACK FORM =====
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = feedbackForm.querySelector('button[type="submit"]');
      
      const name = document.getElementById('feedbackName').value;
      const service = document.getElementById('feedbackService').value;
      const rating = parseInt(document.getElementById('ratingValue').value);
      const message = document.getElementById('feedbackMessage').value;
      
      if (rating === 0) {
        alert('Please select a rating');
        return;
      }
      
      if (!message || message.trim() === '') {
        alert('Please enter your feedback message');
        return;
      }
      
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      btn.disabled = true;
      
      try {
        const customer = JSON.parse(localStorage.getItem('customer'));
        
        const feedbackData = {
          rating,
          message
        };
        
        // Only include name if provided
        if (name && name.trim() !== '') {
          feedbackData.name = name.trim();
        } else {
          feedbackData.name = 'Anonymous';
        }
        
        // Only include service if provided
        if (service && service.trim() !== '') {
          feedbackData.service = service.trim();
        }
        
        if (customer) {
          feedbackData.customer = customer.id;
        }
        
        console.log('Submitting feedback:', feedbackData);
        
        const response = await fetch('http://localhost:5000/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(feedbackData)
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
          alert('Thank you for your feedback!');
          feedbackForm.reset();
          ratingValue.value = 0;
          ratingText.textContent = 'Select a rating';
          const stars = starRating.querySelectorAll('i');
          stars.forEach(s => s.style.color = '#4b5563');
        } else {
          alert(data.message || 'Failed to submit feedback');
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback. Please try again.');
      } finally {
        btn.innerHTML = 'Submit Feedback <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
      }
    });
  }
});
