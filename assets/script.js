// ============================
// MODERN ANIMATIONS & INTERACTIONS
// ============================

// Initialize all animations on page load
document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initScrollSpyNav();
  initScrollAnimations();
  initCharacterAnimation();
  initSkillBars();
  initContactFormEnhancements();
});

// ============================
// 1. HAMBURGER MENU
// ============================
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    hamburger.classList.toggle('active');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburger.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      hamburger.classList.remove('active');
    }
  });
}

// ============================
// 2. SCROLL SPY NAVIGATION
// ============================
function initScrollSpyNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('text-yellow-300', 'border-b-2', 'border-yellow-300', 'font-medium');
      link.classList.add('text-white');

      if (link.getAttribute('href').includes(current)) {
        link.classList.remove('text-white');
        link.classList.add('text-yellow-300', 'border-b-2', 'border-yellow-300', 'font-medium');
      }
    });
  });
}

// ============================
// 3. SCROLL ANIMATIONS (Intersection Observer)
// ============================
function initScrollAnimations() {
  const scrollElements = document.querySelectorAll('.scroll-animate');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay untuk multiple elements
        const index = Array.from(scrollElements).indexOf(entry.target);
        const delay = index * 0.1;

        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, Math.min(delay * 100, 500));

        // Unobserve setelah animasi selesai
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  scrollElements.forEach(el => observer.observe(el));
}

// ============================
// 4. CHARACTER ANIMATION (Hero Text)
// ============================
function initCharacterAnimation() {
  const heading = document.querySelector('h1');
  if (!heading) return;

  // Get the original text
  const originalHTML = heading.innerHTML;
  
  // Replace text nodes with character spans
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      const fragment = document.createDocumentFragment();

      // Split by space to keep formatting
      const words = text.split(/(\s+)/);
      
      words.forEach(word => {
        if (word.trim() === '') {
          fragment.appendChild(document.createTextNode(word));
        } else {
          word.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'text-animate';
            span.textContent = char;
            fragment.appendChild(span);
          });
        }
      });

      return fragment;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      Array.from(node.childNodes).forEach(child => {
        const processed = processNode(child);
        if (processed) {
          clone.appendChild(processed);
        }
      });
      return clone;
    }
    return node;
  };

  // Apply character animation
  const spans = heading.querySelectorAll('.text-animate');
  let charIndex = 0;
  
  spans.forEach((span, index) => {
    // Calculate total delay based on position
    const delay = index * 0.08;
    span.style.animationDelay = `${delay}s`;
  });
}

// ============================
// 5. SKILL BARS ANIMATION
// ============================
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        
        if (width) {
          bar.style.setProperty('--width', width);
          bar.style.animation = 'none';
          
          // Trigger reflow untuk restart animation
          void bar.offsetWidth;
          
          bar.style.animation = `skill-fill 1.5s ease-out forwards`;
        }

        observer.unobserve(bar);
      }
    });
  }, observerOptions);

  skillBars.forEach(bar => observer.observe(bar));
}

// ============================
// 6. CONTACT FORM ENHANCEMENTS
// ============================
function initContactFormEnhancements() {
  const form = document.querySelector('form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    // Focus effect
    input.addEventListener('focus', function() {
      this.parentElement?.classList.add('ring-2', 'ring-yellow-400');
    });

    input.addEventListener('blur', function() {
      this.parentElement?.classList.remove('ring-2', 'ring-yellow-400');
    });

    // Ripple effect on click
    input.addEventListener('click', function(e) {
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
    });
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple validation
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector('textarea').value.trim();

    if (!name || !email || !message) {
      showNotification('Silakan isi semua field', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showNotification('Email tidak valid', 'error');
      return;
    }

    // Success notification
    showNotification('Pesan berhasil dikirim! 🎉', 'success');
    
    // Reset form
    form.reset();

    // Here you can add API call or send email
    // Example:
    // sendFormData({ name, email, message });
  });
}

// ============================
// 7. UTILITY FUNCTIONS
// ============================

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-5 right-5 px-6 py-3 rounded-lg text-white text-sm font-medium z-[9999] animate-fade-in`;
  
  if (type === 'success') {
    notification.className += ' bg-green-500';
  } else if (type === 'error') {
    notification.className += ' bg-red-500';
  } else {
    notification.className += ' bg-blue-500';
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove('animate-fade-in');
    notification.classList.add('opacity-0');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================
// 8. SMOOTH SCROLL ENHANCEMENTS
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================
// 9. PARALLAX EFFECT (Optional - Subtle)
// ============================
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(el => {
      const scrollPosition = window.scrollY;
      const offset = scrollPosition * 0.5;
      el.style.transform = `translateY(${offset}px)`;
    });
  });
}

// Initialize parallax if needed
// initParallax();

// ============================
// 10. PAGE LOAD ANIMATION
// ============================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger initial animations
  const initialElements = document.querySelectorAll('.animate-fade-in, .animate-fade-in-delayed');
  initialElements.forEach(el => {
    el.style.animationPlayState = 'running';
  });
});

// ============================
// 11. PERFORMANCE MONITORING
// ============================
if (window.location.hash === '#debug') {
  console.log('🎨 Custom Animation Framework Loaded');
  console.log('📱 Responsive Design Active');
  console.log('⚡ Performance Optimizations Enabled');
}
